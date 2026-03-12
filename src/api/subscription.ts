import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export type CreateSubscriptionInput = Schema["Subscription"]["createType"];
export type UpdateSubscriptionInput = Schema["Subscription"]["updateType"];

/**
 * List user's subscriptions
 */
export const listSubscriptions = async (): Promise<
  Schema["Subscription"]["type"][]
> => {
  const result = await client.models.Subscription.list();
  if (!result.data) {
    console.error("Failed to list subscriptions:", result.errors);
    return [];
  }
  return result.data;
};

/**
 * Get subscription by ID
 */
export const getSubscription = async (
  identifier: Schema["Subscription"]["identifier"],
): Promise<Schema["Subscription"]["type"] | null> => {
  const result = await client.models.Subscription.get(identifier);
  if (!result.data) {
    console.error("Failed to get subscription:", result.errors);
    return null;
  }
  return result.data;
};

/**
 * Create subscription
 */
export const createSubscription = async (
  input: CreateSubscriptionInput,
): Promise<Schema["Subscription"]["type"]> => {
  const result = await client.models.Subscription.create(input);

  if (!result.data) {
    console.error("Failed to create subscription:", result.errors);
    throw new Error("Failed to create subscription");
  }

  return result.data;
};

/**
 * Update subscription
 */
export const updateSubscription = async (
  input: UpdateSubscriptionInput,
): Promise<Schema["Subscription"]["type"]> => {
  const result = await client.models.Subscription.update(input);

  if (!result.data) {
    console.error("Failed to update subscription:", result.errors);
    throw new Error("Failed to update subscription");
  }

  return result.data;
};

/**
 * Delete subscription
 */
export const deleteSubscription = async (
  identifier: Schema["Subscription"]["identifier"],
): Promise<void> => {
  const result = await client.models.Subscription.delete(identifier);

  if (result.errors) {
    console.error("Failed to delete subscription:", result.errors);
    throw new Error("Failed to delete subscription");
  }
};
