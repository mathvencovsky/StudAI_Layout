# Amplify Known Problems

Known issues and workarounds for AWS Amplify Gen 2.

## `functionHandler` type has wrong event shape at runtime

Amplify's `Schema["myQuery"]["functionHandler"]` type uses `AppSyncResolverHandler` from `aws-lambda`, which types `fieldName` under `event.info.fieldName`. At runtime, Amplify custom query handlers receive `fieldName` at the top level (`event.fieldName`), not nested under `info`.

In our environment, `event.info` is `undefined` at runtime, but this may not be the case in all environments or future Amplify versions. Always access `fieldName` with a fallback: `event.fieldName || event.info.fieldName` to handle both cases.

When writing shared handlers that route based on `fieldName`, use the `SharedHandler` utility type from `amplify/utils/types.ts` which extends `AppSyncResolverEvent` with the top-level `fieldName`.

Wrong way:

```ts
// ❌ event.info is undefined at runtime
export const handler: Schema["myQuery"]["functionHandler"] = async (event) => {
  const field = event.info.fieldName;
};
```

Correct way:

```ts
import type { SharedHandler } from "../../utils/types";
import type { Schema } from "../resource";

type MyHandler = SharedHandler<Schema["myQuery"]["functionHandler"]>;

// ✅ event.fieldName exists at runtime
export const handler: MyHandler = async (event) => {
  const field = event.fieldName || event.info.fieldName;
};
```
