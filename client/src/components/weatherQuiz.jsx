import React, { useState } from "react";
import { toast } from "react-toastify";

const weatherTriviaQuestions = [
  {
    question: "What is the hottest temperature ever recorded on Earth?",
    options: ["56.7°C", "50.3°C", "45.0°C", "40.1°C"],
    answer: "56.7°C",
  },
  {
    question: "Which is the driest place on Earth?",
    options: ["Atacama Desert", "Sahara Desert", "Arctic", "Antarctica"],
    answer: "Atacama Desert",
  },
  {
    question: "What is the standard unit for measuring temperature?",
    options: ["Celsius", "Fahrenheit", "Kelvin", "All of the above"],
    answer: "All of the above",
  },
];

const WeatherTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === weatherTriviaQuestions[currentQuestionIndex].answer) {
      setScore(score + 1);
      toast.success("Correct Answer!");
    } else {
      toast.error("Wrong Answer!");
    }
  };

  const nextQuestion = () => {
    setAnswered(false);
    setSelectedAnswer("");
    if (currentQuestionIndex < weatherTriviaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast.info(`Your score: ${score}/${weatherTriviaQuestions.length}`);
      setCurrentQuestionIndex(0); // Reset the game
      setScore(0); // Reset score
    }
  };

  return (
    <div className="weather-trivia bg-blue-100 p-6 rounded-lg shadow-md w-full max-w-xl mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-4 text-center">Weather Trivia</h2>
      <div className="question-container mb-6">
        <p className="text-xl font-medium mb-2">{weatherTriviaQuestions[currentQuestionIndex].question}</p>
        <div className="options flex flex-col">
          {weatherTriviaQuestions[currentQuestionIndex].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`py-2 px-4 rounded-lg my-2 text-lg font-medium border-2 
              ${selectedAnswer === option ? (selectedAnswer === weatherTriviaQuestions[currentQuestionIndex].answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-white text-blue-800'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={nextQuestion}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ease-in-out"
        disabled={!answered}
      >
        {currentQuestionIndex < weatherTriviaQuestions.length - 1 ? "Next Question" : "Restart Game"}
      </button>
    </div>
  );
};

export default WeatherTrivia;
