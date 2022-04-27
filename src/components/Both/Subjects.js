import React, { useContext } from "react";
import css from "./css/Subjects.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import jwt_decode from "jwt-decode";

import FacultyNavbar from "../Faculty/FacultyNavbar";
import StudentNavbar from "../Student/StudentNavbar";
import Sidebar from "./Sidebar";
import ExamList from "./ExamList";
import axios from "axios";
import { v1 as createId } from "uuid";

export default function Subjects(props) {
   const navigate = useNavigate();
   const { subject_name } = useParams();
   const { user, setUser } = useContext(UserContext);
   const [subjectNameList, setSubjectNameList] = React.useState([]);

   function goToSubject(subjectName) {
      navigate(`/subjects/${subjectName}`);
      window.location.reload();
   }

   async function getSubjectList() {
      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/exams/subjectNames",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {
            const subjectNames = data.data.subjectNames;

            if (subjectNames.includes(subject_name) || subject_name.toLowerCase() === "all") {
               setSubjectNameList(
                  subjectNames.map((val, i) => (
                     <li
                        key={createId()}
                        className={`${css.link} dropdown-item`}
                        onClick={() => goToSubject(val)}>
                        {val}
                     </li>
                  ))
               );
            } else {
               //if the url param does not exist in the list of subjects, return to dashboard
               navigate("/");
            }
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function getNavbar() {
      // identifies what type of navbar to be displayed
      if (user) {
         if (user.userType === "student") {
            return <StudentNavbar username={user.username} />;
         } else if (user.userType === "teacher") {
            return <FacultyNavbar username={user.username} />;
         }
      }
   }

   React.useEffect(() => {
      document.title = `${
         subject_name.toLowerCase() === "all" ? "All Subjects" : subject_name
      } | Online Examination`;
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
      getSubjectList();
   }, []);

   return (
      <>
         <Sidebar>
            <div className="p-3">
               <div className="d-flex flex-column px-5 py-3">
                  <div className="dropdown">
                     <a
                        className="dropdown-toggle text-black text-decoration-none"
                        href="#"
                        role="button"
                        id="subjectsDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <h1 className="d-inline mb-3">
                           {subject_name === "all" || subject_name === "All"
                              ? "All Subjects"
                              : subject_name}
                        </h1>
                     </a>

                     {/* dropdown list of subjects */}
                     <ul className="dropdown-menu" aria-labelledby="subjectsDropdown">
                        <li
                           key={createId()}
                           className={`${css.link} dropdown-item`}
                           onClick={() => goToSubject("All")}>
                           All subjects
                        </li>
                        {subjectNameList}
                     </ul>
                  </div>
                  <hr className="m-0 mt-3" />
                  <ExamList subjectName={subject_name} />
               </div>
            </div>
         </Sidebar>
      </>
   );
}
