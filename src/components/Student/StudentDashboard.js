import React from "react";
import css from "./css/StudentDashboard.module.css";
// import StudentNavbar from "./StudentNavbar";
import Sidebar from "../Both/Sidebar";
import SubjectList from "../Both/SubjectList";

export default function StudentDashboard(props) {
   React.useEffect(() => {
      document.title = `Dashboard | Online Examination`;
   }, []);
   return (
      <>
         <Sidebar>
            <div className={`${css.stud_dashboard_root} p-3`}>
               <div className="d-flex flex-column px-5 py-3">
                  <h1 className="m-0 mb-3">Dashboard</h1>
                  <hr className="m-0" />

                  <SubjectList />
               </div>
            </div>
         </Sidebar>
      </>
   );
}
