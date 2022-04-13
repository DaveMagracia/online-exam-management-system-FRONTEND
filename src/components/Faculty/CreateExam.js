import React, { useContext } from "react";
import css from "./css/CreateExam.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import FacultyNavbar from "./FacultyNavbar";
import AddQuestion from "./AddQuestion";
import QuestionList from "./QuestionList";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Modal, Button } from "react-bootstrap";
import { v1 as createId } from "uuid";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import { MdContentCopy } from "react-icons/md";

export default function CreateExam(props) {
   const navigate = useNavigate();
   const { exam_id } = useParams();

   const timer = React.useRef(null); //timer for increment/decrement button
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setIsLoading] = React.useState(true);
   const [charCountTitle, setcharCountTitle] = React.useState(0);
   const [charCountDesc, setcharCountDesc] = React.useState(0);
   const [isAddingQuestion, setisAddingQuestion] = React.useState(false);
   const [isShownQuestionModal, setisShownQuestionModal] =
      React.useState(false);
   const [isShownExamModal, setisShownExamModal] = React.useState(false);
   const [isShownCreateModal, setIsShownCreateModal] = React.useState(false);
   const [isShownExamCodeModal, setIsShownExamCodeModal] =
      React.useState(false);

   const [examCode, setExamCode] = React.useState("");
   const [titleInput, setTitleInput] = React.useState(
      exam_id ? "Exam Title" : "Enter Exam Title..."
   );
   const [questions, setQuestions] = React.useState([]); //initially, questions are empty
   const [initDateVals, setInitDateVals] = React.useState({});
   const [hasError, setHasError] = React.useState(false);
   const [currentQuestion, setCurrentQuestion] = React.useState();

   const [formData, setFormData] = React.useState({
      title: "",
      date_from: new Date().getTime(), //set default time to current timestamp
      date_to: new Date().setMinutes(new Date().getMinutes() + 1), //set default time to current timestamp + 1 minute
      time_limit: 1, //1 minute is the default and minimum time limit
      directions: "",
   });

   const [errors, setErrors] = React.useState({
      title: { hasError: false, msg: "This field is required." },
      date_from: {
         hasError: false,
         msg: "Date should not be before the current time.",
      },
      date_to: {
         hasError: false,
         msg: "Date should not be before the current time.",
      },
      time_limit: {
         hasError: false,
         msg: "Time limit must be at least 1 minute.",
      },
      directions: { hasError: false, msg: "This field is required." },
      questions: {
         hasError: false,
         msg: "Exam must have at least 1 question.",
      },
   });

   function handleFormChange(event) {
      const { name, value } = event.target;
      let hasError = Object.keys(errors).some((k) => errors[k] === true);

      if (!hasError) {
         setHasError(false);
      }

      if (name === "title") {
         setcharCountTitle(value.length); //increment charCount on title
         //remove error if user types again on title
         setErrors((prevVal) => ({
            ...prevVal,
            title: { hasError: false, msg: "This field is required" },
         }));
      } else {
         setcharCountDesc(value.length); //increment charCount on directions
      }

      setFormData((prevVal) => ({
         ...prevVal,
         [name]: value,
      }));
   }

   function handleFromDateChange(fromDate) {
      fromDate = fromDate.getTime();

      //if the time set is less than the current time, set the FromDate value to the current date and time
      const currDate = new Date().getTime();
      if (fromDate <= currDate) {
         setFormData((prevVal) => ({
            ...prevVal,
            date_from: currDate,
            date_to: new Date().setMinutes(new Date().getMinutes() + 1),
         }));
      } else {
         //to avoid error on the ToDate field, if FromDate is greater than the ToDate, set the ToDate equal to (fromDate + 1 minute)

         setFormData((prevVal) => ({
            ...prevVal,
            date_from: fromDate,
         }));

         if (fromDate >= formData.date_to) {
            const newToDate = new Date(fromDate);

            setFormData((prevVal) => ({
               ...prevVal,
               date_to: new Date(
                  newToDate.setMinutes(newToDate.getMinutes() + 1) //add 1 minute to current time
               ).getTime(),
            }));
         }
      }
   }

   function handleToDateChange(toDate) {
      //similar to with FromField, if the ToDate is set less than the FromDate, set them equal
      const currDate = new Date().getTime();
      toDate = toDate.getTime();
      const fromDate = formData.date_from;

      if ((!toDate > fromDate && fromDate <= currDate) || toDate <= currDate) {
         setFormData((prevVal) => ({
            ...prevVal,
            date_from: currDate,
            date_to: new Date().setMinutes(new Date().getMinutes() + 1),
         }));
      } else {
         setFormData((prevVal) => ({
            ...prevVal,
            date_to: toDate,
         }));

         if (toDate <= fromDate) {
            const newToDate = new Date(toDate);

            setFormData((prevVal) => ({
               ...prevVal,
               date_from: newToDate.setMinutes(newToDate.getMinutes() - 1),
            }));
         }
      }
   }

   function validateForm() {
      let tempErrors = { ...errors };
      tempErrors.title.hasError = formData.title ? false : true;
      tempErrors.date_from.hasError =
         new Date(formData.date_from).getTime() < new Date().getTime(); //check if time is less than current time
      tempErrors.date_to.hasError =
         new Date(formData.date_to).getTime() <
         new Date().setMinutes(new Date().getMinutes() + 1)
            ? true
            : false;
      tempErrors.time_limit.hasError = formData.time_limit ? false : true;
      tempErrors.questions.hasError = questions.length === 0 ? true : false;

      if (tempErrors.title.hasError) {
         //set default error message to title
         //its value can change because the message can be changed when there is no
         //title provided when the exam is saved
         //SEE saveChanges()
         tempErrors.title.msg = "This field is required";
      }

      var hasError_ = Object.keys(tempErrors).some(
         (k) => tempErrors[k].hasError === true
      );

      setErrors(tempErrors);
      setHasError(hasError_);

      if (hasError_) {
         return false;
      }
      return true;
   }

   function removeQuestionError() {
      //this function removes error particularly from questions, once user clicks on "add a question" button
      setErrors((prevVal) => ({
         ...prevVal,
         questions: {
            hasError: false,
            msg: "Exam must have at least 1 question",
         },
      }));
   }

   async function submitForm() {
      //validation
      if (validateForm()) {
         //if created while editing unfinished exam
         if (exam_id) {
            //PUBLISH A SAVED EXAM
            await axios({
               method: "PATCH",
               baseURL: `http://localhost:5000/exams/${exam_id}`,
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
               data: {
                  isPublishing: true,
                  examData: formData,
                  questions: questions.map(
                     ({ localId, ...keepAttrs }) => keepAttrs //this will remove the "localId" property and keep the rest
                  ),
               },
            })
               .then((data) => {
                  setExamCode(data.data.examCode);
                  setIsShownCreateModal(false);
                  setIsShownExamCodeModal(true);
               })
               .catch((err) => {
                  console.log(err);
               });
         } else {
            await axios({
               method: "POST",
               baseURL: "http://localhost:5000/exams",
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
               data: {
                  isPublishing: true,
                  exam: formData,
                  questions: questions.map(
                     ({ localId, ...keepAttrs }) => keepAttrs //this will remove the "localId" property and keep the rest
                  ),
               },
            })
               .then((data) => {
                  setExamCode(data.data.examCode);
                  setIsShownCreateModal(false);
                  setIsShownExamCodeModal(true);
               })
               .catch((err) => {
                  console.log(err);
               });
         }
      }
   }

   async function saveChanges(event) {
      // VALIDATE TITLE FIRST
      //only the title will be validated if the exam is to be saved, NOT created
      //The exam can be saved even if some fields are left unfilled EXCEPT for the title
      let tempErrors = { ...errors };
      tempErrors.title.hasError = formData.title ? false : true;
      tempErrors.time_limit.hasError = formData.time_limit ? false : true;

      if (tempErrors.title.hasError) {
         tempErrors.title.msg =
            "You should at least provide a title before saving the exam.";
      }

      setErrors(tempErrors);
      setHasError(tempErrors.title.hasError || tempErrors.time_limit.hasError);

      if (!tempErrors.title.hasError && !tempErrors.time_limit.hasError) {
         //if exam_id exists, then the user is editing
         //The request method will be PATCH because the values updated may be the whole exam data OR PARTIALLY
         if (exam_id) {
            await axios({
               method: "PATCH",
               baseURL: `http://localhost:5000/exams/${exam_id}`,
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
               data: {
                  isPublishing: false,
                  examData: formData,
                  questions: questions.map(
                     ({ localId, ...keepAttrs }) => keepAttrs //this will remove the "localId" property and keep the rest
                  ),
               },
            })
               .then((data) => {
                  navigate("/");
               })
               .catch((err) => {
                  console.log(err);
               });
         } else {
            //ELSE CREATE THE NEW EXAM
            //saveChanges saves the exam into database even if it is incomplete
            //so that the user can make changes, and post it later on
            await axios({
               method: "POST",
               baseURL: "http://localhost:5000/exams",
               headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
               data: {
                  isPublishing: false,
                  exam: formData,
                  questions: questions.map(
                     ({ localId, ...keepAttrs }) => keepAttrs //this will remove the "localId" property and keep the rest
                  ),
               },
            })
               .then((data) => {
                  navigate("/");
               })
               .catch((err) => {
                  console.log(err);
               });
         }
      }
   }

   function backToDashboard() {
      //checks if there are changes made. If there are changes, show dialog first
      let isTitleEmpty = formData.title ? false : true;
      let isDirEmpty = formData.directions ? false : true;
      let hasNoQuestions = questions.length === 0 ? true : false;
      let isFromDateChanged = initDateVals.date_from !== formData.date_from;
      let isToDateChanged = initDateVals.date_to !== formData.date_to;
      let isLimitChanged = formData.time_limit !== 1;

      //NOTE: dates and time limit will not be checked because they have their default value

      if (
         !isTitleEmpty ||
         !isDirEmpty ||
         !hasNoQuestions ||
         isFromDateChanged ||
         isToDateChanged ||
         isLimitChanged
      )
         setisShownQuestionModal(true);
      else navigate("/");
   }

   function handleQuestionModalClose() {
      setisShownQuestionModal(false);
   }

   function handleExamModalClose() {
      setisShownExamModal(false);
   }

   function handleCreateModalClose() {
      setIsShownCreateModal(false);
   }

   function handleCodeModalClose() {
      setIsShownExamCodeModal(false);
      navigate("/");
   }

   function openDeleteExamModal() {
      setisShownExamModal(true);
   }

   function copyExamCode() {
      // Copies the exam code from the modal to the clipboard
      //code source: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_copy_clipboard2
      var copyText = document.getElementById("exam_code");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);

      var tooltip = document.getElementById("tooltip");
      tooltip.innerHTML = "Copied!";
   }

   function onMouseOutTooltip() {
      var tooltip = document.getElementById("tooltip");
      setTimeout(() => {
         tooltip.innerHTML = "Copy to clipboard";
      }, 300);
   }

   function openCreateConfirmModal(event) {
      event.preventDefault();
      if (validateForm()) {
         setIsShownCreateModal(true);
      }
   }

   async function deleteExam() {
      //delete the exam in db
      await axios({
         method: "DELETE",
         baseURL: `http://www.localhost:5000/exams/${exam_id}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      }).then(() => {
         navigate("/");
      });
   }

   function onFocusExamTitle() {
      //triggers when title input has focus
      setTitleInput("Exam Title");
   }

   function onBlurExamTitle(event) {
      //triggers when title input loses focus
      if (event.target.value === "") setTitleInput("Enter Exam Title...");
   }

   function handleTimeLimitInput(event) {
      //this function prevents user from inputting 0 or negative values
      //if input is below 1, set input value to 1
      const { value } = event.target;
      const absValue = Math.abs(value);

      setFormData((prevVal) => {
         let finalTimeLimit = 1;
         let timeDifference =
            (new Date(formData.date_to).getTime() -
               new Date(formData.date_from).getTime()) /
            60000;

         if (value >= timeDifference || value === "-") {
            //set value of the field to the maximum limit allowed if input is greater than difference
            finalTimeLimit = timeDifference;
         } else {
            finalTimeLimit = !!value && absValue >= 1 ? absValue : "";
         }

         return {
            ...prevVal,
            time_limit: finalTimeLimit,
         };
      });
   }

   function handleTimeLimitType(event) {
      const { value } = event.target;
      //if the value is empty or not an integer, set the value to empty string
      if (!value) {
         setFormData((prevVal) => ({
            ...prevVal,
            time_limit: "",
         }));
      }
   }

   function decrementTimeLimit() {
      timer.current = setInterval(() => {
         return setFormData((prevVal) => {
            if (!formData.time_limit) {
               return {
                  ...prevVal,
                  time_limit: 1,
               };
            } else {
               let newTimeLimit = 1;

               //prevents from decrementing below 0
               //if the current value is 1, set the input value to 1 so that it doesn't reach 0

               //prevVal.time_limit must be converted to number. Its value sometimes becomes a string if the input becomes empty
               //SEE handleTimeLimitInput()
               if (Number(prevVal.time_limit) === 1) {
                  newTimeLimit = 1;
               } else {
                  newTimeLimit = Number(prevVal.time_limit) - 1;
               }

               return {
                  ...prevVal,
                  time_limit: newTimeLimit,
               };
            }
         });
      }, 60); //interval between decrements
   }

   function incrementTimeLimit() {
      timer.current = setInterval(() => {
         //NOTE: prevVal.time_limit must be converted to number. Its value sometimes becomes a string if the input becomes empty
         //SEE handleTimeLimitInput()

         return setFormData((prevVal) => {
            let finalTimeLimit = 1;

            //prevents the time limit (in minutes) from being set higher than the minute difference of date_from and date_to
            if (
               prevVal.time_limit >=
               (new Date(prevVal.date_to).getTime() -
                  new Date(prevVal.date_from).getTime()) /
                  60000
            ) {
               //stop incrementing when the input is higher than the difference of date_from and date_to
               finalTimeLimit = prevVal.time_limit;
            } else {
               //else increment by 1
               finalTimeLimit = Number(prevVal.time_limit) + 1;
            }

            return {
               ...prevVal,
               time_limit: finalTimeLimit,
            };
         });
      }, 60);
   }

   function timeoutClear() {
      clearInterval(timer.current);
   }

   async function getExamData() {
      return await axios({
         method: "GET",
         baseURL: `http://www.localhost:5000/exams/${exam_id}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((res) => {
            let examData = res.data.exam;

            //prevents from editing the exam when the exam is already published
            if (examData.status === "posted" || examData.status === "opened") {
               navigate("/");
            } else {
               setFormData({
                  title: examData.title,
                  date_from: examData.date_from,
                  date_to: examData.date_to,
                  time_limit: examData.time_limit,
                  directions: examData.directions,
               });

               setcharCountTitle(examData.title.length);
               setcharCountDesc(examData.directions.length);
               setQuestions(
                  res.data.questionBank.questions.map((obj) => ({
                     ...obj,
                     localId: createId(),
                  }))
               );

               setTimeout(() => {
                  setIsLoading(false);
               }, 1000);
            }
         })
         .catch((err) => {
            navigate("/");
            console.log(err);
         });
   }

   //the useEffects are used for setting the user context.
   //this fixes the problem where the user context is lost for everytime the page is reloaded
   React.useEffect(() => {
      //if user token does not exist, redirect to login
      if (!localStorage.getItem("token")) {
         navigate("/login");
      } else {
         //if exam_id exists, it means the user is editing an exam, ELSE the user is creating
         if (exam_id) {
            getExamData();
         } else {
            // these dates will be used to compare if the dates have changed
            // from the time this component was mounted
            // (SEE backToDashboard())
            setInitDateVals({
               date_from: formData.date_from,
               date_to: formData.date_to,
            });
            setIsLoading(false);
         }

         const token = localStorage.getItem("token");
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
      }
   }, []);

   React.useEffect(() => {
      //this if block finds the first field that has an error
      //if found, then scroll to that element
      if (hasError) {
         let element = "";
         for (let key in errors) {
            if (errors[key].hasError) {
               element = key;
               break;
            }
         }

         let firstError = document.getElementsByName(element)[0];
         if (firstError) {
            firstError.scrollIntoView({
               behavior: "smooth",
               block: "center",
               inline: "start",
            });
         }
      }
   });

   return (
      <>
         {isLoading ? (
            //will animate as long as the isLoading is not false
            <AnimatePresence>
               {isLoading && (
                  <motion.div
                     initial={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.2 }}
                     className={`${css.createExam_root} d-flex flex-column align-items-center justify-content-center`}>
                     <PuffLoader
                        loading={isLoading}
                        color="#9c2a22"
                        size={80}
                     />
                     <p className="lead mt-3">&nbsp;Loading...</p>
                  </motion.div>
               )}
            </AnimatePresence>
         ) : (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.2 }}>
               <FacultyNavbar username={user ? user.username : ""} />
               {/* show AddQuestion component when adding questions */}
               {isAddingQuestion ? (
                  <AddQuestion
                     setisAddingQuestion={setisAddingQuestion}
                     currentQuestion={currentQuestion}
                     setCurrentQuestion={setCurrentQuestion}
                     setQuestions={setQuestions}
                  />
               ) : (
                  <div className="container">
                     <h1 className="mt-5">
                        {exam_id ? "Edit Exam" : "Create Exam"}
                     </h1>
                     <form onSubmit={openCreateConfirmModal}>
                        {/* TITLE INPUT */}

                        <div className="form-floating mt-4">
                           <input
                              id="titleInput"
                              type="text"
                              name="title"
                              value={formData.title}
                              maxLength={50}
                              className={`${css.title_input} form-control ${
                                 errors.title.hasError ? `border-danger` : ``
                              }`}
                              placeholder="Enter Exam Title..."
                              onChange={handleFormChange}
                              onFocus={onFocusExamTitle}
                              onBlur={onBlurExamTitle}
                           />
                           <small
                              className={`${css.char_counter_title} float-end text-muted`}>
                              {charCountTitle}/50
                           </small>
                           <label
                              htmlFor="titleInput"
                              style={{ color: "gray" }}>
                              {titleInput}
                           </label>
                        </div>
                        {errors.title.hasError && (
                           <small className="text-danger">
                              {errors.title.msg}
                           </small>
                        )}

                        {/* DATE AND TIME INPUT */}
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <h4 className="mt-4">Date of availability</h4>
                           <div className="d-flex flex-column ms-4">
                              <div className="d-flex align-items-center">
                                 <span className={`${css.label} me-2`}>
                                    Available From:
                                 </span>
                                 <div className="d-flex flex-column">
                                    <DateTimePicker
                                       id="date-picker-from"
                                       name="date_from"
                                       className={`${css.date_field} ${
                                          errors.date_from.hasError && "mb-0"
                                       }`}
                                       disablePast="true"
                                       format="MMM dd, yyyy - hh:mm a"
                                       margin="normal"
                                       variant="dialog"
                                       inputVariant="outlined"
                                       emptyLabel="Date"
                                       value={formData.date_from}
                                       onChange={handleFromDateChange}
                                    />
                                    {errors.date_from.hasError && (
                                       <small
                                          className={`text-danger ${css.date_error}`}>
                                          {errors.date_from.msg}
                                       </small>
                                    )}
                                 </div>
                              </div>
                              <div className="d-flex align-items-center">
                                 <span className={`${css.label} me-2`}>
                                    Until:
                                 </span>
                                 <div className="d-flex flex-column">
                                    <DateTimePicker
                                       id="date-picker-to"
                                       name="date_to"
                                       disablePast="true"
                                       className={`${css.date_field} ${
                                          errors.date_to.hasError && "mb-0"
                                       }`}
                                       format="MMM dd, yyyy - hh:mm a"
                                       margin="normal"
                                       variant="dialog"
                                       minDate={formData.date_from}
                                       inputVariant="outlined"
                                       emptyLabel="Date"
                                       value={formData.date_to}
                                       onChange={handleToDateChange}
                                    />
                                    {errors.date_to.hasError && (
                                       <small
                                          className={`text-danger ${css.date_error}`}>
                                          {errors.date_to.msg}
                                       </small>
                                    )}
                                 </div>
                              </div>

                              {/* TIME LIMIT FIELD */}
                              <div className="d-flex align-items-center mt-3">
                                 <div
                                    className={`${css.label} d-flex flex-column me-2`}>
                                    <span className="me-2">
                                       Time Limit (Minutes):{" "}
                                    </span>
                                    <small className="me-2 text-muted">
                                       1 minute minimum
                                    </small>
                                 </div>
                                 <div className="d-flex flex-column ">
                                    <div className="d-flex flex-row ">
                                       <button
                                          type="button"
                                          className={`${css.decrement_btn} btn btn-primary`}
                                          onMouseDown={decrementTimeLimit}
                                          onMouseLeave={timeoutClear}
                                          onMouseUp={timeoutClear}>
                                          -
                                       </button>
                                       {/* TODO: DEBUG ONKEYUP  */}
                                       <input
                                          type="text"
                                          name="time_limit"
                                          value={formData.time_limit}
                                          onChange={handleTimeLimitInput}
                                          onKeyUp={handleTimeLimitType}
                                          className={`${
                                             css.time_limit_input
                                          } mx-1 form-control ${
                                             errors.time_limit.hasError &&
                                             "border-danger"
                                          }`}
                                       />
                                       <button
                                          type="button"
                                          className={`${css.increment_btn} btn btn-primary`}
                                          onMouseDown={incrementTimeLimit}
                                          onMouseLeave={timeoutClear}
                                          onMouseUp={timeoutClear}>
                                          +
                                       </button>
                                    </div>
                                    {errors.time_limit.hasError && (
                                       <small className="text-danger">
                                          {errors.time_limit.msg}
                                       </small>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </MuiPickersUtilsProvider>
                        <br />

                        {/* DIRECTIONS INPUT */}
                        <label
                           htmlFor="directionsTextArea"
                           className="form-label mt-4">
                           Enter your general directions. This will be shown on
                           the topmost part of the exam before the actual
                           questions.
                        </label>
                        <div className="form-floating">
                           <textarea
                              id="directionsTextArea"
                              name="directions"
                              maxLength={1000}
                              className={`${css.gen_directions_textarea} form-control`}
                              placeholder="General Directions"
                              onChange={handleFormChange}
                              defaultValue={formData.directions}
                              style={{ height: "200px" }}></textarea>
                           <small className={`${css.char_counter} float-end`}>
                              {charCountDesc}/1000
                           </small>
                           <label
                              htmlFor="directionsTextArea"
                              style={{ color: "gray" }}>
                              General Directions (optional)
                           </label>
                        </div>

                        {/* QUESTIONS SECTION */}
                        <QuestionList
                           setisAddingQuestion={setisAddingQuestion}
                           removeQuestionError={removeQuestionError}
                           currentQuestion={currentQuestion}
                           setCurrentQuestion={setCurrentQuestion}
                           isError={errors.questions}
                           questions={questions}
                           setQuestions={setQuestions}
                        />

                        {/* SUBMIT BUTTON */}
                        <div className="float-end">
                           <button
                              type="button"
                              onClick={backToDashboard}
                              className="btn btn-secondary mb-5 me-2 px-4 py-2">
                              Exit
                           </button>
                           {/* only show delete button when editing an exam */}
                           {exam_id && (
                              <button
                                 type="button"
                                 onClick={openDeleteExamModal}
                                 className="btn btn-danger mb-5 me-2 px-4 py-2">
                                 Delete Exam
                              </button>
                           )}
                           <button
                              type="button"
                              className="btn btn-primary mb-5 me-2 px-4 py-2"
                              onClick={saveChanges}>
                              Save Changes
                           </button>
                           <button
                              type="submit"
                              className="btn btn-success mb-5 px-4 py-2">
                              Publish
                           </button>
                        </div>
                     </form>
                  </div>
               )}

               {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}

               <Modal
                  show={isShownQuestionModal}
                  onHide={handleQuestionModalClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Discard Changes</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     Changes you made will not be saved once you leave this
                     page.
                  </Modal.Body>
                  <Modal.Footer>
                     <Button
                        variant="secondary"
                        onClick={handleQuestionModalClose}>
                        Cancel
                     </Button>
                     <Button
                        variant="primary"
                        onClick={() => {
                           navigate("/");
                        }}>
                        Continue
                     </Button>
                  </Modal.Footer>
               </Modal>

               {/* modal for deleting exam */}
               <Modal show={isShownExamModal} onHide={handleExamModalClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Delete Exam</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     Are you sure you want to delete this exam? You won't be
                     able to undo this action.
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={handleExamModalClose}>
                        Cancel
                     </Button>
                     <Button variant="primary" onClick={deleteExam}>
                        Continue
                     </Button>
                  </Modal.Footer>
               </Modal>

               {/* modal for create confimation */}
               <Modal show={isShownCreateModal} onHide={handleCreateModalClose}>
                  <Modal.Header closeButton>
                     <Modal.Title>Publish Exam</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     Are you sure you want to publish this exam? You won't be
                     able to make changes once the exam is published.
                  </Modal.Body>
                  <Modal.Footer>
                     <Button
                        variant="secondary"
                        onClick={handleCreateModalClose}>
                        Cancel
                     </Button>
                     <Button variant="primary" onClick={submitForm}>
                        Continue
                     </Button>
                  </Modal.Footer>
               </Modal>

               {/* MODAL FOR EXAM CODE */}
               <Modal
                  show={isShownExamCodeModal}
                  onHide={handleCodeModalClose}
                  size="lg" //size of the modal. can't change in css idk why
                  centered>
                  <Modal.Header className={css.modal_header}>
                     <h5 className="m-0">Exam Code</h5>
                  </Modal.Header>
                  <Modal.Body className={css.modal_body}>
                     <div className={`${css.body_container}`}>
                        <div className={css.tooltip}>
                           <button
                              onClick={copyExamCode}
                              onMouseLeave={onMouseOutTooltip}
                              className={`${css.copy_button}`}>
                              <span className={css.tooltiptext} id="tooltip">
                                 Copy to clipboard
                              </span>
                              <MdContentCopy />
                           </button>
                        </div>
                        <input
                           id="exam_code"
                           type={"text"}
                           value={examCode}
                           className={`${css.exam_code} display-1 text-center`}
                           readOnly
                        />
                     </div>
                  </Modal.Body>
                  <Modal.Footer className={css.footer}>
                     <Button variant="primary" onClick={handleCodeModalClose}>
                        Continue
                     </Button>
                  </Modal.Footer>
               </Modal>
            </motion.div>
         )}
      </>
   );
}
