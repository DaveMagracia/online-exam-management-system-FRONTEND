import React from "react";
import css from "./css/StudentDashboard.module.css";
// import StudentNavbar from "./StudentNavbar";
import Sidebar from "../Both/Sidebar";
import SubjectList from "../Both/SubjectList";
import { GiBrain } from "react-icons/gi";
import Sample from "../Both/Sample";
import DashboardFooter from "../Both/DashboardFooter";
import axios from "axios";

export default function StudentDashboard(props) {
   async function getWebsiteContents() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/admin/content`,
      })
         .then((res) => {
            document.title = `Dashboard | ${res.data.contents.title}`;
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      getWebsiteContents();
   }, []);
   return (
      <>
         <Sidebar>
            <div
               className={`${css.stud_dashboard_root} d-flex flex-column justify-content-between ps-md-4 py-4 pe-4`}>
               <div>
                  <div className="d-flex flex-column bg-white card">
                     <h5 className={`${css.dashboard_title} m-0 p-3 ps-4 text-light`}>Dashboard</h5>
                     {/* <hr className="m-0" /> */}
                  </div>

                  <div class="d-flex flex-column flex-lg-row">
                     <div className="d-flex flex-column mt-3 w-100 pe-4">
                        <SubjectList />
                     </div>

                     <div class="ms-4 ms-auto">
                        <div className="calendar-container float-end p-2 mt-3">
                           <Sample />
                        </div>
                     </div>
                  </div>
               </div>
               <DashboardFooter />
            </div>
         </Sidebar>
      </>
   );
}
