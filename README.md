# Civics Flashcards

A responsive study app for the 128 U.S. civics questions used to prepare for the naturalization interview, designed for use on desktop and mobile. Study with flashcards, review a shuffled deck, or try a threshold-based mock exam. Signed-in users can keep a personal list of questions to study again.

## Live Demo

[Open Civics Flashcards](https://main.d3821p9d6gjds9.amplifyapp.com/)

## Features

- **Flashcard list** — Browse all questions and reveal answers by clicking, tapping, or using the keyboard.
- **Random study mode** — Review one shuffled question at a time, track progress, move between cards, or reshuffle the deck.
- **Mock exam** — Answer up to 20 randomly selected questions. The exam ends when you reach 12 correct answers (pass) or 8 incorrect answers (fail). Answers are self-scored after you reveal them.
- **Study More** — Signed-in users can revisit questions they answered incorrectly in mock exams, see how often they missed each one, and remove a question after learning it.
- **Accounts and saved progress** — AWS Amplify provides email sign-in and stores each user's missed-question data separately.
- **Responsive layout** — The study controls, flashcards, and sign-in dialog adapt to phones and larger screens.

## Technology

- React 19
- Vite
- AWS Amplify Gen 2 (Cognito authentication and Amplify Data)
- AWS AppSync and DynamoDB through Amplify Data

## Run locally

### Requirements

- Node.js 22.12 or newer
- npm

### Start the app

```bash
git clone https://github.com/Joaquinrdlt/civics-128.git
cd civics-128
npm install
npm run dev
```

Open the local URL printed by Vite.

The frontend can be explored without AWS configuration. Cloud sign-in and
cross-device Study More syncing require Amplify backend outputs.

### Enable the Amplify backend locally

Configure AWS credentials for your account, then run:

```bash
npm run sandbox
```

Amplify provisions a development backend and generates `amplify_outputs.json`.
The app reads this file to configure authentication and data access. It is
intentionally excluded from version control; the production build copies it into
`dist/` when it is available.

> **AWS costs:** Creating or using cloud resources may incur charges depending on your account, region, and usage. Check AWS pricing and billing before provisioning resources.

## Deploy with AWS Amplify

Connect this GitHub repository to AWS Amplify Hosting and enable full-stack
deployments for the branch. The root [`amplify.yml`](./amplify.yml) defines the
backend and frontend build steps and uses Node.js 22.12.0.

The backend creates an email-based Cognito user pool and a `StudyQuestion` data
model. Records are owner-authorized, so each signed-in user can access their
own missed-question data. Amplify generates the frontend configuration during
deployment; the build copies it into the published `dist/` directory.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run lint` | Check the source with Oxlint |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run sandbox` | Provision or update the local Amplify sandbox |

## Project structure

```text
amplify/       Amplify authentication, data model, and backend setup
scripts/       Build helper for generated Amplify outputs
src/
  components/  Flashcards, mock exam, and Study More UI
  data/        Civics question and answer content
  App.jsx          Study modes and application state
  AppBootstrap.jsx  Amplify initialization and sign-in flow
  index.css        App-wide and responsive styles
```
