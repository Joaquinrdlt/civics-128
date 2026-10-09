import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

// Register the resources that make up the Amplify backend.
defineBackend({
  auth,
  data,
});
