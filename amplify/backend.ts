import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { chatHandler, data } from "./data/resource";
import { stripeBillingHandler } from "./functions/stripe-billing/resource";
import { Stack } from "aws-cdk-lib";
import {
  Table,
  AttributeType,
  BillingMode,
} from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { CfnUserPool } from "aws-cdk-lib/aws-cognito";

const backend = defineBackend({
  auth,
  data,
  chatHandler,
  stripeBillingHandler,
});

const billingStack = backend.stripeBillingHandler.resources.lambda.stack as Stack;

// ─── UserUsageLimits DynamoDB table ──────────────────────────────────────────
const userUsageTable = new Table(billingStack, "UserUsageLimitsTable", {
  tableName: `UserUsageLimits-${billingStack.stackName}`,
  partitionKey: { name: "userId", type: AttributeType.STRING },
  sortKey: { name: "featureKey", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  timeToLiveAttribute: "ttl",
});

backend.stripeBillingHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:Query"],
    resources: [userUsageTable.tableArn],
  }),
);
backend.stripeBillingHandler.resources.lambda.addEnvironment("USER_USAGE_TABLE", userUsageTable.tableName);

// ─── AnalyticsEvents DynamoDB table ──────────────────────────────────────────
// Stores backend-authoritative product analytics events.
// PK: id (String), GSI: eventName + createdAt for admin queries.
const analyticsTable = new Table(billingStack, "AnalyticsEventsTable", {
  tableName: `AnalyticsEvents-${billingStack.stackName}`,
  partitionKey: { name: "id", type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST,
  timeToLiveAttribute: "ttl", // Auto-expire events after 90 days
});

// GSI for querying events by name + time (used by admin metrics)
analyticsTable.addGlobalSecondaryIndex({
  indexName: "eventName-createdAt-index",
  partitionKey: { name: "eventName", type: AttributeType.STRING },
  sortKey: { name: "createdAt", type: AttributeType.STRING },
});

backend.stripeBillingHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["dynamodb:PutItem", "dynamodb:Query", "dynamodb:GetItem"],
    resources: [analyticsTable.tableArn, `${analyticsTable.tableArn}/index/*`],
  }),
);
backend.stripeBillingHandler.resources.lambda.addEnvironment("ANALYTICS_TABLE", analyticsTable.tableName);

// ─── Cognito User Pool customization ─────────────────────────────────────────
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.addPropertyOverride("VerificationMessageTemplate", {
  DefaultEmailOption: "CONFIRM_WITH_LINK",
  EmailMessageByLink: "Please verify your email by clicking the link: {##Verify Your Email##}",
  EmailSubjectByLink: "Verify your email",
});

// ─── Chat handler: inject Cognito context for JWT verification ────────────────
// The chat handler Lambda verifies JWTs using the Cognito JWKS endpoint.
// It needs the User Pool ID and region to construct the JWKS URL and validate
// the token issuer. These are non-secret configuration values.
const userPoolId = (backend.auth.resources.cfnResources.cfnUserPool as CfnUserPool).ref;
const awsRegion = Stack.of(backend.auth.resources.cfnResources.cfnUserPool).region;

backend.chatHandler.resources.lambda.addEnvironment(
  "COGNITO_USER_POOL_ID",
  userPoolId,
);
backend.chatHandler.resources.lambda.addEnvironment(
  "COGNITO_REGION",
  awsRegion,
);

// The chat handler also needs access to the DynamoDB tables for entitlement
// enforcement. Grant read/write access to the usage and subscriptions tables.
backend.chatHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
    resources: [userUsageTable.tableArn],
  }),
);
backend.chatHandler.resources.lambda.addEnvironment(
  "USER_USAGE_TABLE",
  userUsageTable.tableName,
);

// Grant read access to the subscriptions table so the chat handler can check
// the user's plan (Free vs Pro) for entitlement enforcement.
// The subscriptions table ARN is constructed from the billing stack.
// Note: SUBSCRIPTIONS_TABLE is also injected into the billing Lambda by
// the Amplify backend framework — we reference the same table here.
const subscriptionsTableName = `Subscriptions-${billingStack.stackName}`;
backend.chatHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["dynamodb:GetItem"],
    resources: [
      `arn:aws:dynamodb:${awsRegion}:*:table/${subscriptionsTableName}`,
    ],
  }),
);
backend.chatHandler.resources.lambda.addEnvironment(
  "SUBSCRIPTIONS_TABLE",
  subscriptionsTableName,
);
