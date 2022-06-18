import React from "react";
import css from "./css/FacultyDashboard.module.css";
import FacultyNavbar from "./FacultyNavbar";
import Sidebar from "../Both/Sidebar";
import ExamList from "../Both/ExamList";
import SubjectList from "../Both/SubjectList";
import QuestionBankList from "./QuestionBankList";
import DashboardFooter from "../Both/DashboardFooter";
import axios from "axios";

export default function FacultyDashboard(props) {
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
            <div className={`${css.fact_dashboard_root} p-3`}>
               <div className="d-flex flex-column px-5 py-3">
                  <h1 className="m-0 mb-3">Dashboard</h1>
                  <hr className="m-0" />

                  {/* <ExamList /> */}
                  <SubjectList />
                  <hr className="mt-5" />
                  <QuestionBankList />
                  <DashboardFooter />
               </div>
            </div>
         </Sidebar>
      </>
   );
}
