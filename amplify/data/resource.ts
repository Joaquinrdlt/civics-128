import { a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  StudyQuestion: a
    .model({
      questionId: a.integer().required(),
      missCount: a.integer().required(),
    })
    .authorization((allow) => [allow.owner()]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
