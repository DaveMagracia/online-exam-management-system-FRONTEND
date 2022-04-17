import React from "react";
import ExamListBox from "./ExamListBox";
import css from "./css/ExamList.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ExamList(props) {
   const navigate = useNavigate();
   const [examsList, setExamsList] = React.useState([]); //will contain the list of exams made by the user

   function setExamList(examArray) {
      //populate the examsList with elements of each exam
      if (examArray) {
         let examsList_ = examArray.map((examData, i) => (
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
         ));

         setExamsList(examsList_);
      }
   }

   function goToCreateExam() {
      navigate("/create-exam");
   }

   async function getExams() {
      //if this props is present, get the exams for that specific subject
      if (props.subjectName) {
         await axios({
            method: "GET",
            baseURL: `http://localhost:5000/exams/subjects/${props.subjectName}`,
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         })
            .then((data) => {
               //pass the array of exams
               setExamList(data.data.exams);
            })
            .catch((err) => {
               console.log(err);
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
            })
            .catch((err) => {
               console.log(err);
            });
      }
   }

   React.useEffect(() => {
      //GET ALL LIST OF EXAMS CREATED BY THE USER
      getExams();
   }, []);

   return (
      <>
         <div>
            <div>
               <h3 className="d-inline">Exams</h3>
               <button
                  className="btn btn-primary float-end"
                  onClick={goToCreateExam}>
                  Create Exam
               </button>
            </div>
            {examsList.length !== 0 ? (
               <div
                  className="row 
                  row-cols-1 
                  row-cols-md-2 
                  row-cols-xl-3 
                  g-3
                  mt-3">
                  {examsList}
               </div>
            ) : (
               <div className={`${css.no_exams_container}`}>
                  <p className="text-muted text-center">
                     You have not created an exam yet. Exams you have created
                     will appear here.
                  </p>
               </div>
            )}
         </div>
      </>
   );
}
