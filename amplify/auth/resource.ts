import { defineAuth, secret } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: secret("GOOGLE_CLIENT_ID"),
        clientSecret: secret("GOOGLE_CLIENT_SECRET"),
        scopes: ["email", "profile", "openid"],
        attributeMapping: {
          email: "email",
          emailVerified: "email_verified",
          familyName: "family_name",
          givenName: "given_name",
          fullname: "name",
          profilePicture: "picture",
          locale: "locale",
        },
      },
      callbackUrls: [
        "http://localhost:5173/",
        "https://staging.d3c8vwdhq21nu3.amplifyapp.com/",
        "https://main.d3c8vwdhq21nu3.amplifyapp.com/",
      ],
      logoutUrls: [
        "http://localhost:5173/",
        "https://staging.d3c8vwdhq21nu3.amplifyapp.com/",
        "https://main.d3c8vwdhq21nu3.amplifyapp.com/",
      ],
    },
  },
  userAttributes: {
    "custom:display_name": {
      dataType: "String",
      mutable: true,
      maxLen: 50,
      minLen: 1,
    },
  },
  groups: ["Admin", "Ai"],
});
