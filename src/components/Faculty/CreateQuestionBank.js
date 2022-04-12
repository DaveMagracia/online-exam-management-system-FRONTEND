import React, { useContext } from "react";
import css from "./css/CreateQuestionBank.module.css";
import FacultyNavbar from "./FacultyNavbar";
import AddQuestion from "./AddQuestion";
import QuestionList from "./QuestionList";
import axios from "axios";

import { Modal, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../UserContext";
import PuffLoader from "react-spinners/PuffLoader";
import { motion, AnimatePresence } from "framer-motion";
import { v1 as createId } from "uuid";

export default function CreateQuestionBank(props) {
   const navigate = useNavigate();

   const { bank_id } = useParams();
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setIsLoading] = React.useState(true);
   const [isAddingQuestion, setisAddingQuestion] = React.useState(false);
   const [isShownDeleteModal, setIsShownDeleteModal] = React.useState(false);
   const [isShownQuestionModal, setisShownQuestionModal] =
      React.useState(false);
   const [titleInput, setTitleInput] = React.useState(
      bank_id ? "Bank Title" : "Enter Bank Title..."
   );
   const [charCountTitle, setcharCountTitle] = React.useState(0);
   const [hasError, setHasError] = React.useState(false);
   const [currentQuestion, setCurrentQuestion] = React.useState();
   const [questions, setQuestions] = React.useState([]); //initially, questions are empty
   const [formData, setFormData] = React.useState({
      title: "",
   });

   const [errors, setErrors] = React.useState({
      title: { hasError: false, msg: "This field is required." },
      questions: {
         hasError: false,
         msg: "Bank must have at least 1 question.",
      },
   });

   function goToAddQuestion() {
      setisAddingQuestion(true);
   }

   function openDeleteModal() {
      setIsShownDeleteModal(true);
   }

   function handleDeleteModalClose() {
      setIsShownDeleteModal(false);
   }

   function validateForm() {
      let tempErrors = { ...errors };
      tempErrors.title.hasError = formData.title ? false : true;
      tempErrors.questions.hasError = questions.length === 0 ? true : false;

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

   async function submitForm(event) {
      event.preventDefault();

      if (validateForm()) {
         if (bank_id) {
            //UPDATE BANK
            await axios({
               method: "PATCH",
               baseURL: `http://localhost:5000/question-banks/${bank_id}`,
               headers: {
                  Authorization: localStorage.getItem("token"),
               },
               data: {
                  formData: formData,
                  questions: questions,
               },
            })
               .then((data) => {
                  navigate("/");
               })
               .catch((err) => {
                  console.log(err);
               });
         } else {
            await axios({
               method: "POST",
               baseURL: "http://www.localhost:5000/question-banks",
               headers: {
                  Authorization: localStorage.getItem("token"),
               },
               data: {
                  formData: formData,
                  questions: questions,
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
      }

      setFormData((prevVal) => ({
         ...prevVal,
         [name]: value,
      }));
   }

   function onBlurExamTitle(event) {
      //triggers when title input loses focus
      if (event.target.value === "") setTitleInput("Enter Bank Title...");
   }

   function onFocusExamTitle() {
      //triggers when title input has focus
      setTitleInput("Bank Title");
   }

   function backToDashboard() {
      //checks if there are changes made. If there are changes, show dialog first
      let isTitleEmpty = formData.title ? false : true;
      let hasNoQuestions = questions.length === 0 ? true : false;

      if (!isTitleEmpty || !hasNoQuestions) setisShownQuestionModal(true);
      else navigate("/");
   }

   function handleQuestionModalClose() {
      setisShownQuestionModal(false);
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

   async function deleteQuestionBank() {
      //delete the exam in db
      await axios({
         method: "DELETE",
         baseURL: `http://www.localhost:5000/question-banks/${bank_id}`,
         headers: {
            Authorization: localStorage.getItem("token"),
         },
      })
         .then(() => {
            navigate("/");
         })
         .catch((err) => {
            console.log(err);
         });
   }

   async function getQuestionBankData() {
      return await axios({
         method: "GET",
         baseURL: `http://www.localhost:5000/question-banks/${bank_id}`,
         headers: {
            Authorization: localStorage.getItem("token"),
         },
      })
         .then((res) => {
            let bankData = res.data.questionBank;

            setFormData({
               title: bankData.title,
            });
            setcharCountTitle(bankData.title.length);
            setQuestions(
               res.data.questionBank.questions.map((obj) => ({
                  ...obj,
                  localId: createId(), //add local id
               }))
            );
            setTimeout(() => {
               setIsLoading(false);
            }, 1000);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      if (bank_id) {
         getQuestionBankData();
      } else {
         setIsLoading(false);
      }

      //if userData is already on local storage, then there is no need to fetch user data from server
      const userData = localStorage.getItem("userData");
      if (userData) setUser(JSON.parse(userData));
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

      localStorage.setItem("userData", JSON.stringify(user));
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
                     className={`${css.createBank_loading} d-flex flex-column align-items-center justify-content-center`}>
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
                        {bank_id
                           ? "Edit Question Bank"
                           : "Create Question Bank"}
                     </h1>
                     <form onSubmit={submitForm}>
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

                        <QuestionList
                           setisAddingQuestion={setisAddingQuestion}
                           removeQuestionError={removeQuestionError}
                           currentQuestion={currentQuestion}
                           isFromBank={true}
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

                           {bank_id && (
                              <button
                                 type="button"
                                 className="btn btn-danger mb-5 me-2 px-4 py-2"
                                 data-bs-toggle="modal"
                                 onClick={openDeleteModal}>
                                 Delete
                              </button>
                           )}

                           <button
                              type="submit"
                              className="btn btn-primary mb-5 px-4 py-2">
                              Save
                           </button>
                        </div>
                     </form>
                  </div>
               )}
            </motion.div>
         )}

         {/* MODAL FOR DELETE CONFIRMATION */}
         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
         <Modal show={isShownDeleteModal} onHide={handleDeleteModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Delete question bank</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Are you sure you want to delete this Question Bank? You won't be
               able to undo this action.
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleDeleteModalClose}>
                  Cancel
               </Button>
               <Button variant="primary" onClick={deleteQuestionBank}>
                  Continue
               </Button>
            </Modal.Footer>
         </Modal>

         <Modal show={isShownQuestionModal} onHide={handleQuestionModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Discard Changes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Changes you made will not be saved once you leave this page.
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleQuestionModalClose}>
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
      </>
   );
}
