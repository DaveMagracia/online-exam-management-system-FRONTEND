import React from "react";
import css from "./css/PrintResults.module.css";

function formatDate(time) {
   //formats the date passed
   var time_ = time;

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

   var hour12HrFormat = time_.getHours() % 12 || 12;
   var minutes = time_.getMinutes();

   if (minutes.toString().length === 1) {
      //add 0 to start of number if minutes is a single digit
      minutes = "0" + minutes.toString();
   }

   var ampm = time_.getHours() < 12 || time_.getHours() === 24 ? "AM" : "PM";

   let formattedTime = `${
      months[time_.getMonth()]
   } ${time_.getDate()}, ${hour12HrFormat}:${minutes} ${ampm}`;
   return formattedTime;
}

export const PrintResults = React.forwardRef(
   ({ exam, studentInfo, questions, results, answers }, ref) => {
      return (
         <div ref={ref}>
            <div className={`${css.results_root} d-flex justify-content-center`}>
               <div className={`${css.results_container} p-3`}>
                  <div className="exam_head mb-4">
                     <div className="d-flex justify-content-between">
                        <div>
                           <h1 className="m-0">Results</h1>
                           <p className="m-0 text-muted">Title: {exam.title}</p>
                           <p className="m-0 text-muted">Subject: {exam.subject}</p>
                        </div>
                        <div className="mt-3 d-flex">
                           <div className="d-flex flex-column align-items-center justify-content-center">
                              <p className="text-muted m-0 text-center">Total Score</p>
                              {exam.totalScore >= exam.passingScore ? (
                                 <h6 className="m-0 text-success d-inline">
                                    {exam.totalScore} out of {exam.totalPoints}
                                 </h6>
                              ) : (
                                 <h6 className="m-0 text-danger d-inline">
                                    {exam.totalScore} out of {exam.totalPoints}
                                 </h6>
                              )}
                           </div>
                           <div className="vr mx-3"></div>
                           <div className="d-flex flex-column align-items-center justify-content-center">
                              <p className="text-muted m-0 text-center">Passing Score</p>
                              <h6 className="m-0 text-center">{exam.passingScore} points</h6>
                           </div>
                        </div>
                     </div>
                     <hr />
                     <div className="d-flex">
                        <div className="flex-grow-1">
                           <p className="m-0">
                              <b>Name</b>:{" "}
                              {studentInfo.fullName ? (
                                 studentInfo.fullName
                              ) : (
                                 <span className="text-black-50">Not Specified</span>
                              )}
                           </p>
                           <p className="m-0">
                              <b>Student ID</b>:{" "}
                              {studentInfo.studentNumId ? (
                                 studentInfo.studentNumId
                              ) : (
                                 <span className="text-black-50">Not Specified</span>
                              )}
                           </p>
                           <p className="m-0">
                              <b>Started at</b>: {formatDate(new Date(exam.startedTime))}
                           </p>
                           <p className="m-0">
                              <b>Finished at</b>: {formatDate(new Date(exam.finishedTime))}
                           </p>
                           {exam.directions && (
                              <div className="mt-4">
                                 <h5 className="m-0">Directions: </h5>
                                 <p className={`${css.directions} text-break m-0 mt-1`}></p>
                                 {exam.directions}
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className="m-3">
                     {/* DISPLAY QUESTIONS */}
                     {questions.length > 0 &&
                        questions?.map((question, index) => (
                           <>
                              <div className="page-break" />

                              <div className="pb-4">
                                 <div className="d-flex flex-column">
                                    <small className="text-muted float-end">
                                       {results[index]
                                          ? questions[index].points +
                                            (questions[index].points === 1 ? " point" : " points")
                                          : "0 points"}
                                    </small>
                                    {/* <h5 className="m-0 me-3 d-inline">{index + 1}.</h5> */}
                                    <p className={`${css.question} m-0 mt-2`}>
                                       <b>{index + 1}.</b> {question.question}
                                    </p>
                                 </div>

                                 {/* <p className="mt-2">{question.question}</p> */}
                                 <div className="choices m-0">
                                    {question.shuffledChoices.map((choice) => {
                                       if (results[index]) {
                                          //if answer is correct
                                          if (answers[`question${index}`] === choice.index) {
                                             return (
                                                <div
                                                   // key={createId()}
                                                   className={`${css.choices} alert alert-success m-0 p-1`}>
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          }
                                       } else {
                                          //if answer is wrong
                                          if (answers[`question${index}`] === choice.index) {
                                             return (
                                                <div
                                                   // key={createId()}
                                                   className="alert alert-danger m-0 p-1">
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          } else if (choice.index === question.answer) {
                                             return (
                                                <div
                                                   // key={createId()}
                                                   className="alert alert-success m-0 p-1">
                                                   <input
                                                      type="radio"
                                                      className="me-3"
                                                      checked={
                                                         answers[`question${index}`] ===
                                                         choice.index
                                                      }
                                                      value={choice.index}
                                                      name={`question${index}`}
                                                      readOnly
                                                   />
                                                   {choice.choice}
                                                </div>
                                             );
                                          }
                                       }
                                       return (
                                          <div
                                             //    key={createId()}
                                             className="p-1">
                                             <input
                                                type="radio"
                                                className="me-3"
                                                checked={
                                                   answers[`question${index}`] === choice.index
                                                }
                                                value={choice.index}
                                                name={`question${index}`}
                                                readOnly
                                             />
                                             {choice.choice}
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           </>
                        ))}
                  </div>
               </div>
            </div>
         </div>
      );
   }
);
