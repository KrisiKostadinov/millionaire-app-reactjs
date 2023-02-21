import React, { useEffect, useState } from "react";
import useSound from "use-sound";

import letsPlaySound from "../assets/sounds/play.mp3";
import correctAnswerSound from "../assets/sounds/correct.mp3";
import wrongAnswerSound from "../assets/sounds/wrong.mp3";
import finalAnswerSound from "../assets/sounds/final-answer.mp3";

const Trivia = ({
  questions,
  setStop,
  questionNumber,
  setQuestionNumber,
  waitMusic,
  waitFuncs,
  backgroundMusicFuncs,
}) => {
  const [question, setQuestion] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState();
  const [answerClass, setAnswerClass] = useState();

  const [letsPlay] = useSound(letsPlaySound);
  const [correctAnswer] = useSound(correctAnswerSound);
  const [wrongAnswer] = useSound(wrongAnswerSound);
  const [finalAnswer, finalAnswerFuncs] = useSound(finalAnswerSound);

  useEffect(() => {
    waitFuncs.stop();
    letsPlay();
  }, [letsPlay]);

  const delay = (duration, callback) => {
    setTimeout(() => {
      callback();
    }, duration);
  };

  const handleClickAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (question.answers[answer].correct) {
      delay(1000, () => {
        setAnswerClass("correct");
        correctAnswer();

        delay(2000, () => {
          if (questionNumber + 1 <= questions.length) {
            setQuestionNumber(questionNumber + 1);
          } else {
            setStop(true);
            waitMusic();
            finalAnswerFuncs.stop();
            backgroundMusicFuncs.stop();
          }
          setAnswerClass(null);
          setSelectedAnswer(null);
        });
      });
    } else {
      delay(1000, () => {
        setAnswerClass("wrong");
        wrongAnswer();

        delay(2000, () => {
          setAnswerClass(null);
          setSelectedAnswer(null);
          setStop(true);
          waitMusic();
          finalAnswerFuncs.stop();
          backgroundMusicFuncs.stop();
        });
      });
    }
  };

  useEffect(() => {
    const nextQuestion = questions?.find((q) => q.id === questionNumber);
    nextQuestion.answers = nextQuestion.answers.sort(
      (a, b) => 0.5 - Math.random(4)
    );
    setQuestion(nextQuestion);
    if (questionNumber === questions.length) {
      finalAnswer();
      backgroundMusicFuncs.stop();
    }
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
