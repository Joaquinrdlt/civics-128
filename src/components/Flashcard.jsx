import { useState, useEffect } from "react";

function Flashcard({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  // Hide the previous answer when the random deck moves to a new question.
  useEffect(() => {
    setShowAnswer(false);
  }, [question]);

  // The card supports mouse, touch, and keyboard input.
  return (
    <div
      className="flashcard"
      onClick={() => setShowAnswer(!showAnswer)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setShowAnswer((visible) => !visible);
        }
      }}
    >
      <h3>{question}</h3>
      {showAnswer && (
        <p>
          <strong>{answer}</strong>
        </p>
      )}
    </div>
  );
}

export default Flashcard;
