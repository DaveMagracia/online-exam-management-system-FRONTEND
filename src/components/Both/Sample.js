//For calendar pa change nlng yung name Sample.js yung name

import React from "react";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar"; //install react-calendar
import { FaPlus, FaBullhorn, FaHandSparkles, FaRegCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export default function Sample() {
   const [showDate, setShowDate] = React.useState(true);
   const [date, setDate] = React.useState(new Date());
   const [isAddEnabled, setIsAddEnabled] = React.useState(true);
   const [addTodoTextField, setAddTodoTextField] = React.useState("");
   const [formData, setFormData] = React.useState({
      todo_list: "",
   });
   const [todoList, setTodoList] = React.useState([]);
   const [announcements, setAnnouncements] = React.useState("");

   const navigate = useNavigate();

   async function TodoSubmit(event) {
      event.preventDefault();
      await axios({
         method: "POST",
         url: "http://www.localhost:5000/user/addtodolist",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         data: todoList,
      })
         .then((data) => {})
         .catch((err) => {});
   }

   function ShowFullCalendar() {
      navigate("/calendar");
   }

   function handleOnChange(event) {
      const { name, value, type, checked } = event.target;
      //removes error to TAC checkbox if the checkbox is clicked

      //set the new value to the formData
      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   function HideDates() {
      setShowDate(true);
   }
   function ShowDates() {
      setShowDate(false);
   }

   function addTodo() {
      setIsAddEnabled(false);
      if (isAddEnabled) {
         setTodoList((prevVal) => [...prevVal, "NewTextBox"]);
      }
   }

   async function submitTodo(event) {
      event.preventDefault();
      var toDoListTemp = [
         ...todoList.filter((val) => {
            if (val !== "NewTextBox") {
               return val;
            }
         }),
         addTodoTextField,
      ];

      setTodoList(toDoListTemp);
      setAddTodoTextField("");
      setIsAddEnabled(true);

      await axios({
         method: "POST",
         url: "http://www.localhost:5000/user/addtodolist",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         data: toDoListTemp,
      })
         .then((data) => {
            console.log(data.data);
         })
         .catch((err) => {});
   }

   async function deleteItem(event) {
      var parent = event.currentTarget.parentNode;
      let name = parent.getAttribute("name");

      var toDoListTemp = [
         ...todoList.filter((val, i) => {
            if (i !== Number(name.charAt(name.length - 1))) {
               return val;
            }
         }),
      ];

      setTodoList(toDoListTemp);

      await axios({
         method: "POST",
         url: "http://www.localhost:5000/user/addtodolist",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         data: toDoListTemp,
      })
         .then((data) => {
            console.log(data.data);
         })
         .catch((err) => {});
   }

   async function getUserToDolist() {
      await axios({
         method: "GET",
         url: "http://www.localhost:5000/user/getTodo",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {
            setTodoList(data.data.todoList.todoList);
         })
         .catch((err) => {});
   }

   async function getAnnouncements() {
      await axios({
         method: "GET",
         url: "http://www.localhost:5000/admin/getAnnouncements",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {})
         .catch((err) => {});
   }

   async function getWebsiteContents() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/admin/content`,
      })
         .then((res) => {
            setAnnouncements(res.data.contents.announcements);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      getUserToDolist();
      getAnnouncements();
      getWebsiteContents();
   }, []);

   function handleTodoOnchange(event) {
      const { name, value } = event.target;
      setAddTodoTextField(value);
   }

   return (
      <>
         {showDate ? (
            <div className="calendar-container">
               <div className="todo_container mt-3">
                  <Calendar onChange={setDate} value={date} />
                  <hr className="style2" />
                  <div className="container">
                     <div className="row">
                        <div className="col">
                           <div className={`hide text-secondary p-2`} onClick={ShowDates}>
                              Hide
                              <div className=" text-secondary float-end" onClick={ShowFullCalendar}>
                                 <FaRegCalendarAlt /> Full Calendar
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="container">
               <div className="row">
                  <div className="col">
                     <div className="hide text-secondary float-end" onClick={HideDates}>
                        Show Dates
                     </div>
                  </div>
               </div>
            </div>
         )}
         <div className="todo_container mt-3 px-2 py-2">
            <div className="row">
               <div className="col">
                  <h5 className="p-2">
                     To-do List
                     <div
                        className={`${!isAddEnabled && `text-secondary`} float-end hide`}
                        // data-bs-toggle="modal"
                        // data-bs-target="#exampleModal"
                        onClick={addTodo}>
                        <FaPlus />{" "}
                     </div>
                  </h5>
               </div>

               {todoList.length === 0 ? (
                  <div className="d-flex flex-column justify-content-center align-items-center mt-2 mb-5">
                     <img
                        className="todoEmptyImg"
                        src="/images/res/todoEmpty.png"
                        alt=""
                        width={"100px"}
                     />
                     <span className="text-black-50 mt-2">You have no notes here</span>
                  </div>
               ) : (
                  <div className="d-flex flex-column justify-content-center align-items-start">
                     <ul className="pt-2 h-100 w-100 todo-container pe-3">
                        {todoList.map((val, i) => {
                           if (val === "NewTextBox") {
                              return (
                                 <li className="mb-2">
                                    <form onSubmit={submitTodo}>
                                       <input
                                          type="text"
                                          name="todoItem"
                                          className="w-100"
                                          onChange={handleTodoOnchange}
                                          value={addTodoTextField}
                                       />
                                    </form>
                                 </li>
                              );
                           }
                           return (
                              <li className="mb-2 todo-list-item">
                                 {val}
                                 <div className="delete-icon" name={`item${i}`}>
                                    <MdDelete className="float-end" onClick={deleteItem} />
                                 </div>
                              </li>
                           );
                        })}
                     </ul>
                  </div>
               )}
            </div>
         </div>

         <div className="announcement_container mt-3 px-2 py-2">
            <div className="row">
               <div className="col-sm-8">
                  <h5 className="ps-2 pt-2">
                     Announcements <FaBullhorn className="ms-1" />
                  </h5>
               </div>

               {announcements === "" || announcements.startsWith("<p></p>") ? (
                  <div className="d-flex flex-column justify-content-center align-items-center mt-4 mb-5">
                     <img
                        className="announcementsEmptyImg"
                        src="/images/res/announcementsEmpty.png"
                        alt=""
                        width={"100px"}
                     />
                     <span className="text-black-50 mt-2">No Announcements</span>
                  </div>
               ) : (
                  <div className="d-flex flex-column justify-content-center align-items-start">
                     {/* <ul className="pt-2 h-100 w-100 todo-container pe-3"> */}
                     {/* {announcementList.map((val, i) => {
                           return <li className="mb-2">{val}</li>;
                        })} */}
                     <div
                        className="pt-2 h-100 w-100 todo-container px-3"
                        dangerouslySetInnerHTML={{
                           __html: announcements,
                        }}
                     />
                     {/* </ul> */}
                  </div>
               )}
            </div>
         </div>

         <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
               <div class="modal-content">
                  <div class="modal-header">
                     <h5 class="modal-title" id="exampleModalLabel">
                        Todo List
                     </h5>
                     <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                     <form onSubmit={TodoSubmit}>
                        <textarea
                           type="text"
                           class="form-control  p-2 "
                           name="todo_list"
                           id="todo_list"
                           onChange={handleOnChange}
                           value={formData.todo_list}
                           rows="3"
                        />
                        <div class="modal-footer">
                           <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                              Close
                           </button>
                           <button type="submit" class="btn btn-primary">
                              Save changes
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
