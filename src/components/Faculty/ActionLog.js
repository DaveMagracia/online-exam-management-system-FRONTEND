import React, { useContext, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import css from "./css/ActionLog.module.css";
import { UserContext } from "../../UserContext";
import StudentNavbar from "../Student/StudentNavbar";
import FacultyNavbar from "./FacultyNavbar";
import axios from "axios";
import { v1 as createId } from "uuid";
import { MdMinimize, MdArrowBack } from "react-icons/md";
import _ from "lodash";
import PuffLoader from "react-spinners/PuffLoader";
import { motion, AnimatePresence } from "framer-motion";

import { useReactToPrint } from "react-to-print";
import { PrintActionLog } from "./PrintActionLog";

export default function ActionLog() {
   const { user, setUser } = useContext(UserContext);
   const navigate = useNavigate();
   const componentToPrintRef = useRef();
   const { examCode, userId } = useParams();

   const [exam, setExam] = React.useState({});
   const [actionLog, setActionLog] = React.useState([]);
   const [results, setResults] = React.useState([]);
   const [questions, setQuestions] = React.useState([]);
   const [answers, setAnswers] = React.useState([]);
   const [studentInfo, setStudentInfo] = React.useState({});

   const [formattedTime, setFormattedTime] = React.useState();
   const [isLoading, setIsLoading] = React.useState(true);
   const [profileImage, setProfileImage] = React.useState("");

   function getNavbar() {
      // identifies what type of navbar to be displayed
      if (user) {
         if (user.userType === "student") {
            return <StudentNavbar username={user.username} photoPath={profileImage} />;
         } else if (user.userType === "teacher") {
            return <FacultyNavbar username={user.username} photoPath={profileImage} />;
         }
      }
   }

   const printActionLog = useReactToPrint({
      content: () => componentToPrintRef.current,
   });

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

   async function getResultsData() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/exams/logs/${examCode}/${userId}`,
      })
         .then((res) => {
            setExam(res.data.logs.exam);
            setStudentInfo(res.data.logs.basicInfo);
            setActionLog(res.data.logs.actionLog);

            setTimeout(() => {
               setIsLoading(false);
            }, 200);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function backToResults() {
      navigate(-1);
   }

   function formatDuration(date) {
      date = Math.floor(date - new Date(exam.startedTime)) / 1000;
      //   var sec_num = parseInt(date, 10); // don't forget the second param

      var hours = Math.floor(date / 3600);
      var minutes = Math.floor((date - hours * 3600) / 60);
      var seconds = Math.floor(date % 60);

      if (hours < 10) {
         hours = "0" + hours;
      }
      if (minutes < 10) {
         minutes = "0" + minutes;
      }
      if (seconds < 10) {
         seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
   }

   function getUserInfoFromToken() {
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);

      setProfileImage(
         !!userTokenDecoded.photo && `/images/profilePictures/${userTokenDecoded.photo}`
      );
   }

   React.useEffect(() => {
      document.title = `Exam Results | Online Examination`;
      if (!localStorage.getItem("token")) {
         navigate("/login-register");
      } else {
         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
         getResultsData();
         getUserInfoFromToken();
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
                                 <h1 className="m-0">Action Log</h1>
                                 <p className="m-0 text-muted">{exam.title}</p>
                              </div>
                           </div>
                           <hr />
                           <div className="d-flex">
                              <div className="flex-grow-1">
                                 <p className="m-0">
                                    <b>Name</b>:{" "}
                                    {studentInfo.fullName ? (
                                       studentInfo.fullName
                                    ) : (
                                       <span className="text-black-50">Not Specified</span>
                                    )}
                                 </p>
                                 <p className="m-0">
                                    <b>Student ID</b>:{" "}
                                    {studentInfo.studentNumId ? (
                                       studentInfo.studentNumId
                                    ) : (
                                       <span className="text-black-50">Not Specified</span>
                                    )}
                                 </p>
                                 <p className="m-0">
                                    <b>Started at</b>: {formatDate(new Date(exam.startedTime))}
                                 </p>
                                 <p className="m-0">
                                    <b>Finished at</b>: {formatDate(new Date(exam.finishedTime))}
                                 </p>
                                 {/* {exam.directions && (
                        <div className="mt-4">
                           <h5>Directions: </h5>
                           <p className={`${css.directions} text-break`}></p>
                           {exam.directions}
                        </div>
                     )} */}
                              </div>

                              {user && user.userType === "teacher" && (
                                 <div className="d-flex flex-column">
                                    <button
                                       className="btn btn-primary float-end"
                                       onClick={printActionLog}>
                                       Print Action Log
                                    </button>
                                    {/* <button
                                       className="btn btn-primary float-end mt-2"
                                       onClick={printResults}>
                                       Action Log
                                    </button> */}
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="mt-5 mb-5">
                           {/* DISPLAY ACTION LOG */}
                           {actionLog &&
                              actionLog.map((val, i) => (
                                 <div className="d-flex" key={createId()}>
                                    <div className="d-flex align-items-center">
                                       <div className="d-flex flex-column align-items-center">
                                          <div
                                             className={`vr mx-4 ${css.vertical_rule} ${
                                                i === 0 && "bg-white"
                                             }`}></div>
                                          <div className={css.icon_circle}></div>
                                          <div
                                             className={`vr mx-4 ${css.vertical_rule} ${
                                                i === actionLog.length - 1 && "bg-white"
                                             }`}></div>
                                       </div>
                                       <span className="text-muted">
                                          {formatDuration(new Date(val.time))}
                                       </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                       <span
                                          className={`ms-4 ${
                                             i === 0 || i === actionLog.length - 1 ? "fw-bold" : ""
                                          }
                                          ${
                                             (val.action === "Changed window/tab" ||
                                                val.action === "Resumed viewing the exam") &&
                                             "text-danger"
                                          }`}>
                                          {val.action}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                        </div>
                        <hr />
                        <div className="float-end mt-1 mb-5">
                           <button
                              type="button"
                              className="btn btn-primary px-3 py-2"
                              onClick={backToResults}>
                              Back to Exam Results
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
         <PrintActionLog
            ref={componentToPrintRef}
            exam={exam}
            studentInfo={studentInfo}
            actionLog={actionLog}
         />
      </>
   );
}
