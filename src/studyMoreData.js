import { generateClient } from "aws-amplify/data";

// Create an Amplify Data client for the signed-in user's Study More records.
function getClient() {
  return generateClient();
}

// Amplify may return GraphQL errors without throwing, so surface them here.
function throwOnErrors(errors) {
  if (errors?.length) {
    throw new Error(errors.map((error) => error.message).join("; "));
  }
}

export async function loadMissCounts() {
  const client = getClient();
  const records = [];
  let nextToken;

  // Read every page so users with many saved questions get a complete list.
  do {
    const response = await client.models.StudyQuestion.list({
      limit: 100,
      nextToken,
    });
    throwOnErrors(response.errors);
    records.push(...response.data);
    nextToken = response.nextToken;
  } while (nextToken);

  return Object.fromEntries(
    records.map(({ questionId, missCount }) => [questionId, missCount]),
  );
}

export async function recordIncorrectAnswer(questionId) {
  const client = getClient();
  const response = await client.models.StudyQuestion.list({
    filter: {
      questionId: {
        eq: questionId,
      },
    },
    limit: 100,
  });
  throwOnErrors(response.errors);

  // Increment an existing record or create the first record for this question.
  const existing = response.data[0];
  const saveResponse = existing
    ? await client.models.StudyQuestion.update({
        id: existing.id,
        missCount: existing.missCount + 1,
      })
    : await client.models.StudyQuestion.create({
        questionId,
        missCount: 1,
      });

  throwOnErrors(saveResponse.errors);
  if (!saveResponse.data) {
    throw new Error("The missed question could not be saved.");
  }
}

export async function removeMissedQuestion(questionId) {
  const client = getClient();
  const response = await client.models.StudyQuestion.list({
    filter: {
      questionId: {
        eq: questionId,
      },
    },
    limit: 100,
  });
  throwOnErrors(response.errors);

  // Delete any matching records so the question is fully cleared from the list.
  for (const record of response.data) {
    const deleteResponse = await client.models.StudyQuestion.delete({
      id: record.id,
    });
    throwOnErrors(deleteResponse.errors);
  }
}
