import Flashcard from "./Flashcard";

function FlashcardList({ questions }) {
  return (
    <div>
      {/* Reuse the same card component for every question in the list. */}
      {questions.map((q) => (
        <Flashcard key={q.id} question={q.question} answer={q.answer} />
      ))}
    </div>
  );
}

export default FlashcardList;
