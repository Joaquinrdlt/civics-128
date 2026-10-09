import { useState } from "react";

const EXAM_QUESTION_COUNT = 20;
const PASSING_SCORE = 12;
const FAILING_MISSES = 8;

function createExamDeck(questions) {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled.slice(0, EXAM_QUESTION_COUNT);
}

function MockExam({ questions, onAnswer }) {
  const [examDeck, setExamDeck] = useState(() => createExamDeck(questions));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);

  const restartExam = () => {
    setExamDeck(createExamDeck(questions));
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setAnswerRevealed(false);
    setResult(null);
  };

  const recordAnswer = async (wasCorrect) => {
    const nextCorrectCount = correctCount + (wasCorrect ? 1 : 0);
    const nextWrongCount = wrongCount + (wasCorrect ? 0 : 1);

    setSavingAnswer(true);
    setSaveError("");
    try {
      await onAnswer(examDeck[currentIndex], wasCorrect);
    } catch (error) {
      setSaveError(`Could not save your answer: ${error.message}`);
      setSavingAnswer(false);
      return;
    }

    setCorrectCount(nextCorrectCount);
    setWrongCount(nextWrongCount);
    setAnswerRevealed(false);
    setSavingAnswer(false);

    if (nextCorrectCount >= PASSING_SCORE) {
      setResult("passed");
    } else if (nextWrongCount >= FAILING_MISSES) {
      setResult("failed");
    } else {
      setCurrentIndex((index) => index + 1);
    }
  };

  if (questions.length < EXAM_QUESTION_COUNT) {
    return <p role="alert">The mock exam needs at least 20 questions.</p>;
  }

  if (result) {
    return (
      <section aria-live="polite">
        <h2>{result === "passed" ? "You passed!" : "You did not pass."}</h2>
        <p>
          Final score: {correctCount} correct, {wrongCount} incorrect.
        </p>
        <button onClick={restartExam}>Take Another Mock Exam</button>
      </section>
    );
  }

  const currentQuestion = examDeck[currentIndex];

  return (
    <section>
      <h2>Mock Exam</h2>
      <p>
        Question {currentIndex + 1} of {EXAM_QUESTION_COUNT}
      </p>
      <p>
        Correct: {correctCount} | Incorrect: {wrongCount}
      </p>

      <div
        className="flashcard"
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          margin: "10px",
          borderRadius: "8px",
          background: "#f9f9f9",
        }}
      >
        <h3>{currentQuestion.question}</h3>
        {answerRevealed && (
          <p>
            <strong>{currentQuestion.answer}</strong>
          </p>
        )}
      </div>

      {!answerRevealed ? (
        <button
          onClick={() => setAnswerRevealed(true)}
          disabled={savingAnswer}
        >
          Reveal Answer
        </button>
      ) : (
        <div>
          <p>How did you do?</p>
          {saveError && <p role="alert">{saveError}</p>}
          <button
            onClick={() => recordAnswer(true)}
            disabled={savingAnswer}
          >
            I got it right
          </button>
          <button
            onClick={() => recordAnswer(false)}
            disabled={savingAnswer}
          >
            {savingAnswer ? "Saving..." : "I got it wrong"}
          </button>
        </div>
      )}
    </section>
  );
}

export default MockExam;
