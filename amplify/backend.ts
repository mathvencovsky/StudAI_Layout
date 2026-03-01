import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { chatHandler, data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
  chatHandler,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

cfnUserPool.addPropertyOverride("VerificationMessageTemplate", {
  DefaultEmailOption: "CONFIRM_WITH_LINK",
  EmailMessageByLink: "Please verify your email by clicking the link: {##Verify Your Email##}",
  EmailSubjectByLink: "Verify your email",
});
