import React from "react";
import css from "./css/SubjectListBox.module.css";
import { useNavigate } from "react-router-dom";
import { v1 as createId } from "uuid";

export default function SubjectListBox(props) {
   const navigate = useNavigate();
   const subjectData = props.subjectData;

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
                     className={`${css.link} text-break m-0`}
                     onClick={() => goToSubjects(subjectData.subject)}>
                     {subjectData.subject}
                  </h4>
                  <p className="m-0 text-muted">
                     {props.userType === "student" && subjectData.createdBy}
                  </p>
                  <p className="mt-2">
                     {subjectData.examCount}
                     {subjectData.examCount === 1 ? " exam" : " exams"}
                  </p>
                  <div className="my-5">
                     {subjectData.upcomingExams.length > 0 ? (
                        <p className="fw-bold m-0">Upcoming Exams</p>
                     ) : (
                        <p className="m-0">No Upcoming Exams</p>
                     )}

                     {/* display incoming exams */}
                     {subjectData.upcomingExams &&
                        subjectData.upcomingExams.map((val, i) => {
                           if (i < 2)
                              return (
                                 <small
                                    key={createId()}
                                    className={`${css.link} m-0 d-block`}
                                    onClick={() => goToExamDetails(val.id)}>
                                    {val.title}
                                 </small>
                              );
                           else if (i < 3)
                              return (
                                 <small key={createId()} className="m-0">
                                    {subjectData.upcomingExams.length - 2} more item...
                                 </small>
                              );
                        })}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
