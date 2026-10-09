import { defineAuth } from "@aws-amplify/backend";

// Use email addresses for account creation and sign-in.
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
