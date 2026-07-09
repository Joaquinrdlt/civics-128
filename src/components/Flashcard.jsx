// shows one question and toggles the answer when clicked
import { useState, useEffect } from "react";

function Flashcard({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  // Resets the answer visibility whenever the question changes (for the randomizer mode)
  useEffect(() => {
    setShowAnswer(false);
  }, [question]);

  return (
    <div
      className="flashcard"
      onClick={() => setShowAnswer(!showAnswer)}
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        margin: "10px",
        cursor: "pointer",
        borderRadius: "8px",
        background: "#f9f9f9",
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
