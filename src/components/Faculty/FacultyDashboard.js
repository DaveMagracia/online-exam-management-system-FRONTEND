import React from "react";
import css from "./css/FacultyDashboard.module.css";
import FacultyNavbar from "./FacultyNavbar";
import ExamList from "./ExamList";
import QuestionBankList from "./QuestionBankList";

export default function FacultyDashboard(props) {
   return (
      <>
         <FacultyNavbar username={props.username} />
         <div className={`${css.fact_dashboard_root} p-3`}>
            <div className="d-flex flex-column container">
               <h1 className="display-1 m-0">Faculty Dashboard</h1>
               <hr />

               <ExamList />
               <hr className="mt-5" />

               <QuestionBankList />
            </div>
         </div>
      </>
   );
}
