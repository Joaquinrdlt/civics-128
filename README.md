# Civics Flashcards (USCIS 128 Questions)

A React + Vite web app to study for the U.S. citizenship civics test.  
This project displays all 128 USCIS civics questions as interactive flashcards.

## Features

- **List View**: See all flashcards at once, click to reveal answers.
- **Random View**: Study one card at a time, with:
  - Next / Previous navigation
  - Progress tracker (e.g., "Card 5 of 128")
  - Restart Deck button (reshuffles and resets)
- **Mock Exam**: Practice with 20 random questions and a 12-correct passing score.
- **Study More**: Revisit questions missed in mock exams.
- **Amplify sign-in and sync**: Save missed-question counts to the signed-in user's account. (reshuffles and resets)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/civics-128.git
cd civics-128
npm install
```

### AWS Amplify backend

The Amplify Gen 2 backend in `amplify/` provides email sign-in and a per-user
Study More data model. Each user's records are owner-authorized, so users can
only access their own missed questions.

To run the backend in a personal AWS sandbox, configure AWS credentials locally
and run:

```bash
npm run sandbox
```

This provisions AWS resources and generates the local `amplify_outputs.json`
configuration file. The file is intentionally gitignored; the build copies it
into `dist/` when present. Without backend outputs, the app keeps using
browser-local storage.

For a hosted deployment, connect the repository and branch in the AWS Amplify
console and enable full-stack backend deployment for the branch. The Amplify
build needs permission to deploy the backend resources. After the backend is
deployed, the app presents the Amplify email sign-in screen and syncs Study More
with the signed-in account.
