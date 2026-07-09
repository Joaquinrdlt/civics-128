// src/components/FlashcardList.jsx
import Flashcard from "./Flashcard";

function FlashcardList({ questions }) {
  return (
    <div>
      {questions.map((q) => (
        <Flashcard key={q.id} question={q.question} answer={q.answer} />
      ))}
    </div>
  );
}

export default FlashcardList;
