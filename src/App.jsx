// Handles switching between list, random, and mock exam modes.
import { useEffect, useState } from "react";
import FlashcardList from "./components/FlashcardList";
import Flashcard from "./components/Flashcard";
import MockExam from "./components/MockExam";
import StudyMore from "./components/StudyMore";
import {
  loadMissCounts,
  recordIncorrectAnswer,
  removeMissedQuestion,
} from "./studyMoreData";
import questions from "./data/questions";

const STUDY_MORE_STORAGE_KEY = "civics-128-study-more";

function App({ cloudEnabled = false, user, signIn, signOut }) {
  // Track which study screen is currently open.
  const [mode, setMode] = useState("list");
  // Keep a separate deck so random mode can shuffle without changing the source list.
  const [deck, setDeck] = useState([...questions]);
  // Track the selected card while moving through the random deck.
  const [index, setIndex] = useState(0);
  const [missCounts, setMissCounts] = useState(() => {
    if (cloudEnabled) {
      return {};
    }

    const savedCounts = window.localStorage.getItem(STUDY_MORE_STORAGE_KEY);
    return savedCounts ? JSON.parse(savedCounts) : {};
  });
  const [cloudLoading, setCloudLoading] = useState(cloudEnabled);
  const [cloudError, setCloudError] = useState("");
  const [syncAttempt, setSyncAttempt] = useState(0);
  const [localSignInPrompt, setLocalSignInPrompt] = useState(false);
  const isSignedIn = Boolean(user);

  // Keep local progress for previews and signed-out users; signed-in progress comes from the cloud.
  useEffect(() => {
    if (!cloudEnabled || !isSignedIn) {
      window.localStorage.setItem(
        STUDY_MORE_STORAGE_KEY,
        JSON.stringify(missCounts),
      );
    }
  }, [cloudEnabled, isSignedIn, missCounts]);

  // Load this user's saved missed questions after sign-in or when retrying a failed sync.
  useEffect(() => {
    if (!cloudEnabled || !isSignedIn) {
      setCloudLoading(false);
      return undefined;
    }

    let active = true;
    setCloudLoading(true);
    setCloudError("");

    loadMissCounts()
      .then((counts) => {
        if (active) {
          setMissCounts(counts);
        }
      })
      .catch((error) => {
        if (active) {
          setCloudError(`Could not load your Study More list: ${error.message}`);
        }
      })
      .finally(() => {
        if (active) {
          setCloudLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [cloudEnabled, isSignedIn, user?.userId, syncAttempt]);

  // Shuffle a fresh copy of the question list and start from the first card.
  const shuffleDeck = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
  };

  // Wrap around to the start after reaching the end of the deck.
  const nextCard = () => {
    setIndex((prev) => (prev + 1) % deck.length);
  };

  const recordExamAnswer = async (question, wasCorrect) => {
    if (wasCorrect) {
      return;
    }

    if (cloudEnabled && user) {
      await recordIncorrectAnswer(question.id);
    }

    setMissCounts((counts) => ({
      ...counts,
      [question.id]: (counts[question.id] ?? 0) + 1,
    }));
  };

  const removeFromStudyMore = async (questionId) => {
    if (cloudEnabled) {
      await removeMissedQuestion(questionId);
    }

    setMissCounts((counts) => {
      const updatedCounts = { ...counts };
      delete updatedCounts[questionId];
      return updatedCounts;
    });
  };

  const studyMoreQuestions = questions.filter(
    (question) => missCounts[question.id] > 0,
  );

  // Open the real sign-in flow on the deployed app or an explanation in local preview.
  const requestSignIn = () => {
    if (cloudEnabled) {
      signIn();
    } else {
      setLocalSignInPrompt(true);
    }
  };

  const openStudyMore = () => {
    setMode("studyMore");
    if (!isSignedIn) {
      requestSignIn();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Civics Flashcards</h1>
        {cloudEnabled && user ? (
          <button onClick={signOut}>Sign out</button>
        ) : (
          <button onClick={requestSignIn}>Sign in</button>
        )}
      </header>
      {localSignInPrompt && !cloudEnabled && (
        <div className="auth-modal" role="presentation">
          <section
            className="local-sign-in-prompt"
            role="dialog"
            aria-modal="true"
            aria-labelledby="local-sign-in-title"
          >
            <button
              className="auth-modal__close"
              aria-label="Close sign-in message"
              onClick={() => setLocalSignInPrompt(false)}
            >
              ×
            </button>
            <h2 id="local-sign-in-title">Sign in to use Study More</h2>
            <p>
              Sign-in and cross-device Study More sync are available on the
              deployed app. This local preview doesn’t have the AWS sign-in
              configuration.
            </p>
            <button onClick={() => setLocalSignInPrompt(false)}>Close</button>
          </section>
        </div>
      )}
      {cloudError && (
        <p role="alert">
          {cloudError}{" "}
          <button onClick={() => setSyncAttempt((attempt) => attempt + 1)}>
            Retry
          </button>
        </p>
      )}
      {/* Mode Switch */}
      <div className="mode-switch">
        <button onClick={() => setMode("list")}>List View</button>
        <button
          onClick={() => {
            setMode("random");
            shuffleDeck();
          }}
        >
          Random View
        </button>
        <button onClick={() => setMode("mock")}>Mock Exam</button>
        <button onClick={openStudyMore}>
          Study More ({studyMoreQuestions.length})
        </button>
      </div>

      {mode === "list" ? (
        <FlashcardList questions={questions} />
      ) : mode === "studyMore" ? (
        !isSignedIn ? (
          <section>
            <h2>Study More</h2>
            <p>
              {cloudEnabled
                ? "Sign in to see your saved missed questions."
                : "Sign in to see your saved missed questions on the deployed app."}
            </p>
            <button onClick={requestSignIn}>Sign in</button>
          </section>
        ) : cloudLoading ? (
          <p role="status">Loading your Study More questions...</p>
        ) : (
          <StudyMore
            questions={studyMoreQuestions}
            missCounts={missCounts}
            onRemove={removeFromStudyMore}
          />
        )
      ) : mode === "random" ? (
        <div>
          {/* progress tracker */}
          <p className="random-progress">
            Card {index + 1} of {deck.length}
          </p>
          {/* current flashcard */}
          <Flashcard
            key={index} // ensures fresh state each card (for random mode)
            question={deck[index].question}
            answer={deck[index].answer}
          />
          {/* Navigation Buttons */}
          <div className="random-controls">
            <button
              onClick={() =>
                setIndex((prev) => (prev - 1 + deck.length) % deck.length)
              }
            >
              Previous
            </button>
            <button onClick={nextCard}>Next</button>
            <button className="random-restart" onClick={shuffleDeck}>
              Restart Deck
            </button>
          </div>
        </div>
      ) : (
        cloudLoading ? (
          <p role="status">Loading your saved questions...</p>
        ) : (
          <MockExam questions={questions} onAnswer={recordExamAnswer} />
        )
      )}
    </div>
  );
}

export default App;
