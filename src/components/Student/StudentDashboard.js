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
            <div className={`${css.stud_dashboard_root} ps-md-4 py-4 pe-4`}>
               <div className="d-flex flex-column  bg-white card">
                  <h5 className={`${css.dashboard_title} m-0 p-3 ps-4 text-light`}>Dashboard</h5>
                  {/* <hr className="m-0" /> */}
               </div>

               <div className="d-flex flex-column mt-3 ">
                  <SubjectList />
               </div>
            </div>
         </Sidebar>
      </>
   );
}
