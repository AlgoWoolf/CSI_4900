import React, { useState } from 'react';
import '../css/Quiz.css';

function Quiz({ quizType, questions, onSubmit }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (e, questionId) => {
    setAnswers({ ...answers, [questionId]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only score multiple-choice questions; text answers (like name) are used for identification.
    let score = 0;
    questions.forEach((q) => {
      if (q.type !== "text" && answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    onSubmit(score, answers);
  };

  return (
    <div className="quiz-container">
      <h2>{quizType === "pre" ? "Pre-Quiz" : "Post-Quiz"}</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="quiz-question">
            <p>{q.question}</p>
            {q.type === "text" ? (
              <input
                type="text"
                name={q.id}
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(e, q.id)}
                required
              />
            ) : (
              q.options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    onChange={(e) => handleChange(e, q.id)}
                    required
                  />
                  {option}
                </label>
              ))
            )}
          </div>
        ))}
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
}

export default Quiz;
