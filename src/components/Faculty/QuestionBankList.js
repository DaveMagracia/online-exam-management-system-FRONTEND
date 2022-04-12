import React from "react";
import QuestionBankListBox from "./QuestionBankListBox";
import css from "./css/QuestionBankList.module.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionBankList() {
   const navigate = useNavigate();
   const [questionBankList, setQuestionBanksList] = React.useState([]); //will contain the list of banks made by the user

   function setQuestionBankList(bankArray) {
      //populate the examsList with elements of each exam
      if (bankArray) {
         let examsList_ = bankArray.map((questionBankData, i) => (
            <motion.div
               key={i}
               initial={{ opacity: 0, translateY: 10 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ duration: 0.3, delay: i * 0.05 }}>
               <QuestionBankListBox
                  questionBankData={questionBankData}
                  getQuestionBanks={getQuestionBanks} //pass getExams to box to reload this component when an exam is deleted
               />
               {/* SAMPLE exam id only*/}
            </motion.div>
         ));

         setQuestionBanksList(examsList_);
      }
   }

   function goToCreateQuestionBank() {
      navigate("/create-bank");
   }

   async function getQuestionBanks() {
      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/question-banks",
         headers: {
            Authorization: localStorage.getItem("token"),
         },
      })
         .then((data) => {
            //pass the array of banks
            setQuestionBankList(data.data.questionBanks);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      //GET ALL LIST OF EXAMS CREATED BY THE USER
      getQuestionBanks();
   }, []);

   return (
      <>
         <div>
            <div className="d-flex justify-content-between mb-2">
               <h3>Question Banks</h3>
               <button
                  className="btn btn-primary float-end"
                  onClick={goToCreateQuestionBank}>
                  Create Question Bank
               </button>
            </div>
            {questionBankList.length !== 0 ? (
               <div
                  className={`${css.banks_container} 
                  row 
                  row-cols-1 
                  row-cols-md-2 
                  row-cols-xl-3 
                  g-3
                  mt-3`}>
                  {questionBankList}
               </div>
            ) : (
               <div className={`${css.no_banks_container} mb-5`}>
                  <p className="text-muted text-center">
                     You have not created a question bank yet. Banks you have
                     created will appear here.
                  </p>
               </div>
            )}
         </div>
      </>
   );
}
