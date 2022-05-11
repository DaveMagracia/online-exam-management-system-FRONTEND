import React from "react";
import css from "./css/PrintActionLog.module.css";
import { v1 as createId } from "uuid";

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

function formatDuration(date, startedTime) {
   date = Math.floor(date - new Date(startedTime)) / 1000;
   //   var sec_num = parseInt(date, 10); // don't forget the second param

   var hours = Math.floor(date / 3600);
   var minutes = Math.floor((date - hours * 3600) / 60);
   var seconds = Math.floor(date % 60);

   if (hours < 10) {
      hours = "0" + hours;
   }
   if (minutes < 10) {
      minutes = "0" + minutes;
   }
   if (seconds < 10) {
      seconds = "0" + seconds;
   }
   return hours + ":" + minutes + ":" + seconds;
}

export const PrintActionLog = React.forwardRef(({ exam, studentInfo, actionLog }, ref) => {
   return (
      <div ref={ref}>
         <div className={`${css.results_root} d-flex justify-content-center`}>
            <div className={`${css.results_container} p-3`}>
               <div className="exam_head mb-4">
                  <div className="d-flex justify-content-between">
                     <div>
                        <h1 className="m-0">Action Log</h1>
                        <p className="m-0 text-muted">Title: {exam.title}</p>
                        <p className="m-0 text-muted">Subject: {exam.subject}</p>
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
                     </div>
                  </div>

                  <div className="mt-3">
                     {actionLog &&
                        actionLog.map((val, i) => (
                           <div className="d-flex" key={createId()}>
                              <div className="d-flex align-items-center">
                                 <div className="d-flex flex-column align-items-center">
                                    <div
                                       className={`vr mx-4 ${css.vertical_rule} ${
                                          i === 0 && "bg-white"
                                       }`}></div>
                                    <div className={css.icon_circle}></div>
                                    <div
                                       className={`vr mx-4 ${css.vertical_rule} ${
                                          i === actionLog.length - 1 && "bg-white"
                                       }`}></div>
                                 </div>
                                 <span className="text-muted">
                                    {formatDuration(new Date(val.time), exam.startedTime)}
                                 </span>
                              </div>
                              <div className="d-flex align-items-center">
                                 <span
                                    className={`ms-4 ${
                                       i === 0 || i === actionLog.length - 1 ? "fw-bold" : ""
                                    }
                                    ${
                                       (val.action === "Changed window/tab" ||
                                          val.action === "Resumed viewing the exam") &&
                                       "text-danger"
                                    }`}>
                                    {val.action}
                                 </span>
                              </div>
                           </div>
                        ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
});
