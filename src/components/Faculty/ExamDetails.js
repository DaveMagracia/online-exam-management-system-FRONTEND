import React, { useContext } from "react";
import FacultyNavbar from "./FacultyNavbar";
import css from "./css/ExamDetails.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";

export default function ExamDetails() {
   const { exam_id } = useParams();
   const navigate = useNavigate();
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setIsLoading] = React.useState(true);
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
   });
   const [students, setStudents] = React.useState([]);
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
               });
               setStudents(res.data.students);
               setFacultyName(res.data.faculty.username);

               setTimeout(() => {
                  setIsLoading(false);
               }, 1000);
            }
         })
         .catch((err) => {
            // navigate("/");
            console.log(err);
         });
   }

   function getExamStatus(status) {
      if (status === "posted") {
         return (
            <span className="badge rounded-pill bg-success d-inline mt-2">
               Posted
            </span>
         );
      } else if (status === "open") {
         return (
            <span className="badge rounded-pill bg-warning d-inline mt-2">
               Open
            </span>
         );
      } else if (status === "closed") {
         return (
            <span className="badge rounded-pill bg-danger d-inline mt-2">
               Closed
            </span>
         );
      } else {
         // return <small className="text-muted">Unposted</small>;
         return (
            <span className="badge rounded-pill bg-secondary">Unposted</span>
         );
      }
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

   React.useEffect(() => {
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
                     <PuffLoader
                        loading={isLoading}
                        color="#9c2a22"
                        size={80}
                     />
                     <p className="lead mt-3">&nbsp;Loading...</p>
                  </motion.div>
               )}
            </AnimatePresence>
         ) : (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2 }}>
               <FacultyNavbar username={user.username} />
               <div className="container">
                  <h1 className="display-5 mt-4">Exam Details</h1>

                  {/* TOP SECTION */}
                  <div className="border py-4 px-4 mt-4">
                     <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                           {/* title and status div*/}
                           <div className="d-flex align-items-center">
                              <h1 className="m-0 me-2 d-inline">
                                 {examData.title}
                              </h1>
                              {getExamStatus(examData.status)}
                           </div>

                           {user && user.userType === "teacher" ? (
                              <small className="text-muted mb-2">
                                 Exam Code: {examData.examCode}
                              </small>
                           ) : (
                              <small className="text-muted mb-2">
                                 {facultyName}
                              </small>
                           )}

                           <p className="d-inline">
                              {examData.totalItems}{" "}
                              {examData.totalItems === 1 ? "item" : "items"} -{" "}
                              {examData.totalPoints}{" "}
                              {examData.totalPoints === 1 ? "point" : "points"}
                           </p>
                        </div>
                        <div className="d-flex flex-column align-items-end">
                           {user && user.userType === "teacher" && (
                              <button className="btn btn-primary">
                                 Generate Instance
                              </button>
                           )}
                           {user && user.userType === "student" && (
                              <button
                                 className="btn btn-primary"
                                 disabled={
                                    // enable button only when exam is in open state
                                    examData.status !== "open" ? true : false
                                 }>
                                 Take Exam
                              </button>
                           )}
                           <p className="m-0 mt-1 text-muted">
                              Available from: {formatDate(examData.date_from)}
                           </p>
                           <p className="m-0 text-muted">
                              Until: {formatDate(examData.date_to)}
                           </p>
                        </div>
                     </div>

                     {/* INFO CARDS */}
                     {user && user.userType === "teacher" && (
                        <div className="row row-cols-xl-3 g-4">
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                           <div className="col">
                              <div className="card p-4">
                                 <p className="m-0">Students Joined</p>
                                 <h1>20</h1>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* LIST SECTION */}
                  <div className="border py-4 px-5 my-5">
                     <h5 className="mb-4">
                        Students{" "}
                        <small className="text-muted">
                           ({students.length})
                        </small>
                     </h5>
                     <hr />
                     {students.length <= 0 ? (
                        <>
                           <p className="text-center text-muted my-5">
                              No students registered
                           </p>
                        </>
                     ) : (
                        <>
                           {students.map((student, i) => (
                              <div
                                 className={`mt-2 p-2  d-flex align-items-center ${
                                    i + 1 !== students.length && "border-bottom"
                                 }`}>
                                 <div className={css.student_image}></div>
                                 <span className="ms-3">
                                    {student.username}
                                 </span>
                              </div>
                           ))}
                        </>
                     )}
                  </div>
               </div>
            </motion.div>
         )}
      </>
   );
}
