import React, { useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import css from "./css/ExamResults.module.css";
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
   const { results, questions, answers, exam, studentInfo } = state; //extract examId property from "state" objectc
   const [formattedTime, setFormattedTime] = React.useState();
   const [isLoading, setIsLoading] = React.useState(false);

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

   function backToDetails() {
      navigate(-1);
   }

   React.useEffect(() => {
      document.title = `Exam Results | Online Examination`;
      if (!localStorage.getItem("token")) {
         navigate("/login-register");
      } else {
         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
      }
   }, []);

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
                     <PuffLoader loading={isLoading} color="#006ec9" size={80} />
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
                  <div className={`${css.results_root} d-flex justify-content-center`}>
                     <div className={`${css.results_container} p-3`}>
                        <div className="exam_head mb-4">
                           <div className="d-flex mt-5 justify-content-between">
                              <div>
                                 <h1 className="m-0">Results</h1>
                                 <p className="m-0 text-muted">{exam.title}</p>
                              </div>
                              <div className="mt-3 d-flex">
                                 <div className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="text-muted m-0 text-center">Total Score</p>
                                    {exam.totalScore >= exam.passingScore ? (
                                       <h6 className="m-0 text-success d-inline">
                                          {exam.totalScore} out of {exam.totalPoints}
                                       </h6>
                                    ) : (
                                       <h6 className="m-0 text-danger d-inline">
                                          {exam.totalScore} out of {exam.totalPoints}
                                       </h6>
                                    )}
                                 </div>
                                 <div className="vr mx-3"></div>
                                 <div className="d-flex flex-column align-items-center justify-content-center">
                                    <p className="text-muted m-0 text-center">Passing Score</p>
                                    <h6 className="m-0 text-center">{exam.passingScore} points</h6>
                                 </div>
                              </div>
                           </div>
                           <hr />
                           <p className="m-0">
                              <b>Name</b>:{" "}
                              {studentInfo && studentInfo.fullName ? (
                                 studentInfo.fullName
                              ) : (
                                 <span className="text-black-50">Not Specified</span>
                              )}
                           </p>
                           <p className="m-0">
                              <b>Student ID</b>:{" "}
                              {studentInfo && studentInfo.studentNumId ? (
                                 studentInfo.studentNumId
                              ) : (
                                 <span className="text-black-50">Not Specified</span>
                              )}
                           </p>
                           <p className="m-0">
                              <b>Started at</b>: {formatDate(exam.startedTime)}
                           </p>
                           <p className="m-0">
                              <b>Finished at</b>: {formatDate(exam.finishedTime)}
                           </p>
                           {/* {exam.directions && (
                              <div className="mt-4">
                                 <h5>Directions: </h5>
                                 <p className={`${css.directions} text-break`}></p>
                                 {exam.directions}
                              </div>
                           )} */}
                        </div>

                        {/* DISPLAY QUESTIONS */}
                        {questions.length > 0 &&
                           questions?.map((question, index) => (
                              <div key={createId()} className="card px-5 py-5 mb-4">
                                 <div>
                                    <h5 className="m-0 me-3 d-inline">
                                       Question {index + 1} of {exam.totalItems}
                                    </h5>
                                    <small className="text-muted float-end">
                                       {results[index] ? questions[index].points : "0"}/
                                       {questions[index].points}
                                       {questions[index].points === 1 ? " point" : " points"}
                                    </small>
                                 </div>

                                 <div
                                    className={`${css.question_container} mt-2`}
                                    dangerouslySetInnerHTML={{
                                       __html: question.question,
                                    }}
                                 />
                                 {/* <p className="mt-2">{question.question}</p> */}
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

                        <div className="float-end mt-1 mb-5">
                           <button
                              type="button"
                              className="btn btn-primary px-3 py-2"
                              onClick={backToDetails}>
                              Back to Exam Details
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </>
   );
}
