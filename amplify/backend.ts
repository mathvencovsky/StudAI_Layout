import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { chatHandler, data } from "./data/resource";

defineBackend({
  auth,
  data,
  chatHandler,
});
