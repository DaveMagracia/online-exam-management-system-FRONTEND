import React, { useContext } from "react";
import ExamListBox from "./ExamListBox";
import css from "./css/ExamList.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import BarLoader from "react-spinners/BarLoader";

export default function ExamList(props) {
   const navigate = useNavigate();
   const { user, setUser } = useContext(UserContext);
   const [examsList, setExamsList] = React.useState([]); //will contain the list of exams made by the user
   const [isLoading, setIsLoading] = React.useState(true); //loading initially set to true

   function setExamList(examArray) {
      //populate the examsList with elements of each exam
      if (examArray) {
         let examsList_ = examArray.map((examData, i) => (
            <>
               <motion.div
                  className="col"
                  key={i}
                  initial={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <ExamListBox
                     examData={examData}
                     getExams={getExams} //pass getExams to box to reload this component when an exam is deleted
                  />
                  {/* SAMPLE exam id only*/}
               </motion.div>
            </>
         ));

         setExamsList(examsList_);
      }
   }

   function goToCreateExam() {
      navigate("/create-exam");
   }

   async function getExams() {
      //if this props is not equal to "all", get the exams for that specific subject
      if (props.subjectName.toLowerCase() !== "all") {
         await axios({
            method: "GET",
            baseURL: `http://localhost:5000/exams/subjects/${props.subjectName}`,
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         })
            .then((data) => {
               //pass the array of exams
               setTimeout(() => {
                  setExamList(data.data.exams);
                  setIsLoading(false);
               }, 200);
            })
            .catch((err) => {
               setTimeout(() => {
                  console.log(err);
                  setIsLoading(false);
               }, 200);
            });
      } else {
         //else get all subjects
         await axios({
            method: "GET",
            baseURL: "http://localhost:5000/exams",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         })
            .then((data) => {
               //pass the array of exams
               setExamList(data.data.exams);
               setIsLoading(false);
            })
            .catch((err) => {
               console.log(err);
               setIsLoading(false);
            });
      }
   }

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);

      //GET ALL LIST OF EXAMS CREATED/REGISTERED BY THE USER
      getExams();
   }, []);

   return (
      <>
         {isLoading ? (
            <AnimatePresence>
               {isLoading && (
                  <motion.div
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className={`${css.loading_root} d-flex flex-column align-items-center `}>
                     <BarLoader loading={isLoading} color="#1067ca" size={80} width={"100%"} />
                  </motion.div>
               )}
            </AnimatePresence>
         ) : (
            <div>
               <div className="d-flex align-items-center justify-content-between">
                  <div className="ps-2 pb-3 mt-3">
                     <span className="text-black-50 fw-bold">Exams</span>
                  </div>
                  {user && user.userType === "teacher" && (
                     <button className="btn btn-primary float-end" onClick={goToCreateExam}>
                        Create Exam
                     </button>
                  )}
               </div>
               <div className="pb-5">
                  {examsList.length !== 0 ? (
                     <div
                        className="row 
                        row-cols-1 
                        row-cols-md-2 
                        row-cols-xl-3 
                        g-3">
                        {examsList}
                     </div>
                  ) : (
                     <div className={`${css.no_exams_container}`}>
                        {user && user.userType === "teacher" ? (
                           <p className="text-muted text-center">
                              You have not created an exam yet. Subjects on exams you created will
                              appear here.
                           </p>
                        ) : (
                           <p className="text-muted text-center">
                              You are not registered to an exam yet. Exams you have registered to
                              will appear here.
                           </p>
                        )}
                     </div>
                  )}
               </div>
            </div>
         )}
      </>
   );
}
