import { useState } from "react";
import Flashcard from "./Flashcard";

function StudyMore({ questions, missCounts, onRemove }) {
  const [busyQuestionId, setBusyQuestionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRemove = async (questionId) => {
    setBusyQuestionId(questionId);
    setErrorMessage("");
    try {
      await onRemove(questionId);
    } catch (error) {
      setErrorMessage(`Could not update your Study More list: ${error.message}`);
    } finally {
      setBusyQuestionId(null);
    }
  };

  return (
    <section>
      <h2>Study More</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {questions.length === 0 ? (
        <p>
          No missed questions yet. Questions you miss in a mock exam will show
          up here.
        </p>
      ) : (
        questions.map((question) => (
          <div key={question.id}>
            <p>
              Missed {missCounts[question.id]}{" "}
              {missCounts[question.id] === 1 ? "time" : "times"}
            </p>
            <Flashcard question={question.question} answer={question.answer} />
            <button
              onClick={() => handleRemove(question.id)}
              disabled={busyQuestionId === question.id}
            >
              {busyQuestionId === question.id ? "Saving..." : "Mark as learned"}
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default StudyMore;
