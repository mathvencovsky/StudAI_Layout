import { defineAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    "custom:display_name": {
      dataType: "String",
      mutable: true,
      maxLen: 50,
      minLen: 1,
    },
  },
  groups: ["Admin"],
});
