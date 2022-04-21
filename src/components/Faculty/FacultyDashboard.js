import React from "react";
import css from "./css/FacultyDashboard.module.css";
import FacultyNavbar from "./FacultyNavbar";
import ExamList from "../Both/ExamList";
import SubjectList from "../Both/SubjectList";
import QuestionBankList from "./QuestionBankList";

export default function FacultyDashboard(props) {
   return (
      <>
         <FacultyNavbar username={props.username} />
         <div className={`${css.fact_dashboard_root} p-3`}>
            <div className="d-flex flex-column container">
               <h1 className="display-1 m-0">Faculty Dashboard</h1>
               <hr className="m-0" />

               {/* <ExamList /> */}
               <SubjectList />
               <hr className="mt-5" />

               <QuestionBankList />
            </div>
         </div>
      </>
   );
}
