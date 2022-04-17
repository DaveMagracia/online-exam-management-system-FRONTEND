import React from "react";
import SubjectListBox from "./SubjectListBox";
import css from "./css/SubjectList.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SubjectList() {
   const navigate = useNavigate();
   const [subjectsList, setSubjectsList] = React.useState([]); //will contain the list of exams made by the user

   function setSubjectList(subjectArray) {
      //populate the examsList with elements of each exam
      if (subjectArray) {
         let subjectList_ = subjectArray.map((subjectData, i) => {
            return (
               <motion.div
                  className="col"
                  key={i}
                  initial={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}>
                  <SubjectListBox
                     subjectData={subjectData}
                     getSubjects={getSubjects} //pass getSubjects to box to reload this component when an exam is deleted
                  />
               </motion.div>
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
            //pass the array of exams
            console.log(data.data.subjects);
            setSubjectList(data.data.subjects);
         })
         .catch((err) => {
            console.log(err.response);
         });
   }

   React.useEffect(() => {
      //GET ALL LIST OF EXAMS CREATED BY THE USER
      getSubjects();
   }, []);

   return (
      <>
         <div>
            <div>
               <h3 className="d-inline">Subjects</h3>
               <button
                  className="btn btn-primary float-end"
                  onClick={goToCreateExam}>
                  Create Exam
               </button>
            </div>
            {subjectsList.length !== 0 ? (
               <div
                  className="row 
                  row-cols-1 
                  row-cols-md-2 
                  row-cols-xl-3 
                  g-3
                  mt-3">
                  {subjectsList}
               </div>
            ) : (
               <div className={`${css.no_subjects_container}`}>
                  <p className="text-muted text-center">
                     You have not created an exam yet. Subjects on exams you
                     created will appear here.
                  </p>
               </div>
            )}
         </div>
      </>
   );
}
