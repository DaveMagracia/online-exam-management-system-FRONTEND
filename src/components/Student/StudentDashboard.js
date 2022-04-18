import React from "react";
import css from "./css/StudentDashboard.module.css";
import StudentNavbar from "./StudentNavbar";
import SubjectList from "../Main/SubjectList";

export default function StudentDashboard(props) {
   return (
      <>
         <StudentNavbar username={props.username} />
         <div className={`${css.stud_dashboard_root} p-3`}>
            <div className="d-flex flex-column container">
               <h1 className="display-1 m-0">Student Dashboard</h1>
               <hr className="m-0" />

               <SubjectList />
            </div>
         </div>
      </>
   );
}
