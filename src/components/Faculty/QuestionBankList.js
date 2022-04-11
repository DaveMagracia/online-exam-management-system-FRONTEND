import React from "react";
import QuestionBankListBox from "./QuestionBankListBox";
import css from "./css/QuestionBankList.module.css";
import { motion } from "framer-motion";

export default function QuestionBankList() {
   function getQuestionBankList() {
      let elements = [];
      for (var i = 0; i < 10; i++) {
         elements.push(
            <motion.div
               className="col"
               key={i}
               initial={{ opacity: 0, translateY: 10 }}
               animate={{ opacity: 1, translateY: 0 }}
               transition={{ duration: 0.3, delay: i * 0.05 }}>
               <QuestionBankListBox bankId={i + 1} number={i + 1} />
               {/* SAMPLE exam id only*/}
            </motion.div>
         );
      }
      return elements;
   }

   return (
      <>
         <h3>Question Banks</h3>
         <div
            className="row 
              row-cols-1 
              row-cols-sm-2 
              row-cols-md-3 
              row-cols-xl-4 
              row-cols-xxl-5 
              g-3
              mb-5">
            {getQuestionBankList()}
         </div>
      </>
   );
}
