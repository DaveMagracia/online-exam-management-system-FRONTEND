import React from "react";
import { useParams } from "react-router-dom";

export default function ExamDetails() {
   const { exam_id } = useParams();

   return (
      <>
         <div className="container">
            <h1 className="display-1">Exam Details {exam_id}</h1>
         </div>
      </>
   );
}
