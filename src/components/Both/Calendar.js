import React from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./css/StudentCalendar.module.css";
import css from "./css/StudentCalendar2.module.css";

import {
   ScheduleComponent,
   ViewsDirective,
   ViewDirective,
   Day,
   Week,
   Month,
   Agenda,
   Inject,
   Resize,
   DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { ToastComponent } from "@syncfusion/ej2-react-notifications";

class StudentCalendar extends React.Component {
   constructor() {
      super(...arguments);
      this.state = {
         exams: [],
         data: [],
      };

      this.position = { X: "Right", Y: "Top" };
   }

   componentDidMount = async () => {
      document.title = `Calendar | Online Examination`;

      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/exams/dates",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((res) => {
            console.log(res.data.exams);
            this.setState({
               exams: res.data.exams,
            });

            this.setState({
               data: res.data.exams?.map((val, i) => ({
                  Id: i,
                  Subject: val.title,
                  StartTime: new Date(val.date_from),
                  EndTime: new Date(val.date_to),
                  IsReadonly: true,
               })),
            });
         })
         .catch((err) => {
            console.log(err);
         });
   };

   templatedata() {
      return (
         <div className="e-toast-template e-toast-info">
            <div className="e-toast-message">
               <div className="e-toast-title">{this.state.data[0].Subject}</div>
            </div>
         </div>
      );
   }

   onCreated() {
      window.setInterval(function () {
         var scheduleObj = document.querySelector(".e-schedule").ej2_instances[0];

         var eventCollection = scheduleObj.getCurrentViewEvents();

         eventCollection.forEach((event, i) => {
            var dateFormat = (date) =>
               new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  date.getHours(),
                  date.getMinutes()
               );

            var alertBeforeMinutes = 5;
            var startTime = dateFormat(event[scheduleObj.eventFields.startTime]);
            var currentTime = dateFormat(new Date());

            if (currentTime.getTime() === startTime.getTime() - 1000 * 60 * alertBeforeMinutes) {
               var toastObjReminder = document.querySelector(".e-toast").ej2_instances[0];

               toastObjReminder.show();
            }
         });
      }, 60000);
   }

   render() {
      return (
         <>
            <Sidebar>
               {/* <div className="float-end">Todo List</div v> */}
               <div className={`${css.calendar_root}`}>
                  <div className="schedule-control-section bg-danger">
                     <div className="control-section">
                        <div className="control-wrapper">
                           <ScheduleComponent
                              currentView="Month"
                              height="100vh"
                              minWidth="100vw"
                              id="schedule"
                              ref={(schedule) => (this.scheduleObj = schedule)}
                              eventSettings={{ dataSource: this.state.data }}
                              created={this.onCreated.bind(this)}>
                              <ViewsDirective>
                                 <ViewDirective option="Day" />
                                 <ViewDirective option="Week" />
                                 <ViewDirective option="Month" />
                                 <ViewDirective option="Agenda" />
                              </ViewsDirective>

                              <Inject services={[Day, Week, Month, Agenda, Resize, DragAndDrop]} />
                           </ScheduleComponent>

                           <ToastComponent
                              ref={(toast) => {
                                 this.toastObj = toast;
                              }}
                              id="toast_default"
                              newestOnTop={true}
                              showCloseButton={true}
                              timeOut={5000}
                              target="#schedule"
                              position={this.position}
                              template={this.templatedata.bind(this)}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </Sidebar>
         </>
      );
   }
}

export default StudentCalendar;
