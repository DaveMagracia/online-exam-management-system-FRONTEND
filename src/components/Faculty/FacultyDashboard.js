import React from "react";
import css from "./css/FacultyDashboard.module.css";
import FacultyNavbar from "./FacultyNavbar";
import Sidebar from "../Both/Sidebar";
import ExamList from "../Both/ExamList";
import SubjectList from "../Both/SubjectList";
import QuestionBankList from "./QuestionBankList";

export default function FacultyDashboard(props) {
   return (
      <>
         <Sidebar>
            <div className={`${css.fact_dashboard_root} p-3`}>
               <div className="d-flex flex-column px-5 py-3">
                  <h1 className="m-0 mb-3">Dashboard</h1>
                  <hr className="m-0" />

                  {/* <ExamList /> */}
                  <SubjectList />
                  <hr className="mt-5" />
                  <QuestionBankList />
               </div>
            </div>
         </Sidebar>
      </>
   );
}
