import React from "react";
import css from "./css/SubjectListBox.module.css";
import { useNavigate } from "react-router-dom";

export default function SubjectListBox(props) {
   const navigate = useNavigate();
   const subjectData = props.subjectData;

   function formatDate(date) {
      date = new Date(date);
      var months = [
         "Jan",
         "Feb",
         "Mar",
         "Apr",
         "May",
         "Jun",
         "Jul",
         "Aug",
         "Sep",
         "Oct",
         "Nov",
         "Dec",
      ];

      var hour12HrFormat = date.getHours() % 12 || 12;
      var minutes = date.getMinutes();

      if (minutes.toString().length === 1) {
         //add 0 to start of number if minutes is a single digit
         minutes = "0" + minutes.toString();
      }

      var ampm = date.getHours() < 12 || date.getHours() === 24 ? "AM" : "PM";

      let formattedDate = `${
         months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()} at ${hour12HrFormat}:${minutes} ${ampm}`;

      return formattedDate;
   }

   function goToExamDetails(examId) {
      navigate(`/exam-details/${examId}`);
   }

   function goToSubjects(subjectName) {
      navigate(`/subjects/${subjectName}`);
   }

   return (
      <>
         <div className={`${css.subject_box} card p-4`}>
            <div className="d-flex flex-row justify-content-between">
               <div>
                  <h4
                     className={`${css.link} text-break`}
                     onClick={() => goToSubjects(subjectData.subject)}>
                     {subjectData.subject}
                  </h4>
                  <p>
                     {subjectData.examCount}
                     {subjectData.examCount === 1 ? " exam" : " exams"}
                  </p>
                  <p className="my-5">
                     {subjectData.upcomingExams.length > 0 ? (
                        <p className="fw-bold m-0">Upcoming Exams</p>
                     ) : (
                        <p className="m-0">No Upcoming Exams</p>
                     )}
                     {subjectData.upcomingExams &&
                        subjectData.upcomingExams.map((val, i) => {
                           if (i < 2)
                              return (
                                 <small
                                    className={`${css.link} m-0 d-block`}
                                    onClick={() => goToExamDetails(val.id)}>
                                    {val.title}
                                 </small>
                              );
                           else if (i < 3)
                              return (
                                 <small className="m-0">
                                    {subjectData.upcomingExams.length - 2} more
                                    item...
                                 </small>
                              );
                        })}
                  </p>
               </div>
            </div>
         </div>
      </>
   );
}
