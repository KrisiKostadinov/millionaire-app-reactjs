import { useEffect, useState } from "react";
import useSound from "use-sound";
import "./App.css";
import Timer from "./components/Timer";
import Trivia from "./components/Trivia";
import background from "./assets/images/background.jpg";
import { pyramid, questions } from "./constants";
import music1 from "./assets/sounds/music-1.mp3";
import wait from "./assets/sounds/wait.mp3";

function App() {
  const [_stop, setStop] = useState(false);
  const [earned, setEarned] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [backgroundMusic, backgroundMusicFuncs] = useSound(music1);
  const [waitMusic, waitFuncs] = useSound(wait);

  useEffect(() => {
    backgroundMusicFuncs.stop();
    backgroundMusic();
  }, [backgroundMusic]);

  useEffect(() => {
    pyramid.reverse();
  }, []);

  const playAgain = () => {
    setEarned(0);
    setQuestionNumber(1);
    setStop(false);
    backgroundMusicFuncs.stop();
    waitFuncs.stop();
    backgroundMusic();
  };

  useEffect(() => {
    setEarned(pyramid[pyramid.length - 1 - (questionNumber - 2)]?.amount);
  }, [questionNumber]);

  return (
    <div className="wrapper">
      <div
        className="trivia"
        style={{
          backgroundImage: `linear-gradient(to bottom, #ffffff00, #00065b), url(${background})`,
        }}
      >
        {_stop ? (
          <div className="trivia-end">
            <div>You earned: ${earned}</div>
            <button className="play-again" onClick={playAgain}>
              Play again
            </button>
          </div>
        ) : (
          <>
            <div className="timer">
              <Timer
                setStop={setStop}
                questionNumber={questionNumber}
                selectedAnswer={selectedAnswer}
                waitMusic={waitMusic}
                backgroundMusicFuncs={backgroundMusicFuncs}
              />
            </div>
            <Trivia
              questions={questions}
              questionNumber={questionNumber}
              setStop={setStop}
              setQuestionNumber={setQuestionNumber}
              selectedAnswer={selectedAnswer}
              setSelectedAnswer={setSelectedAnswer}
              waitMusic={waitMusic}
              waitFuncs={waitFuncs}
              backgroundMusicFuncs={backgroundMusicFuncs}
            />
          </>
        )}
      </div>
      <div className="pyramid">
        <ul className="money-list">
          {pyramid.map((item) => (
            <li
              className={`item ${questionNumber === item.id ? "active" : ""}`}
              key={item.id}
            >
              <span>{item.id}</span>
              <span>$ {item.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
