import React, { useContext, useRef } from "react";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import StudentNavbar from "../Student/StudentNavbar";
import Sidebar from "./Sidebar";
import css from "./css/ExamDetails.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";
import _ from "lodash";
import { Modal, Button } from "react-bootstrap";
import { v1 as createId } from "uuid";
import { FaUser, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { BsFileEarmarkCheckFill, BsFileEarmarkExcelFill } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";

import { useReactToPrint } from "react-to-print";
import { PrintTOS } from "../Faculty/PrintTOS";

export default function ExamDetails() {
   const { exam_id } = useParams();
   const navigate = useNavigate();
   const componentToPrintRef = useRef();
   const { user, setUser } = useContext(UserContext);

   const [isLoading, setIsLoading] = React.useState(true);
   const [isShownExamModal, setIsShownExamModal] = React.useState(false);
   const [isRetakeExam, setIsRetakeExam] = React.useState(false);
   const [registeredExamStatus, setRegisteredExamStatus] = React.useState();
   const [examData, setExamData] = React.useState({
      title: "",
      date_from: "",
      date_to: "",
      time_limit: "",
      directions: "",
      status: "",
      examCode: "",
      totalItems: 0,
      totalPoints: 0,
      passingScore: 0,
   });
   const [studentsSubmitted, setStudentsSubmitted] = React.useState([]);
   const [studentsUnanswered, setStudentsUnanswered] = React.useState([]);
   const [studentList, setStudentList] = React.useState([]);
   const [facultyName, setFacultyName] = React.useState("");
   const [facultyUsername, setFacultyUsername] = React.useState("");

   const [exam, setExam] = React.useState({});
   const [questions, setQuestions] = React.useState([]);
   const [tableObject, setTableObject] = React.useState({});
   const [showFullName, setShowFullName] = React.useState(true);
   const [results, setResults] = React.useState(true);
   const [questionsSheet, setQuestionsSheet] = React.useState();
   const [answersSheet, setAnswersSheet] = React.useState();

   const [spreadSheetResults, setSpreadSheetResults] = React.useState([
      //Headers
      [
         "Username",
         "Student ID/Number",
         "Full Name",
         "                               ",
         "Score",
         "Passed/Failed",
         "Duration",
         "Submitted on",
         "                               ",
      ],
      // ["val.username", "val.basicInfo.studentNumId ? val.basicInfo.studentNumId ", "val.fullname"],
   ]);

   const printTOS = useReactToPrint({
      content: () => componentToPrintRef.current,
   });

   async function generateTOS() {
      if (exam_id) {
         await axios({
            method: "POST",
            baseURL: `http://www.localhost:5000/exams/generateTOS/${exam_id}`,
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         })
            .then((res) => {
               setExam(res.data.exam);
               setFacultyUsername(res.data.facultyUsername);
               let questions_ = [...res.data.questions, ...res.data.questionsFromBanks];
               questions_ = questions_.map((val, i) => ({ ...val, questionNumber: i + 1 })); //put a questionNumber property to determine the order when data is fetched
               setQuestions(questions_); //merge shuffled questions into 1 array

               //separate KD questions first to make it more efficient when identifying CPD
               let factualQuestions = questions_.filter((val) => val.kd === "factual");
               let conceptualQuestions = questions_.filter((val) => val.kd === "conceptual");
               let proceduralQuestions = questions_.filter((val) => val.kd === "procedural");
               let metacognitiveQuestions = questions_.filter((val) => val.kd === "metacognitive");

               /* 
                  Knowledge Dimensions
                  A - Factual
                  B - Conceptual
                  C - Procedural
                  D -Metacognitive

                  Cognitive Process Dimensions
                  1 - Remember
                  2 - Understand
                  3 - Apply
                  4 - Analyze
                  5 - Evaluate
                  6 - Create
               */

               let a1 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "remember") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let a2 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "understand") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let a3 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "apply") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let a4 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "analyze") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let a5 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "evaluate") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let a6 = factualQuestions
                  .filter((val) => {
                     if (val.cpd === "create") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);

               let b1 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "remember") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let b2 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "understand") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let b3 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "apply") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let b4 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "analyze") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let b5 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "evaluate") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let b6 = conceptualQuestions
                  .filter((val) => {
                     if (val.cpd === "create") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);

               let c1 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "remember") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let c2 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "understand") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let c3 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "apply") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let c4 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "analyze") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let c5 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "evaluate") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let c6 = proceduralQuestions
                  .filter((val) => {
                     if (val.cpd === "create") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);

               let d1 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "remember") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let d2 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "understand") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let d3 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "apply") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let d4 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "analyze") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let d5 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "evaluate") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);
               let d6 = metacognitiveQuestions
                  .filter((val) => {
                     if (val.cpd === "create") return val.questionNumber;
                  })
                  .map((val) => val.questionNumber);

               setTableObject({
                  a1: { val: a1, length_: a1.length },
                  a2: { val: a2, length_: a2.length },
                  a3: { val: a3, length_: a3.length },
                  a4: { val: a4, length_: a4.length },
                  a5: { val: a5, length_: a5.length },
                  a6: { val: a6, length_: a6.length },
                  b1: { val: b1, length_: b1.length },
                  b2: { val: b2, length_: b2.length },
                  b3: { val: b3, length_: b3.length },
                  b4: { val: b4, length_: b4.length },
                  b5: { val: b5, length_: b5.length },
                  b6: { val: b6, length_: b6.length },
                  c1: { val: c1, length_: c1.length },
                  c2: { val: c2, length_: c2.length },
                  c3: { val: c3, length_: c3.length },
                  c4: { val: c4, length_: c4.length },
                  c5: { val: c5, length_: c5.length },
                  c6: { val: c6, length_: c6.length },
                  d1: { val: d1, length_: d1.length },
                  d2: { val: d2, length_: d2.length },
                  d3: { val: d3, length_: d3.length },
                  d4: { val: d4, length_: d4.length },
                  d5: { val: d5, length_: d5.length },
                  d6: { val: d6, length_: d6.length },
                  total: questions_.length,
               });

               printTOS();
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }

   async function getExamData() {
      await axios({
         method: "GET",
         baseURL: `http://www.localhost:5000/exams/${exam_id}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((res) => {
            let examData_ = res.data.exam;
            //prevents from viewing exam details if exam is not yet published
            if (examData_.status === "unposted") {
               navigate("/");
            } else {
               setExamData({
                  title: examData_.title,
                  date_from: examData_.date_from,
                  date_to: examData_.date_to,
                  time_limit: examData_.time_limit,
                  directions: examData_.directions,
                  status: examData_.status,
                  examCode: examData_.examCode,
                  totalItems: examData_.totalItems,
                  totalPoints: examData_.totalPoints,
                  passingScore: examData_.passingScore,
                  isQuestionBankEmpty: res.data.isQuestionBankEmpty,
               });

               setRegisteredExamStatus(res.data.registeredExamStatus);
               setFacultyName(res.data.faculty);
               setStudentList(res.data.students);

               let tempSubmitted = [];
               let tempUnanswered = [];
               let studentProfiles = res.data.students;

               //combine the objects (student profiles and their results) into one object and put into separate arrays (answered/unanswered)
               res.data.studentInfos.map((val, i) => {
                  if (val.status === "submitted")
                     tempSubmitted.push({
                        ...val,
                        ...studentProfiles[
                           studentProfiles.findIndex((val_) => val_._id === val.user)
                        ],
                     });
                  else
                     tempUnanswered.push({
                        ...val,
                        ...studentProfiles[
                           studentProfiles.findIndex((val_) => val_._id === val.user)
                        ],
                     });
               });

               // console.log("tempUnanswered", tempUnanswered);
               // console.log("tempSubmitted", tempSubmitted);

               setStudentsSubmitted(tempSubmitted);
               setStudentsUnanswered(tempUnanswered);

               if (tempSubmitted.length > 0) getResultsData(examData_.examCode);

               setTimeout(() => {
                  setIsLoading(false);
               }, 1000);
            }
         })
         .catch((err) => {
            console.log(err);
            navigate("/");
         });
   }

   function removeHTMLTagsFromQuestion(str) {
      // source: geeksforgeeks.org/how-to-strip-out-html-tags-from-a-   string-using-javascript/#:~:text=To%20strip%20out%20all%20the,innerText%20property%20from%20HTML%20DOM.
      if (str === null || str === "") return false;
      else str = str.toString();
      // Regular expression to identify HTML tags in
      // the input string. Replacing the identified
      // HTML tag with a null string.
      return str.replace(/(<([^>]+)>)/gi, "");
   }

   async function getResultsData(examCode) {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/exams/results/${examCode}`,
      })
         .then((res) => {
            // console.log(res.data.results);

            setResults(res.data.results);
            var firstUserQuesOrder = []; //variable to be used in spreadsheet to know the order of questions
            //add question headers to previous value of this state
            setSpreadSheetResults((prevVal) => {
               //will contain the array of headers + questions without html tags
               let headers_ = res.data.results[0].questions.map((val) => {
                  firstUserQuesOrder.push(val.question);
                  return removeHTMLTagsFromQuestion(val.question).trim().length === 0
                     ? "No question title"
                     : removeHTMLTagsFromQuestion(val.question); //add string truncation. Limit to 15 chars so that the whole text will not be shown
               });

               return [[...prevVal[0], ...headers_]];
            });

            console.log(res.data.results);
            // set fields for each user
            setSpreadSheetResults((prevVal) => {
               return [
                  ...prevVal,
                  ...res.data.results.map((userData) => {
                     return [
                        userData.username,
                        userData.basicInfo.studentNumId
                           ? "#" + userData.basicInfo.studentNumId
                           : "Not Specified",
                        userData.fullname,
                        "                               ", //whitespace
                        `${userData.exam.totalScore}/${
                           userData.exam.totalPoints
                        } (${getAverageScore(
                           userData.exam.totalScore,
                           userData.exam.totalPoints
                        )}%)`,
                        `${
                           userData.exam.totalScore >= userData.exam.passingScore
                              ? "PASSED"
                              : "FAILED"
                        }`,
                        `${formatTime(
                           (new Date(userData.exam.finishedTime).getTime() -
                              new Date(userData.exam.startedTime).getTime()) /
                              1000
                        )}`,
                        `${formatDate(userData.exam.finishedTime)}`,
                        "                               ", //whitespace
                        ...firstUserQuesOrder.map((firstUserQuesVal) => {
                           //get original index of the question
                           //every user has a randomized set of questions
                           let origQuestionIndex = userData.questions.findIndex(
                              (currUserQues) => currUserQues.question === firstUserQuesVal
                           );

                           let currQuestionChoices =
                              userData.questions[origQuestionIndex].shuffledChoices;

                           return currQuestionChoices[
                              currQuestionChoices.findIndex(
                                 (val) =>
                                    val.index === userData.answers[`question${origQuestionIndex}`]
                              )
                           ].choice;
                        }),
                     ];
                  }),
               ];
            });
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function formatTime(time) {
      //formats time (from seconds to countdown format)
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time / 60) % 60);
      const seconds = Math.floor(time % 60);
      let finalTimeFormat = "";

      if (hours > 0) finalTimeFormat += `${hours}h `;
      if (minutes > 0) finalTimeFormat += `${minutes}m `;
      //no if statement because seconds will always be present
      finalTimeFormat += `${seconds ? seconds : 0}s `;

      return finalTimeFormat;
   }

   function toggleFullName() {
      setShowFullName((prevVal) => !prevVal);
   }

   function getExamStatus(status) {
      if (status === "posted") {
         return <span className={`${css.status_badge} badge rounded-pill bg-success`}>Posted</span>;
      } else if (status === "open") {
         return <span className={`${css.status_badge} badge rounded-pill bg-warning`}>Open</span>;
      } else if (status === "closed") {
         return <span className={`${css.status_badge} badge rounded-pill bg-danger`}>Closed</span>;
      } else {
         // return <small className="text-muted">Unposted</small>;
         return (
            <span className={`${css.status_badge} badge rounded-pill bg-secondary`}>Unposted</span>
         );
      }
   }

   function getAverageScore(score, totalPoints) {
      return Math.floor((score / totalPoints) * 100);
   }

   function goToStudentExamResults(userId) {
      navigate(`/results/${examData.examCode}/${userId}`);
   }

   function formatDate(date) {
      date = new Date(date);
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

      var hour12HrFormat = date.getHours() % 12 || 12;
      var minutes = date.getMinutes();

      if (minutes.toString().length === 1) {
         //add 0 to start of number if minutes is a single digit
         minutes = "0" + minutes.toString();
      }

      var ampm = date.getHours() < 12 || date.getHours() === 24 ? "AM" : "PM";

      let formattedDate = `${
         months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()} at ${hour12HrFormat}:${minutes} ${ampm}`;
      return formattedDate;
   }

   function closeTakeExamModal() {
      setIsShownExamModal(false);
   }

   function takeExam() {
      navigate("/take-exam", { state: { examId: exam_id } });
   }

   function setButtonText() {
      if (registeredExamStatus === "submitted") {
         return "View Results";
      } else if (registeredExamStatus === "attempted") {
         return "Attempted";
      }

      return "Take Exam";
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

   async function retakeExam(id) {
      setIsRetakeExam(true);
      await axios({
         method: "PATCH",
         baseURL: `http://www.localhost:5000/exams/retake-exam/${id}/${examData.examCode}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((res) => {
            console.log(res.data);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function getItemsAndPoints() {
      let items = examData.totalItems;
      // let points = examData.totalPoints === 0 ? 1 : examData.totalPoints;
      let points = examData.totalPoints === 0 ? examData.totalItems : examData.totalPoints;

      items += examData.totalItems === 1 ? " item" : " items";

      if (!examData.isQuestionBankEmpty) {
         //this character will only show if the exam includes a question bank
         //this is because since the questions are randomly pulled on every instance of the exam,
         //there is no way to identify what the total points of the exam will be
         points += "+ points";
      } else {
         points += examData.totalPoints === 1 ? " point" : " points";
      }

      return `${items} ⸱ ${points}`;
   }

   React.useEffect(() => {
      document.title = `Exam Details ${
         examData.title && "- " + examData.title
      } | Online Examination`;
      if (!localStorage.getItem("token")) {
         navigate("/login-register");
      } else {
         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
         getExamData(exam_id);
      }
   }, []);

   return (
      <>
         {isLoading ? (
            //will animate as long as the isLoading is not false
            <AnimatePresence>
               {isLoading && (
                  <motion.div
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className={`${css.examDetails_loading} d-flex flex-column align-items-center justify-content-center`}>
                     <PuffLoader loading={isLoading} color="#006ec9" size={80} />
                     <p className="lead mt-3">&nbsp;Loading...</p>
                  </motion.div>
               )}
            </AnimatePresence>
         ) : (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2 }}>
               <Sidebar>
                  <div className={`${css.details_container}`}>
                     <div className="container pt-4">
                        <h1 className="display-5">Exam Details</h1>

                        {/* TOP SECTION */}
                        <div className="border py-4 px-4 mt-4">
                           <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex flex-column col">
                                 {/* title and status div*/}
                                 <div className="d-flex align-items-start align-items-md-center flex-column flex-md-row">
                                    <h1 className="m-0 me-2 d-inline text-break">
                                       {examData.title} {getExamStatus(examData.status)}
                                    </h1>
                                 </div>

                                 {user && user.userType === "teacher" ? (
                                    <small className="text-muted mb-2">
                                       Exam Code: {examData.examCode}
                                    </small>
                                 ) : (
                                    <small className="text-muted mb-2">{facultyName}</small>
                                 )}

                                 <p className="d-inline m-0">
                                    {/* {examData.totalItems}{" "}
                                    {examData.totalItems === 1 ? "item" : "items"} ⸱{" "}
                                    {examData.totalPoints}
                                    {!examData.isQuestionBankEmpty && "+"}{" "}
                                    {examData.totalPoints === 1 ? "point" : "points"} */}
                                    {getItemsAndPoints()}
                                 </p>
                                 <p className="d-inline">
                                    Passing Score: {examData.passingScore} points
                                 </p>
                              </div>
                              <div className="d-flex flex-column align-self-start align-items-end col p-2">
                                 {user && user.userType === "teacher" && (
                                    <button className="btn btn-primary" onClick={generateTOS}>
                                       Generate TOS
                                    </button>
                                 )}
                                 {user && user.userType === "student" && (
                                    <button
                                       className={`btn ${
                                          registeredExamStatus === "submitted"
                                             ? "btn-success"
                                             : "btn-primary"
                                       }`}
                                       onClick={() => {
                                          if (registeredExamStatus === "submitted") {
                                             goToStudentExamResults(user.id);
                                          } else {
                                             setIsShownExamModal(true);
                                          }
                                       }}
                                       disabled={
                                          // enable button only when exam is in open state
                                          (examData.status === "closed" &&
                                             (registeredExamStatus === "unanswered" ||
                                                registeredExamStatus === "attempted")) ||
                                          (examData.status === "open" &&
                                             registeredExamStatus === "attempted") ||
                                          (examData.status !== "closed" &&
                                             examData.status !== "open" &&
                                             (registeredExamStatus === "attempted" ||
                                                registeredExamStatus === "unanswered" ||
                                                registeredExamStatus === "submitted"))
                                             ? true
                                             : false
                                       }>
                                       {setButtonText()}
                                    </button>
                                 )}
                                 <p className="m-0 mt-1 text-muted small">
                                    From: {formatDate(examData.date_from)}
                                 </p>
                                 <p className="m-0 text-muted small">
                                    Until: {formatDate(examData.date_to)}
                                 </p>
                              </div>
                           </div>

                           {/* INFO CARDS */}
                           {user && user.userType === "teacher" && (
                              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_joined} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Students Joined</p>
                                          <h1>
                                             {studentsSubmitted.length + studentsUnanswered.length}
                                          </h1>
                                       </div>
                                       <div
                                          className={`${css.card_icon}  d-flex align-items-center justify-content-center`}>
                                          <FaUser className={css.icon_joined} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_submitted} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Submitted</p>
                                          <h1>{studentsSubmitted.length}</h1>
                                       </div>
                                       <div
                                          className={`${css.card_icon}  d-flex align-items-center justify-content-center`}>
                                          <BsFileEarmarkCheckFill className={css.icon_submitted} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_unanswered} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Unanswered</p>
                                          <h1>
                                             {examData.status === "open" ||
                                             examData.status === "closed"
                                                ? studentsUnanswered.length
                                                : 0}
                                          </h1>
                                       </div>

                                       <div
                                          className={`${css.card_icon}  d-flex align-items-center justify-content-center`}>
                                          <BsFileEarmarkExcelFill className={css.icon_unanswered} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_passed} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Students Passed</p>
                                          <h1>
                                             {studentsSubmitted.reduce(
                                                (acc, curr, index) =>
                                                   curr.totalScore >= curr.passingScore
                                                      ? acc + 1
                                                      : acc,
                                                0
                                             )}
                                          </h1>
                                       </div>
                                       <div
                                          className={`${css.card_icon} d-flex align-items-center justify-content-center`}>
                                          <FaUserCheck className={css.icon_passed} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_failed} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Students Failed</p>
                                          <h1>
                                             {studentsSubmitted.reduce(
                                                (acc, curr, index) =>
                                                   curr.totalScore < curr.passingScore
                                                      ? acc + 1
                                                      : acc,
                                                0
                                             )}
                                          </h1>
                                       </div>
                                       <div
                                          className={`${css.card_icon} d-flex align-items-center justify-content-center`}>
                                          <FaUserTimes className={css.icon_failed} />
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col">
                                    <div
                                       className={`${css.card_icon_average} card border-0 text-white p-4 d-flex flex-row justify-content-between align-items-center`}>
                                       <div>
                                          <p className="m-0 text-white">Average Score</p>
                                          <h1>
                                             {studentsSubmitted.length > 0 ? (
                                                <>
                                                   {Math.floor(
                                                      studentsSubmitted.reduce(
                                                         (acc, curr, index) =>
                                                            acc + curr.totalScore,
                                                         0
                                                      ) / studentsSubmitted.length
                                                   )}{" "}
                                                </>
                                             ) : (
                                                0
                                             )}
                                          </h1>
                                       </div>
                                       <div
                                          className={`${css.card_icon} d-flex align-items-center justify-content-center`}>
                                          <GoGraph className={css.icon_average} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )}
                        </div>

                        {/* STUDENT LIST SECTION */}
                        <div className="py-4 px-3 my-5">
                           <div className="d-flex justify-content-between">
                              <h5 className="mb-4">
                                 Students{" "}
                                 <small className="text-muted">
                                    (
                                    {user && user.userType === "teacher"
                                       ? studentsSubmitted.length + studentsUnanswered.length
                                       : studentList.length}
                                    )
                                 </small>
                              </h5>

                              <div>
                                 <input
                                    id="fullNameInput"
                                    type="checkbox"
                                    defaultChecked={showFullName}
                                    onChange={toggleFullName}
                                    className="me-2"
                                 />
                                 <label htmlFor="fullNameInput">Show Full Name</label>
                                 {user &&
                                    user.userType === "teacher" &&
                                    studentsSubmitted.length > 0 && (
                                       <CSVLink
                                          filename={`${examData.title} results`}
                                          data={spreadSheetResults}
                                          className="btn btn-success ms-4">
                                          <IoMdDownload className="me-1" /> Download Spreadsheet
                                       </CSVLink>
                                    )}
                              </div>
                           </div>

                           {/* THIS TABLE IS ONLY SHOWN ON FACULTY SIDE */}
                           {user && user.userType === "teacher" && (
                              <>
                                 {/* SHOW NO STUDENTS REGISTERED IF ARRAY LENGTH IS 0 */}
                                 {studentsSubmitted.length + studentsUnanswered.length <= 0 ? (
                                    <>
                                       <hr />
                                       <p className="text-center text-muted my-5">
                                          No students registered
                                       </p>
                                    </>
                                 ) : (
                                    <>
                                       {/* TABLE OF SUBMITTED STUDENTS */}
                                       {(examData.status === "open" ||
                                          examData.status === "closed") &&
                                          studentsSubmitted.length > 0 && (
                                             <div className="table-responsive mt-4">
                                                <table className="table">
                                                   <tbody>
                                                      <tr className={css.tr_first}>
                                                         <th scope="col">Student Name</th>
                                                         <th scope="col">Passed/Failed</th>
                                                         <th scope="col">Score</th>
                                                         <th scope="col">Duration</th>
                                                         <th scope="col">Submitted on</th>
                                                         <th scope="col"></th>
                                                      </tr>

                                                      {studentsSubmitted.map((student, i) => (
                                                         <tr
                                                            key={createId()}
                                                            className={`${css.tr_main}`}>
                                                            {/* TR IS A SINGLE ROW */}
                                                            <td
                                                               scope="row"
                                                               className="align-middle">
                                                               <div className="d-flex align-items-center ms-3">
                                                                  <div
                                                                     className={
                                                                        css.student_image_container
                                                                     }>
                                                                     <img
                                                                        className={
                                                                           css.student_image
                                                                        }
                                                                        src={
                                                                           !!student.profilePicture
                                                                              ? `/images/profilePictures/${student.profilePicture}`
                                                                              : `/images/profilePictures/no_profile_picture.png`
                                                                        }
                                                                        alt="profPic"
                                                                     />
                                                                  </div>

                                                                  <span className="ms-3 fw-bold">
                                                                     {showFullName
                                                                        ? student.fullname
                                                                        : student.username}
                                                                  </span>
                                                               </div>
                                                            </td>

                                                            {/* details of students who already have submitted */}

                                                            <td className="align-middle">
                                                               {student.totalScore >=
                                                               student.passingScore ? (
                                                                  <span className="badge rounded-pill bg-success">
                                                                     Passed
                                                                  </span>
                                                               ) : (
                                                                  <span className="badge rounded-pill bg-danger">
                                                                     Failed
                                                                  </span>
                                                               )}
                                                            </td>
                                                            <td className="align-middle">
                                                               <span
                                                                  className={`${
                                                                     student.totalScore >=
                                                                     student.passingScore
                                                                        ? "text-success"
                                                                        : "text-danger"
                                                                  } text-success fw-bold`}>
                                                                  {student.totalScore}/
                                                                  {student.totalPoints}
                                                                  <span className="ms-1">
                                                                     (
                                                                     {getAverageScore(
                                                                        student.totalScore,
                                                                        student.totalPoints
                                                                     )}
                                                                     %)
                                                                  </span>
                                                               </span>
                                                            </td>
                                                            <td className="align-middle">
                                                               <span>
                                                                  {formatTime(
                                                                     (new Date(
                                                                        student.finishedTime
                                                                     ).getTime() -
                                                                        new Date(
                                                                           student.startedTime
                                                                        ).getTime()) /
                                                                        1000
                                                                  )}
                                                               </span>
                                                            </td>
                                                            <td className="align-middle">
                                                               <span>
                                                                  {formatDate(student.finishedTime)}
                                                               </span>
                                                            </td>
                                                            <td className="align-middle">
                                                               <span
                                                                  className={`${css.details_link} text-decoration-none text-primary`}
                                                                  onClick={() =>
                                                                     goToStudentExamResults(
                                                                        student.user
                                                                     )
                                                                  }>
                                                                  View Results
                                                               </span>
                                                            </td>
                                                         </tr>
                                                      ))}
                                                   </tbody>
                                                </table>
                                             </div>
                                          )}

                                       {/* TABLE OF STUDENTS WHO HAVE NOT ANSWERED THE EXAM YET */}
                                       {(examData.status === "open" ||
                                          examData.status === "closed") &&
                                          studentsUnanswered.length > 0 && (
                                             <div className="table-responsive mt-4">
                                                {examData.status === "open" && (
                                                   <span className="text-black-50">Unanswered</span>
                                                )}

                                                <table className="table mt-3">
                                                   <tbody>
                                                      {studentsUnanswered.map((student, i) => (
                                                         <tr
                                                            key={createId()}
                                                            className={`${css.tr_main}`}>
                                                            {/* TR IS A SINGLE ROW */}
                                                            <td
                                                               scope="row"
                                                               className="align-middle">
                                                               <div className="d-flex align-items-center justify-content-between ms-3">
                                                                  <div className="d-flex align-items-center">
                                                                     <div
                                                                        className={
                                                                           css.student_image_container
                                                                        }>
                                                                        <img
                                                                           className={
                                                                              css.student_image
                                                                           }
                                                                           src={
                                                                              !!student.profilePicture
                                                                                 ? `/images/profilePictures/${student.profilePicture}`
                                                                                 : `/images/profilePictures/no_profile_picture.png`
                                                                           }
                                                                           alt="profPic"
                                                                        />
                                                                     </div>

                                                                     <span className="ms-3 fw-bold">
                                                                        {showFullName
                                                                           ? student.fullname
                                                                           : student.username}
                                                                     </span>
                                                                  </div>
                                                                  {student.status ===
                                                                     "attempted" && (
                                                                     <button
                                                                        className="btn btn-primary"
                                                                        disabled={isRetakeExam}
                                                                        onClick={() =>
                                                                           retakeExam(student._id)
                                                                        }>
                                                                        Reset Exam
                                                                     </button>
                                                                  )}
                                                               </div>
                                                            </td>
                                                         </tr>
                                                      ))}
                                                   </tbody>
                                                </table>
                                             </div>
                                          )}
                                       {/* END OF FACULTY TABLE */}
                                    </>
                                 )}
                              </>
                           )}

                           {/* THIS TABLE IS ONLY SHOWN ON STUDENT SIDE */}
                           {user && user.userType === "student" && (
                              <>
                                 <table className="table">
                                    <tbody>
                                       {studentList.map((student, i) => (
                                          <tr key={createId()} className={`${css.tr_main}`}>
                                             {/* TR IS A SINGLE ROW */}
                                             <td scope="row" className="align-middle">
                                                <div className="d-flex align-items-center ms-3">
                                                   <div className={css.student_image_container}>
                                                      <img
                                                         className={css.student_image}
                                                         src={
                                                            !!student.profilePicture
                                                               ? `/images/profilePictures/${student.profilePicture}`
                                                               : `/images/profilePictures/no_profile_picture.png`
                                                         }
                                                         alt="profPic"
                                                      />
                                                   </div>

                                                   <span className="ms-3 fw-bold">
                                                      {showFullName
                                                         ? student.fullname
                                                         : student.username}
                                                   </span>
                                                </div>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </>
                           )}
                        </div>
                     </div>
                  </div>

                  {tableObject && exam && facultyUsername && (
                     <PrintTOS
                        ref={componentToPrintRef}
                        tableObject={tableObject}
                        examDetails={exam}
                        facultyUsername={facultyUsername}
                     />
                  )}
               </Sidebar>

               <Modal show={isShownExamModal} onHide={closeTakeExamModal}>
                  <Modal.Header closeButton>
                     <Modal.Title>Take Exam</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     Are you sure you want to start taking this exam? You only have 1 attempt.
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={closeTakeExamModal}>
                        Cancel
                     </Button>
                     <Button variant="primary" onClick={takeExam}>
                        Continue
                     </Button>
                  </Modal.Footer>
               </Modal>
            </motion.div>
         )}
      </>
   );
}
