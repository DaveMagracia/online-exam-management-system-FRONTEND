import React, { useContext } from "react";
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
import { Modal, Button } from "react-bootstrap";
import { v1 as createId } from "uuid";

export default function ExamDetails() {
   const { exam_id } = useParams();
   const navigate = useNavigate();
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setIsLoading] = React.useState(true);
   const [isShownExamModal, setIsShownExamModal] = React.useState(false);
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
                        ...studentProfiles[i],
                     });
                  else
                     tempUnanswered.push({
                        ...val,
                        ...studentProfiles[i],
                     });
               });

               setStudentsSubmitted(tempSubmitted);
               setStudentsUnanswered(tempUnanswered);

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

   React.useEffect(() => {
      document.title = `Exam Details ${
         examData.title && "- " + examData.title
      } | Online Examination`;
      if (!localStorage.getItem("token")) {
         navigate("/login");
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
                     <PuffLoader loading={isLoading} color="#9c2a22" size={80} />
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
                  <div className="container">
                     <h1 className="display-5 mt-4">Exam Details</h1>

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
                                 {examData.totalItems}{" "}
                                 {examData.totalItems === 1 ? "item" : "items"} ⸱{" "}
                                 {examData.totalPoints}
                                 {!examData.isQuestionBankEmpty && "+"}{" "}
                                 {examData.totalPoints === 1 ? "point" : "points"}
                              </p>
                              <p className="d-inline">
                                 Passing Score: {examData.passingScore} points
                              </p>
                           </div>
                           <div className="d-flex flex-column align-self-start align-items-end col p-2">
                              {user && user.userType === "teacher" && (
                                 <button className="btn btn-primary">Generate Instance</button>
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
                                       examData.status !== "open" ||
                                       registeredExamStatus === "attempted"
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
                                 <div className="card p-4 d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Students Joined</p>
                                       <h1>
                                          {studentsSubmitted.length + studentsUnanswered.length}
                                       </h1>
                                    </div>
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                              <div className="col">
                                 <div className="card p-4 d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Submitted</p>
                                       <h1>{studentsSubmitted.length}</h1>
                                    </div>
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                              <div className="col">
                                 <div className="card p-4  d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Unanswered</p>
                                       <h1>{studentsUnanswered.length}</h1>
                                    </div>
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                              <div className="col">
                                 <div className="card p-4 d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Students Passed</p>
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
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                              <div className="col">
                                 <div className="card p-4 d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Students Failed</p>
                                       <h1>
                                          {studentsSubmitted.reduce(
                                             (acc, curr, index) =>
                                                curr.totalScore < curr.passingScore ? acc + 1 : acc,
                                             0
                                          )}
                                       </h1>
                                    </div>
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                              <div className="col">
                                 <div className="card p-4 d-flex flex-row justify-content-between align-items-center">
                                    <div>
                                       <p className="m-0 text-muted">Average Score</p>
                                       <h1>
                                          {studentsSubmitted.length > 0 ? (
                                             <>
                                                {Math.floor(
                                                   studentsSubmitted.reduce(
                                                      (acc, curr, index) => acc + curr.totalScore,
                                                      0
                                                   ) / studentsSubmitted.length
                                                )}{" "}
                                             </>
                                          ) : (
                                             0
                                          )}
                                       </h1>
                                    </div>
                                    <div className={css.card_icon}></div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* STUDENT LIST SECTION */}
                     <div className="py-4 px-3 my-5">
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
                                    {examData.status === "open" && studentsSubmitted.length > 0 && (
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
                                                      <td scope="row" className="align-middle">
                                                         <div className="d-flex align-items-center ms-3">
                                                            <div
                                                               className={css.student_image}></div>
                                                            <span className="ms-3 fw-bold">
                                                               {student.username}
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
                                                               goToStudentExamResults(student.user)
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
                                    {studentsUnanswered.length > 0 && (
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
                                                      <td scope="row" className="align-middle">
                                                         <div className="d-flex align-items-center ms-3">
                                                            <div
                                                               className={css.student_image}></div>
                                                            <span className="ms-3 fw-bold">
                                                               {student.username}
                                                            </span>
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
                                                <div className={css.student_image}></div>
                                                <span className="ms-3 fw-bold">
                                                   {student.username}
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
