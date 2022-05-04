import React, { useContext } from "react";
import SubjectListBox from "./SubjectListBox";
import css from "./css/SubjectList.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import BarLoader from "react-spinners/BarLoader";
import { v1 as createId } from "uuid";

export default function SubjectList() {
   const navigate = useNavigate();
   const { user, setUser } = useContext(UserContext);
   const [subjectsList, setSubjectsList] = React.useState([]); //will contain the list of exams made by the user
   const [isLoading, setIsLoading] = React.useState(true); //loading initially set to true

   function setSubjectList(subjectArray) {
      //populate the examsList with elements of each exam
      if (subjectArray) {
         let subjectList_ = subjectArray.map((subjectData, i) => {
            return (
               <>
                  <motion.div
                     className="col"
                     key={createId()}
                     initial={{ opacity: 0, translateY: 10 }}
                     animate={{ opacity: 1, translateY: 0 }}
                     transition={{ duration: 0.3, delay: i * 0.05 }}>
                     <SubjectListBox
                        userType={user.userType}
                        subjectData={subjectData}
                        getSubjects={getSubjects} //pass getSubjects to box to reload this component when an exam is deleted
                     />
                  </motion.div>
               </>
            );
         });

         setSubjectsList(subjectList_);
      }
   }

   function goToCreateExam() {
      navigate("/create-exam");
   }

   async function getSubjects() {
      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/exams/subjects",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {
            setTimeout(() => {
               setSubjectList(data.data.subjects);
               setIsLoading(false);
            }, 300);
         })
         .catch((err) => {
            setTimeout(() => {
               console.log(err.response);
               setIsLoading(false);
            }, 300);
         });
   }

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);

      //GET ALL LIST OF EXAMS CREATED BY THE USER
      getSubjects();
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
               <div className="ps-2 py-3 d-flex align-items-center justify-content-between">
                  <span className="text-black-50 fw-bold">Subjects</span>

                  {user && user.userType === "teacher" && (
                     <button className="btn btn-primary float-end" onClick={goToCreateExam}>
                        Create Exam
                     </button>
                  )}
               </div>
               <div className="pb-5">
                  {subjectsList.length !== 0 ? (
                     <div
                        className="row 
                        row-cols-1 
                        row-cols-md-2 
                        row-cols-xl-3 
                        g-3">
                        {subjectsList}
                     </div>
                  ) : (
                     <div className={`${css.no_subjects_container}`}>
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
