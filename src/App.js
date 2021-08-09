import React, { useState, useEffect } from "react";
import axios from "axios";
import { AllHtmlEntities } from "html-entities";

const entities = new AllHtmlEntities();

const randint = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const App = () => {
  const [question, setQuestion] = useState(null);
  const [possibleAnswers, setPossibleAnswers] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const new_question = async () => {
    setLoading(true);

    const data = await axios
      .get("https://opentdb.com/api.php?amount=1&category=17&type=boolean")
      .then((response) => {
        return response.data;
      });

    const question_data = data.results[0];

    let possible_answers = [...question_data.incorrect_answers];
    possible_answers.splice(
      randint(0, possible_answers.length),
      0,
      question_data.correct_answer
    );

    setQuestion(question_data);
    setPossibleAnswers(possible_answers);
    setCorrectAnswer(question_data.correct_answer);
    setLoading(false);
  };

  function handleChoice(answer_text) {
    if (answer_text === correctAnswer) {
      setScore(score + 1);
    } else {
      if (score > highScore) {
        setHighScore(score);
      }
      setScore(0);
    }
    new_question();
  }

  useEffect(() => {
    new_question();
  }, []);

  return (
    <div className="w-full h-screen flex flex-row justify-center bg-gray-900 text-white">
      <div className="flex flex-col justify-center">
        <div className="py-3">
          <div>Highscore: {highScore}</div>
          <div>Score: {score}</div>
        </div>

        {loading ? (
          <div> loading... </div>
        ) : (
          <>
            <div className="w-96">
              <div className="bg-gray-500 border border-white rounded-lg px-4 py-1">
                {entities.decode(question.question)}
              </div>
              <div className="flex justify-around py-4">
                <div
                  className="bg-gray-500 border border-white rounded-lg px-4 py-1 hover:bg-gray-700"
                  onClick={() => handleChoice(possibleAnswers[0])}
                >
                  {possibleAnswers[0]}
                </div>
                <div
                  className="bg-gray-500 border border-white rounded-lg px-4 py-1 hover:bg-gray-700"
                  onClick={() => handleChoice(possibleAnswers[1])}
                >
                  {possibleAnswers[1]}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
