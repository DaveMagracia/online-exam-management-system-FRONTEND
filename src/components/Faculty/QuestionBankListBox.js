import React from "react";
import css from "./css/QuestionBankListBox.module.css";
import { useNavigate } from "react-router-dom";

export default function QuestionBankListBox(props) {
   const navigate = useNavigate();

   function goToQuestionBank() {
      navigate(`/question-bank/${props.bankId}`);
   }

   return (
      <>
         <div
            className={`${css.question_box} card p-4`}
            onClick={goToQuestionBank}>
            <h4>Question Bank {props.number}</h4>
            <p className="text-muted">Number of Questions</p>
         </div>
      </>
   );
}
