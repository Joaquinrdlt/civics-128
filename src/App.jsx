// handles switching between "List view" and "Random view" modes
import { useState } from "react";
import FlashcardList from "./components/FlashcardList";
import Flashcard from "./components/Flashcard";
import questions from "./data/questions";

function App() {
  // "list" shows all cards, "random" shows one card at a time
  const [mode, setMode] = useState("list");
  // holds a shuffled copy of all questions for random mode
  const [deck, setDeck] = useState([...questions]);
  // tracks the current card in use
  const [index, setIndex] = useState(0);

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
      )}
    </div>
  );
}

export default App;
