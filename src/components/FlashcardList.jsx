// loops through all questions and shows a flashcard for each
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
