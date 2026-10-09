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

function App({ cloudEnabled = false, user, signOut }) {
  // "list" shows all cards, "random" shows one card at a time, "mock" starts an exam
  const [mode, setMode] = useState("list");
  // holds a shuffled copy of all questions for random mode
  const [deck, setDeck] = useState([...questions]);
  // tracks the current card in use
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

  useEffect(() => {
    if (!cloudEnabled) {
      window.localStorage.setItem(
        STUDY_MORE_STORAGE_KEY,
        JSON.stringify(missCounts),
      );
    }
  }, [cloudEnabled, missCounts]);

  useEffect(() => {
    if (!cloudEnabled) {
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
  }, [cloudEnabled, user?.userId, syncAttempt]);

  // shuffle deck once when switching to random mode
  const shuffleDeck = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
  };

  // moves to the next card in deck
  const nextCard = () => {
    setIndex((prev) => (prev + 1) % deck.length);
  };

  const recordExamAnswer = async (question, wasCorrect) => {
    if (wasCorrect) {
      return;
    }

    if (cloudEnabled) {
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

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Civics Flashcards</h1>
      {cloudEnabled && (
        <p>
          Signed in as {user?.signInDetails?.loginId ?? "your account"}{" "}
          <button onClick={signOut}>Sign out</button>
        </p>
      )}
      {!cloudEnabled && (
        <p role="status">
          Cloud sign-in is not configured yet. Study More is saved in this
          browser until the Amplify backend is deployed.
        </p>
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
      <div style={{ marginBottom: "20px" }}>
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
        <button onClick={() => setMode("studyMore")}>
          Study More ({studyMoreQuestions.length})
        </button>
      </div>

      {mode === "list" ? (
        <FlashcardList questions={questions} />
      ) : mode === "studyMore" ? (
        cloudLoading ? (
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
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            Card {index + 1} of {deck.length}
          </p>
          {/* current flashcard */}
          <Flashcard
            key={index} // ensures fresh state each card (for random mode)
            question={deck[index].question}
            answer={deck[index].answer}
          />
          {/* Navigation Buttons */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() =>
                setIndex((prev) => (prev - 1 + deck.length) % deck.length)
              }
            >
              Previous
            </button>
            <button onClick={nextCard}>Next</button>
            <button onClick={shuffleDeck} style={{ marginLeft: "10px" }}>
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
