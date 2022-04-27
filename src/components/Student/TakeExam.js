import React, { useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import css from "./css/TakeExam.module.css";
import { UserContext } from "../../UserContext";
import StudentNavbar from "./StudentNavbar";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import axios from "axios";
import { v1 as createId } from "uuid";
import { MdMinimize, MdArrowBack } from "react-icons/md";
import _ from "lodash";
import PuffLoader from "react-spinners/PuffLoader";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button } from "react-bootstrap";
import { DialogLeavingPage } from "./DialogLeavingPage";
import { useNavigatingAway } from "./takeExamNavigationBlocker/useNavigatingAway";

export default function TakeExam() {
   const { user, setUser } = useContext(UserContext);
   const navigate = useNavigate();
   const { state } = useLocation(); //from ExamDetails.js
   const { examId } = state; //extract examId property from "state" objectc
   const buttonRef = useRef();
   const boxRef = useRef();
   const submitBtnRef = useRef();
   const [exam, setExam] = React.useState({});
   const [questions, setQuestions] = React.useState([]);
   const [startTime, setStartTime] = React.useState(new Date());
   const [endTime, setEndTime] = React.useState(new Date());
   const [timeLimit, setTimeLimit] = React.useState();
   const [timeLimitString, setTimeLimitString] = React.useState();
   const [formattedTime, setFormattedTime] = React.useState();
   const [isExpanded, setIsExpanded] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(true);
   const [isShownSubmitModal, setIsShownSubmitModal] = React.useState(false);
   const [isShownConfirmModal, setIsShownConfirmModal] = React.useState(false);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [isSubmitted, setIsSubmitted] = React.useState(false);
   const [currQuestionNum, setCurrQuestionNum] = React.useState(-1);
   const [answerStates, setAnswerStates] = React.useState([]);
   const [results, setResults] = React.useState([]);
   const [actionLog, setActionLog] = React.useState([]);
   var finishedTime = new Date();
   const [totalScore, setTotalScore] = React.useState(0);
   const [totalPoints, setTotalPoints] = React.useState(0);
   const [basicInfo, setBasicInfo] = React.useState({
      fullName: "",
      studentNumId: "",
   });

   // FOR EXIT CONFIRMATION DIALOG
   const [canShowDialogLeavingPage, setCanShowDialogLeavingPage] = React.useState(true);
   const [showDialogLeavingPage, confirmNavigation, cancelNavigation] =
      useNavigatingAway(canShowDialogLeavingPage);

   async function getExamData() {
      if (examId) {
         await axios({
            method: "POST",
            baseURL: `http://www.localhost:5000/exams/start/${examId}`,
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         })
            .then((res) => {
               if (
                  res.data.registeredExamStatus === "attempted" ||
                  res.data.registeredExamStatus === "submitted"
               ) {
                  setCanShowDialogLeavingPage(false);
                  setTimeout(() => {
                     navigate(`/exam-details/${examId}`);
                  }, 1000);
               } else {
                  setExam(res.data.exam);
                  //TODO: CHANGE BACK TO res.data.exam.status === "closed"
                  if (res.data.exam.status === "closed") {
                     // navigate to exam details if exam is already closed
                     navigate(`/exam-details/${res.data.exam._id}`);
                  } else {
                     const questions_ = [...res.data.questions, ...res.data.questionsFromBanks];
                     setQuestions(questions_); //merge questions into 1 array

                     const currentTime = new Date();
                     const dateTo = new Date(res.data.exam.date_to);
                     const timeLimitInMillis = 1000 * 60 * res.data.exam.time_limit; //convert to millis for subtraction
                     const endDateMinusLimit = new Date(dateTo - timeLimitInMillis);

                     setStartTime(currentTime);
                     //checks if the current time is gt the (endTime - timeLimit) and lt the dateTo
                     if (currentTime > endDateMinusLimit && currentTime < dateTo) {
                        //if student takes exam somewhere between (dateTo - timeLimit) and dateTo,
                        //the timeLimit cannot be the timeLimit set by the faculty, so it should be subtracted
                        const timeDiff = dateTo - currentTime; //time difference between end time and current time
                        const newTimeLimit = Math.floor(timeDiff / 60000); //convert the timeDiff(in Millis) into minutes

                        setTimeLimitString(
                           `${newTimeLimit} ${
                              newTimeLimit === 1 ? "minute" : "minutes"
                           } (originally ${res.data.exam.time_limit} ${
                              res.data.exam.time_limit === 1 ? "minute" : "minutes"
                           })`
                        );
                        setEndTime(new Date(currentTime.getTime() + newTimeLimit * 60000)); //when the exam will end
                        setTimeLimit(newTimeLimit * 60); //convert minutes to seconds
                     } else {
                        setTimeLimitString(
                           res.data.exam.time_limit +
                              (res.data.exam.time_limit === 1 ? " minute" : " minutes")
                        );
                        setEndTime(
                           new Date(currentTime.getTime() + res.data.exam.time_limit * 60000)
                        ); //when the exam will end
                        setTimeLimit(res.data.exam.time_limit * 60); //convert minutes to seconds
                     }

                     //shuffle questions first before randomizing choices
                     setQuestions((prevVal) => _.shuffle(prevVal));

                     //randomize choice for every question
                     setQuestions((prevVal) => {
                        return prevVal.map((val) => {
                           //the index property will be need for checking the correct answers since the value
                           //of the "correctAnswer" pertains to the index of the choice (1-4)
                           //This is needed so that we still have a reference to the index
                           //even if the choices are shuffled
                           const choicesArr = [
                              { choice: val.choice1, index: 1 },
                              { choice: val.choice2, index: 2 },
                              { choice: val.choice3, index: 3 },
                              { choice: val.choice4, index: 4 },
                           ];
                           const shuffledChoices = _.shuffle(choicesArr);
                           return {
                              ...val,
                              shuffledChoices:
                                 shuffledChoices /*new obj property containing array of shiffled questions*/,
                           };
                        });
                     });

                     // gennerate the "answerStates" values
                     //this will generate a state for every question so that all questions are a controlled form
                     const questionsObj = questions_.reduce((result, current, index) => {
                        return Object.assign({ [`question${index}`]: "" }, result); //result is the property to add and the current is the giant object
                     }, {});

                     setAnswerStates(questionsObj);
                     setIsLoading(false);
                  }
               }
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }

   function handleModalClose() {
      setIsShownSubmitModal(false);
   }

   function handleBasicInfoChange(event) {
      const { name, value } = event.target;

      setBasicInfo((prevVal) => ({
         ...prevVal,
         [name]: value,
      }));
   }

   function getNavbar() {
      // identifies what type of navbar to be displayed
      if (user) {
         if (user.userType === "student") {
            return <StudentNavbar username={user.username} />;
         } else if (user.userType === "teacher") {
            return <FacultyNavbar username={user.username} />;
         }
      }
   }

   function formatDate(time) {
      //formats the date passed
      var time_ = time;

      var months = [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ];

      var hour12HrFormat = time_.getHours() % 12 || 12;
      var minutes = time_.getMinutes();

      if (minutes.toString().length === 1) {
         //add 0 to start of number if minutes is a single digit
         minutes = "0" + minutes.toString();
      }

      var ampm = time_.getHours() < 12 || time_.getHours() === 24 ? "AM" : "PM";

      let formattedTime = `${
         months[time_.getMonth()]
      } ${time_.getDate()}, ${hour12HrFormat}:${minutes} ${ampm}`;
      return formattedTime;
   }

   function formatTime(time) {
      //formats time (from seconds to countdown format)
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time / 60) % 60);
      const seconds = Math.floor(time % 60);
      let finalTimeFormat = "";

      if (hours > 0) finalTimeFormat += `${hours} ${hours === 1 ? " hour " : " hours "}`;
      if (minutes > 0) finalTimeFormat += `${minutes} ${minutes === 1 ? " minute " : " minutes "}`;
      //no if statement because seconds will always be present
      finalTimeFormat += `${seconds ? seconds : 0} ${seconds === 1 ? " second" : " seconds"}`;

      setFormattedTime(finalTimeFormat);
   }

   function expand() {
      boxRef.current.style.opacity = 1;
      boxRef.current.style.visibility = "visible";
      boxRef.current.style.transform = "translateX(0)";
      buttonRef.current.style.opacity = 0;
      buttonRef.current.style.visibility = "hidden";
      buttonRef.current.style.transform = "translateX(50px)";
   }

   function collapse() {
      boxRef.current.style.opacity = 0;
      boxRef.current.style.visibility = "hidden";
      boxRef.current.style.transform = "translateX(100px)";
      buttonRef.current.style.opacity = 1;
      buttonRef.current.style.visibility = "visible";
      buttonRef.current.style.transform = "translateX(0)";
   }

   function nextQuestion() {
      setCurrQuestionNum((prevVal) => prevVal + 1);
   }

   function previousQuestion() {
      setCurrQuestionNum((prevVal) => prevVal - 1);
   }

   function goToQuestionNum(questionNum) {
      setCurrQuestionNum(questionNum);
   }

   function handleOnChangeChoice(questionNumber, answerIndex) {
      setAnswerStates((prevVal) => ({
         ...prevVal,
         [questionNumber]: answerIndex,
      }));
   }

   function handleConfirmModalClose() {
      setIsShownConfirmModal(false);
   }

   async function submitExam(event) {
      event.preventDefault();
      finishedTime = new Date();
      setIsShownSubmitModal(false);
      setIsSubmitting(true);

      var totalPoints_ = 0;
      var totalScore_ = 0;
      //CHECK ANSWERS
      //will contain array of boolean if answer is correct for every question
      const results_ = questions.map((val, i) => {
         totalPoints_ += val.points;
         let isCorrect = val.answer === answerStates[`question${i}`];
         if (isCorrect) totalScore_ += val.points;
         return isCorrect; //compare if index selected is equal to the index of correct answer
      });

      setTotalPoints(totalPoints_);
      setTotalScore(totalScore_);
      setResults(results_);

      await axios({
         method: "PATCH",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/exams/`,
         data: {
            details: {
               userId: user.id,
               basicInfo: basicInfo,
               actionLog: actionLog,
               exam: {
                  ...exam,
                  finishedTime: finishedTime,
                  startedTime: startTime,
                  totalPoints: totalPoints_,
                  totalScore: totalScore_,
               },
               results: [...results_],
               questions: [...questions],
               answers: { ...answerStates },
            },
         },
      })
         .then((res) => {
            setTimeout(() => {
               setIsSubmitted(true);
            }, 1000);
         })
         .catch((err) => {
            console.log(err);
            setTimeout(() => {
               setIsSubmitted(true);
            }, 1000);
         });
   }

   function goToExamResults() {
      setCanShowDialogLeavingPage(false);
      setTimeout(() => {
         navigate("/take-exam/results", {
            replace: true, //dont push into history stack so that user wont access the exam after submitting
            //pass exam data and results to results route
            state: {
               studentInfo: basicInfo,
               exam: {
                  ...exam,
                  finishedTime: finishedTime,
                  startedTime: startTime,
                  totalPoints: totalPoints,
                  totalScore: totalScore,
               },
               results: [...results],
               questions: [...questions],
               answers: { ...answerStates },
            },
         });
      }, 1000);
   }

   React.useEffect(() => {
      //the timer starts after the component mounts
      if (timeLimit === 0) {
         document.getElementById("submitBtn").click();
         return;
      }

      const intervalId = setInterval(() => {
         setTimeLimit((prevVal) => {
            let newVal = prevVal - 1; //minus 1 sec every second
            formatTime(newVal);

            return newVal; //stop timer if it is lt or equal to 0
         });
      }, 1000);

      return () => clearInterval(intervalId);
   }, [timeLimit]);

   React.useEffect(() => {
      document.addEventListener("visibilitychange", function () {
         setActionLog((prevVal) => [...prevVal, { time: new Date(), action: "ALT TAB" }]);
      });

      document.addEventListener("mouseleave", function () {
         setActionLog((prevVal) => [...prevVal, { time: new Date(), action: "MOUSE LEAVE" }]);
      });

      document.addEventListener("mouseenter", function () {
         setActionLog((prevVal) => [...prevVal, { time: new Date(), action: "MOUSE ENTER" }]);
      });

      document.title = `Take Exam | Online Examination`;
      if (!localStorage.getItem("token")) {
         navigate("/login");
      } else {
         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
         getExamData();
      }

      return () => {
         document.documentElement.removeEventListener("mouseleave");
         document.documentElement.removeEventListener("mouseenter");
         document.documentElement.removeEventListener("visibilitychange");
      };
   }, []);

   React.useEffect(() => {
      console.log(actionLog);
   });

   //confirmation before leaving page
   //IDK WHAT THIS IS
   // window.onbeforeunload = (event) => {
   //    const e = event || window.event;
   //    // Cancel the event
   //    e.preventDefault();
   //    if (e) {
   //       e.returnValue = ""; // Legacy method for cross browser support
   //    }
   //    return ""; // Legacy method for cross browser support
   // };

   return (
      <>
         {/* NOTE: this page has 3 views that are displayed conditionally: loading view, submitted view, and the main exam */}
         {isLoading ? (
            <AnimatePresence>
               {isLoading && (
                  <motion.div
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className={`${css.examDetails_loading} d-flex flex-column align-items-center justify-content-center min-vh-100`}>
                     <PuffLoader loading={isLoading} color="#9c2a22" size={80} />
                     <p className="lead mt-3">&nbsp;Loading...</p>
                  </motion.div>
               )}
            </AnimatePresence>
         ) : (
            <>
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}>
                  {getNavbar()}

                  {/* for some reason using the ternary operator for isSubmitted renders white screen after the exam is automatically submitted */}
                  {isSubmitted && (
                     // will show only if user submits exam. else, show the exam content
                     <>
                        <div
                           className={`${css.submitted_root} d-flex justify-content-center bg-light`}>
                           <div className={`${css.submitted_container} border mt-5 p-5 bg-white`}>
                              <h3>{exam.title}</h3>
                              <h3 className="lead">Your answers were recorded</h3>
                              <button className="btn btn-primary mt-4" onClick={goToExamResults}>
                                 View Score
                              </button>
                           </div>
                        </div>
                     </>
                  )}

                  {!isSubmitted && (
                     <div className={css.exam_root}>
                        {/* COLLAPSIBLE BOX */}
                        <div
                           ref={buttonRef}
                           className={`${css.expand_button} bg-primary border d-flex justify-content-center align-items-center`}
                           onClick={expand}>
                           <MdArrowBack className={css.expand_icon} />
                        </div>

                        <div ref={boxRef} className={`${css.collapsible} border p-4`}>
                           <button className={css.minimize_btn} onClick={collapse}>
                              <MdMinimize />
                           </button>
                           <div className={`${css.content}`}>
                              <p className="m-0">
                                 <b>Time Remaining</b>:
                              </p>
                              <p>{formattedTime}</p>
                              <h5 className="d-inline">Questions </h5>
                              <span className="text-muted">
                                 {questions.length}{" "}
                                 {questions.length === 1 ? "question" : "questions"}
                              </span>
                              <hr />

                              <ul
                                 className={`${css.questions_list} list-group border border-start-0 border-end-0`}>
                                 <li
                                    key={createId()}
                                    className={`${css.list_item} list-group-item border-top-0 ${
                                       currQuestionNum === -1 && `${css.active_} active`
                                    } ${
                                       basicInfo.fullName &&
                                       basicInfo.studentNumId &&
                                       `list-group-item-primary`
                                    }`}
                                    onClick={() => goToQuestionNum(-1)}>
                                    Examinee Info
                                 </li>

                                 {questions.map((val, i) => {
                                    //remove top border if this question is the first item
                                    if (i === 0)
                                       return (
                                          <li
                                             key={createId()}
                                             className={`${
                                                css.list_item
                                             } list-group-item border-top-0 ${
                                                currQuestionNum === i && `${css.active_} active`
                                             } ${
                                                answerStates[`question${i}`] &&
                                                `list-group-item-primary`
                                             }`}
                                             onClick={() => goToQuestionNum(i)}>
                                             <div>
                                                <span
                                                   className="d-inline-block text-truncate"
                                                   style={{ maxWidth: "240px" }}>
                                                   {i + 1}. {val.question}{" "}
                                                </span>
                                                <span
                                                   className={`float-end ${
                                                      currQuestionNum === i
                                                         ? "text-white"
                                                         : "text-black-50"
                                                   }`}>
                                                   {val.points}{" "}
                                                   {val.points === 1 ? "point" : "points"}
                                                </span>
                                             </div>
                                          </li>
                                       );
                                    //remove bottom border if this question is the last item
                                    else if (i === questions.length - 1)
                                       return (
                                          <li
                                             key={createId()}
                                             className={`${
                                                css.list_item
                                             } list-group-item border-bottom-0 ${
                                                currQuestionNum === i && `${css.active_} active`
                                             } ${
                                                answerStates[`question${i}`] &&
                                                `list-group-item-primary`
                                             }`}
                                             onClick={() => goToQuestionNum(i)}>
                                             <div>
                                                <span
                                                   className="d-inline-block text-truncate"
                                                   style={{ maxWidth: "240px" }}>
                                                   {i + 1}. {val.question}{" "}
                                                </span>
                                                <span
                                                   className={`float-end ${
                                                      currQuestionNum === i
                                                         ? "text-white"
                                                         : "text-black-50"
                                                   }`}>
                                                   {val.points}{" "}
                                                   {val.points === 1 ? "point" : "points"}
                                                </span>
                                             </div>
                                          </li>
                                       );
                                    //else dont remove any borders
                                    else
                                       return (
                                          <li
                                             key={createId()}
                                             className={`${
                                                css.list_item
                                             } list-group-item border-top-0 ${
                                                currQuestionNum === i && `${css.active_} active`
                                             } ${
                                                answerStates[`question${i}`] &&
                                                `list-group-item-primary`
                                             }`}
                                             onClick={() => goToQuestionNum(i)}>
                                             <div>
                                                <span
                                                   className="d-inline-block text-truncate"
                                                   style={{ maxWidth: "240px" }}>
                                                   {i + 1}. {val.question}{" "}
                                                </span>
                                                <span
                                                   className={`float-end ${
                                                      currQuestionNum === i
                                                         ? "text-white"
                                                         : "text-black-50"
                                                   }`}>
                                                   {val.points}{" "}
                                                   {val.points === 1 ? "point" : "points"}
                                                </span>
                                             </div>
                                          </li>
                                       );
                                 })}
                              </ul>
                           </div>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="d-flex justify-content-center">
                           <div className={`${css.exam_container} p-3`}>
                              <div className="exam_head mb-4">
                                 <h1 className="mt-5">{exam.title}</h1>
                                 <hr />
                                 <p className="m-0">
                                    <b>Time limit</b>: {timeLimitString}
                                 </p>
                                 <p className="m-0">
                                    <b>Started</b>: {formatDate(startTime)}
                                 </p>
                                 <p className="m-0">
                                    <b>Ends at</b>: {formatDate(endTime)}
                                 </p>
                                 {exam.directions && (
                                    <div className="mt-4">
                                       <div className="accordion-item">
                                          <h2 className="accordion-header" id="headingOne">
                                             <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne">
                                                Directions
                                             </button>
                                          </h2>
                                          <div
                                             id="collapseOne"
                                             className="accordion-collapse collapse show"
                                             aria-labelledby="headingOne">
                                             <div className="accordion-body">{exam.directions}</div>
                                          </div>
                                       </div>
                                    </div>
                                 )}
                              </div>

                              {/* DISPLAY QUESTIONS */}
                              <form id="examForm" onSubmit={submitExam}>
                                 {currQuestionNum === -1 ? (
                                    <div className="card px-5">
                                       <h3 className="mt-4 mb-4">Examinee Info</h3>
                                       <label htmlFor="name" className="form-label">
                                          Full Name:
                                       </label>
                                       <input
                                          id="name"
                                          type="text"
                                          name="fullName"
                                          className="form-control"
                                          onChange={handleBasicInfoChange}
                                          value={basicInfo.fullName}
                                       />
                                       <label htmlFor="studNum" className="form-label mt-4">
                                          Student Number/Id:
                                       </label>
                                       <input
                                          id="studNum"
                                          type="text"
                                          name="studentNumId"
                                          className="form-control mb-5"
                                          onChange={handleBasicInfoChange}
                                          value={basicInfo.studentNumId}
                                       />
                                    </div>
                                 ) : (
                                    <>
                                       {questions.length > 0 && (
                                          <div className="card p-5">
                                             <div>
                                                <h5 className="m-0 me-3 d-inline">
                                                   Question {currQuestionNum + 1} of{" "}
                                                   {exam.totalItems}
                                                </h5>
                                                <small className="text-muted float-end">
                                                   {questions[currQuestionNum].points}{" "}
                                                   {questions[currQuestionNum].points === 1
                                                      ? "point"
                                                      : "points"}
                                                </small>
                                             </div>

                                             <p className="mt-3">
                                                {questions[currQuestionNum].question}
                                             </p>
                                             <div className="choices mt-4">
                                                {questions[currQuestionNum].shuffledChoices?.map(
                                                   (choice) => (
                                                      <p key={createId()}>
                                                         <input
                                                            id={`question${currQuestionNum}i${choice.index}`}
                                                            type="radio"
                                                            className="me-3"
                                                            onChange={() =>
                                                               handleOnChangeChoice(
                                                                  `question${currQuestionNum}`,
                                                                  choice.index
                                                               )
                                                            } //pass the question number and the original choice index
                                                            //we passed the orig choice index to easily compare to the correct answer when checking
                                                            //this is because the value of the correctAnswer property is the index of the choice (1-4)
                                                            checked={
                                                               answerStates[
                                                                  `question${currQuestionNum}`
                                                               ] === choice.index
                                                            } //boolean value; checks if the value of this question number in the answerState is the same as the map index
                                                            value={choice.index} //the value will be the original index from the question obj
                                                            name={"question" + currQuestionNum} //this will be the reference to the answerState to identify what choice is changed when onChange is triggered
                                                         />
                                                         <label
                                                            htmlFor={`question${currQuestionNum}i${choice.index}`}>
                                                            {choice.choice}
                                                         </label>
                                                      </p>
                                                   )
                                                )}
                                             </div>
                                          </div>
                                       )}
                                    </>
                                 )}

                                 <div className="float-end mt-3">
                                    <button
                                       id="submitBtn"
                                       type="button"
                                       className="d-none"
                                       ref={submitBtnRef}
                                       onClick={submitExam}>
                                       Submit
                                    </button>
                                    <button
                                       type="button"
                                       onClick={() => setIsShownSubmitModal(true)}
                                       className="btn btn-outline-secondary me-2 px-3 py-2"
                                       disabled={isSubmitting ? true : false}>
                                       {isSubmitting ? (
                                          <>
                                             <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"></span>
                                             Submitting...
                                          </>
                                       ) : (
                                          "Submit"
                                       )}
                                    </button>

                                    {currQuestionNum !== -1 && (
                                       <button
                                          type="button"
                                          className="btn btn-primary me-2 px-3 py-2"
                                          onClick={previousQuestion}>
                                          Back
                                       </button>
                                    )}
                                    {currQuestionNum !== questions.length - 1 && (
                                       <button
                                          type="button"
                                          className="btn btn-primary px-3 py-2"
                                          onClick={nextQuestion}>
                                          Next
                                       </button>
                                    )}
                                 </div>
                              </form>
                           </div>
                        </div>

                        <DialogLeavingPage
                           showDialog={showDialogLeavingPage}
                           setShowDialog={setCanShowDialogLeavingPage}
                           confirmNavigation={confirmNavigation}
                           cancelNavigation={cancelNavigation}
                        />

                        {/* <Modal show={showDialogLeavingPage} onHide={handleConfirmModalClose}>
                           <Modal.Header closeButton>
                              <Modal.Title>Exit</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>
                              You have unsaved changes. Unanswered questions will be given{" "}
                              <strong>0</strong> points.
                           </Modal.Body>
                           <Modal.Footer>
                              <Button variant="secondary" onClick={handleConfirmModalClose}>
                                 Cancel
                              </Button>
                              <Button variant="primary" onClick={exit}>
                                 Submit
                              </Button>
                           </Modal.Footer>
                        </Modal> */}

                        <Modal show={isShownSubmitModal} onHide={handleModalClose}>
                           <Modal.Header closeButton>
                              <Modal.Title>Submit Exam</Modal.Title>
                           </Modal.Header>
                           <Modal.Body>Are you sure you want to submit the exam?</Modal.Body>
                           <Modal.Footer>
                              <Button variant="secondary" onClick={handleModalClose}>
                                 Cancel
                              </Button>
                              <Button variant="primary" onClick={submitExam}>
                                 Submit
                              </Button>
                           </Modal.Footer>
                        </Modal>
                     </div>
                  )}
               </motion.div>
            </>
         )}
      </>
   );
}
