import React, { useEffect, useState } from "react";
import useSound from "use-sound";

import letsPlaySound from "../assets/sounds/play.mp3";
import correctAnswerSound from "../assets/sounds/correct.mp3";
import wrongAnswerSound from "../assets/sounds/wrong.mp3";

const Trivia = ({ questions, setStop, questionNumber, setQuestionNumber }) => {
  const [question, setQuestion] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [answerClass, setAnswerClass] = useState();

  const [letsPlay] = useSound(letsPlaySound);
  const [correct] = useSound(correctAnswerSound);
  const [wrong] = useSound(wrongAnswerSound);

  useEffect(() => {
    letsPlay();
  }, [letsPlay]);

  const delay = (duration, callback) => {
    setTimeout(() => {
        callback();
    }, duration);
  }
  
  const handleClickAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (question.answers[answer].correct) {
      delay(1000, () => {
        setAnswerClass("correct");
        correct();

        delay(2000, () => {
          if (questionNumber + 1 <= questions.length) {
            setQuestionNumber(questionNumber + 1);
          } else {
            setStop(true);
          }
          setAnswerClass(null);
          setSelectedAnswer(null);
        });
      });
    } else {
      delay(1000, () => {
        setAnswerClass("wrong");
        wrong();

        delay(2000, () => {
          setAnswerClass(null);
          setSelectedAnswer(null);
          setStop(true);
        });
      });
    }
  };

  useEffect(() => {
    const nextQuestion = questions?.find(q => q.id === questionNumber);
    nextQuestion.answers = nextQuestion.answers.sort((a, b) => 0.5 - Math.random(4));
    setQuestion(nextQuestion);
  }, [questionNumber]);

  return (
    <div className="trivia-wrapper">
      <div className="title">{question?.title}</div>
      <ul className="answers">
        {question?.answers.map((item, index) => (
          <li
            className={`item ${index === selectedAnswer ? answerClass : ""}`}
            onClick={() => handleClickAnswer(index)}
            key={index}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trivia;
