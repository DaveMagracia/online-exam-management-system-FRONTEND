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

export default function ExamResults() {
   const { user, setUser } = useContext(UserContext);
   const navigate = useNavigate();
   const { state } = useLocation(); //from ExamDetails.js
   const { results, questions, answers, exam } = state; //extract examId property from "state" objectc
   const buttonRef = useRef();
   const boxRef = useRef();
   //    const [exam, setExam] = React.useState({});
   //    const [questions, setQuestions] = React.useState([]);
   const [startTime, setStartTime] = React.useState(new Date());
   const [endTime, setEndTime] = React.useState(new Date());
   const [timeLimit, setTimeLimit] = React.useState();
   const [timeLimitString, setTimeLimitString] = React.useState();
   const [formattedTime, setFormattedTime] = React.useState();
   const [isExpanded, setIsExpanded] = React.useState(false);
   const [isLoading, setIsLoading] = React.useState(false);
   const [isSubmitting, setIsSubmitting] = React.useState(false);
   const [isSubmitted, setIsSubmitted] = React.useState(false);
   const [currQuestionNum, setCurrQuestionNum] = React.useState(0);
   const [answerStates, setAnswerStates] = React.useState([]);

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
      finalTimeFormat += `${seconds} ${seconds === 1 ? " second" : " seconds"}`;

      setFormattedTime(finalTimeFormat);
   }

   React.useEffect(() => {
      if (!localStorage.getItem("token")) {
         navigate("/login");
      } else {
         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
      }
   }, []);

   React.useEffect(() => {
      console.log("exam", exam);
      console.log("results", results);
      console.log("questions", questions);
      console.log("answers", answers);
   });

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
                  {/* MAIN CONTENT */}
                  <div className="d-flex justify-content-center">
                     <div className={`${css.exam_container} p-3`}>
                        <div className="exam_head mb-4">
                           <div className="d-flex mt-5 justify-content-between">
                              <div>
                                 <h1 className="m-0">Results</h1>
                                 <p className="m-0 text-muted">{exam.title}</p>
                              </div>
                              <div className="mt-3">
                                 <p className="text-muted m-0 text-end">Total Score</p>
                                 <h5 className="m-0">
                                    {results.reduce((acc, curr) => {
                                       return curr ? acc + 1 : acc + 0;
                                    }, 0)}{" "}
                                    out of {questions.length}
                                 </h5>
                              </div>
                           </div>
                           <hr />
                           <p className="m-0">
                              <b>Started at</b>: {formatDate(startTime)}
                           </p>
                           <p className="m-0">
                              <b>Finished at</b>: {formatDate(exam.finishedTime)}
                           </p>
                           {exam.directions && (
                              <div className="mt-4">
                                 <h5>Directions: </h5>
                                 <p className={`${css.directions} text-break`}></p>
                                 {exam.directions}
                              </div>
                           )}
                        </div>

                        {/* DISPLAY QUESTIONS */}
                        {questions.length > 0 &&
                           questions?.map((question, index) => (
                              <div className="card px-5 py-5">
                                 <div>
                                    <h5 className="m-0 me-3 d-inline">
                                       Question {currQuestionNum + 1} of {exam.totalItems}
                                    </h5>
                                    <small className="text-muted float-end">
                                       {results[index]
                                          ? questions[currQuestionNum].points +
                                            (questions[currQuestionNum].points === 1
                                               ? " point"
                                               : " points")
                                          : "0 points"}
                                    </small>
                                 </div>

                                 <p className="mt-2">{question.question}</p>
                                 <div className="choices mt-4">
                                    {question.shuffledChoices.map((choice) => {
                                       if (results[index]) {
                                          //if answer is correct
                                          if (answers[`question${index}`] === choice.index) {
                                             return (
                                                <div
                                                   key={createId()}
                                                   className="alert alert-success m-0 p-2">
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          }
                                       } else {
                                          //if answer is wrong
                                          if (answers[`question${index}`] === choice.index) {
                                             return (
                                                <div
                                                   key={createId()}
                                                   className="alert alert-danger m-0 p-2">
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          } else if (choice.index === question.answer) {
                                             return (
                                                <div
                                                   key={createId()}
                                                   className="alert alert-success m-0 p-2">
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          }
                                       }
                                       return (
                                          <div key={createId()} className=" p-2">
                                             <input
                                                type="radio"
                                                className="me-3"
                                                checked={
                                                   answers[`question${index}`] === choice.index
                                                }
                                                value={choice.index}
                                                name={`question${index}`}
                                                readOnly
                                             />
                                             {choice.choice}
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           ))}

                        {/* <div className="float-end mt-3">
                              <button
                                 type="submit"
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
                              <button
                                 type="button"
                                 className="btn btn-primary me-2 px-3 py-2"
                                 disabled={currQuestionNum === 0 ? true : false}>
                                 Back
                              </button>
                              <button
                                 type="button"
                                 className="btn btn-primary px-3 py-2"
                                 disabled={currQuestionNum === questions.length - 1 ? true : false}>
                                 Next
                              </button>
                           </div> */}
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </>
   );
}
