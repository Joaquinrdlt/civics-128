// src/App.jsx
import { useState } from "react";
import FlashcardList from "./components/FlashcardList";
import Flashcard from "./components/Flashcard";
import questions from "./data/questions";

function App() {
  const [mode, setMode] = useState("list"); // "list" or "random"
  const [deck, setDeck] = useState([...questions]); // shuffled deck
  const [index, setIndex] = useState(0);

  // Shuffle deck once when switching to random mode
  const shuffleDeck = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setIndex(0);
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % deck.length);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Civics Flashcards</h1>

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
      </div>

      {mode === "list" ? (
        <FlashcardList questions={questions} />
      ) : (
        <div>
          <Flashcard
            key={index} // ensures fresh state each card
            question={deck[index].question}
            answer={deck[index].answer}
          />
          <button onClick={nextCard}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
