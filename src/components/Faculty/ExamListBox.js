import React from "react";
import css from "./css/ExamListBox.module.css";
import { useNavigate } from "react-router-dom";

export default function ExamListBox(props) {
   const navigate = useNavigate();

   function goToExamDetails() {
      navigate(`/exam-details/${props.examId}`);
   }

   return (
      <>
         <div className={`${css.exam_box} card p-4`} onClick={goToExamDetails}>
            <h4>Subject Title</h4>
            <p className="text-muted">Time available - Duration</p>
            <p>Total items</p>
         </div>
      </>
   );
}
