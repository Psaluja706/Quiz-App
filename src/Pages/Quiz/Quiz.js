import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Question from "../../components/Question/Question";
import "./Quiz.css";

const Quiz = ({ name, questions, score, setScore, setQuestions }) => {
  const history = useHistory();
  const [options, setOptions] = useState();
  const [currQues, setCurrQues] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (questions) {
      setOptions(
        handleShuffle([
          questions[currQues]?.correct_answer,
          ...questions[currQues]?.incorrect_answers,
        ])
      );
    }
  }, [currQues, questions]);


  const handleShuffle = (options) => {
    return options.sort(() => Math.random() - 0.5);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds} ${remainingSeconds <= 60 ? 'seconds' : 'minutes'}`;
  };
  const decrementTimer = () => {
    if (timeRemaining > 0) {
      setTimeRemaining(timeRemaining - 1);
    } else {
      setQuizCompleted(true);
    }
  };
  useEffect(() => {
    if (!quizCompleted) {
      const timerInterval = setInterval(decrementTimer, 1000);

      return () => {
        clearInterval(timerInterval);
      };
    }
    else {
      history.push("/result");
    }
  }, [quizCompleted, decrementTimer]);

  return (
    <div className="quiz">
      {!quizCompleted && (
        <>
        <span className="subtitle">Welcome, {name}</span>
      <div>
        <p className="mt-3">Time Remaining: {formatTime(timeRemaining)}</p>
      </div>
      {questions ? (
        <>
          <div className="quizInfo">
            <span>{questions[currQues]?.category}</span>
            <span>
              Score : {score}
            </span>
          </div>
          <Question
            currQues={currQues}
            setCurrQues={setCurrQues}
            questions={questions}
            options={options}
            correct={questions[currQues]?.correct_answer}
            score={score}
            setScore={setScore}
            setQuestions={setQuestions}
          />
        </>
      ) : (
        <CircularProgress
          style={{ margin: 100 }}
          color="inherit"
          size={150}
          thickness={1}
        />
      )}
        </>
      )}
    </div>
  );
};

export default Quiz;
