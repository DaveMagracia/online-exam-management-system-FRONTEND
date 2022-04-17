import React, { useContext } from "react";
import css from "./css/Subjects.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import jwt_decode from "jwt-decode";

import FacultyNavbar from "./FacultyNavbar";
import ExamList from "./ExamList";
import axios from "axios";

export default function Subjects(props) {
   const navigate = useNavigate();
   const { subject_name } = useParams();
   const { user, setUser } = useContext(UserContext);
   const [subjectNameList, setSubjectNameList] = React.useState([]);

   function goToExamDetails(examId) {
      navigate(`/exam-details/${examId}`);
   }

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
            console.log(data.data.subjectNames);
            setSubjectNameList(
               data.data.subjectNames.map((val) => (
                  <>
                     <li
                        class={`${css.link} dropdown-item`}
                        onClick={() => goToSubject(val)}>
                        {val}
                     </li>
                  </>
               ))
            );
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      //get user details from token to set the initial values of the form
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
      getSubjectList();
   }, []);

   return (
      <>
         <FacultyNavbar username={user ? user.username : ""} />
         <div className="container">
            <div class="dropdown mt-5">
               <a
                  className="dropdown-toggle text-black text-decoration-none"
                  href="#"
                  role="button"
                  id="subjectsDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <h2 className="mt-5 d-inline">{subject_name}</h2>
               </a>

               <ul class="dropdown-menu" aria-labelledby="subjectsDropdown">
                  {subjectNameList}
               </ul>
            </div>
            <hr />
            <ExamList subjectName={subject_name} />
         </div>
      </>
   );
}
