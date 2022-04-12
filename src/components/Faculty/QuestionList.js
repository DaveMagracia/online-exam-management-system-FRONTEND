import React from "react";
import css from "./css/QuestionList.module.css";
import { MdWarning } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function QuestionList(props) {
   const navigate = useNavigate();
   const [isShownModal, setisShownModal] = React.useState(false);
   const [activeDeleteId, setActiveDeleteId] = React.useState(null);

   function handleModalClose() {
      setisShownModal(false);
   }

   function editQuestion(questionData) {
      props.setCurrentQuestion(questionData);
      props.setisAddingQuestion(true);
   }

   function openDeleteModal(questionData) {
      //open modal and set the activeDeleteId to the id of the item to be deleted

      //this step is necessary because we cannot pass data to the modal directly
      //so we put the id into a state, so that the modal will have a reference
      //on what data to be deleted once the "continue" button is clicked
      //the actual deletion happens on deleteQuestion()
      setisShownModal(true);
      setActiveDeleteId(questionData.localId);
   }

   function deleteQuestion() {
      props.setQuestions(
         (prevVal) => prevVal.filter((val) => val.localId !== activeDeleteId) //use filter to filter out the deleted item
      );
      setActiveDeleteId(null);
      handleModalClose();
   }

   function getTotalQuestions() {
      // returns the text of the total questions and points of the exam
      let questionLength = props.questions.length;

      if (questionLength === 1) {
         return "1 Question";
      } else if (questionLength === 0) {
         return "";
      } else {
         return questionLength + " Questions";
      }
   }

   function goToAddQuestion() {
      props.removeQuestionError();
      props.setCurrentQuestion();
      props.setisAddingQuestion(true);
   }

   function goToAddQuestionBank() {
      props.removeQuestionError();
   }

   //will contain the elements based on the "questions" state from CreateExam component
   function questionList() {
      //shows only if questions are empty
      if (props.questions.length === 0) {
         if (!props.isError.hasError) {
            return (
               <div className={`${css.no_questions_container}`}>
                  <p className="text-muted text-center">
                     No questions yet. Click on "Add a Question" button to add a
                     question.
                  </p>
               </div>
            );
         } else {
            return (
               <div
                  className={`${css.no_questions_container2}`}
                  name="questions">
                  <div
                     className={`alert alert-danger ${css.no_questions_alert}`}
                     role="alert">
                     <MdWarning size={"40px"} className="me-2" />
                     You must have at least 1 question. Add a question first to
                     proceed.
                  </div>
               </div>
            );
         }
      }
      return (
         <div className={`${css.questions_container}`}>
            {/* map the array in reverse */}
            {props.questions
               .slice(0)
               .reverse()
               .map((val, i) => (
                  <div
                     className="card p-4 mb-4 d-flex flex-row justify-content-between"
                     key={i + 1}>
                     <p className="m-0 me-3">{val.question}</p>
                     <div className="">
                        <span
                           className={`${css.action_button} me-4`}
                           onClick={() => editQuestion(val)}>
                           Edit
                        </span>
                        <span
                           className={`${css.action_button} me-0`}
                           onClick={() => openDeleteModal(val)}>
                           Delete
                        </span>
                     </div>
                  </div>
               ))}
         </div>
      );
   }

   return (
      <>
         <div className="mt-5 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
               <h4 className="me-3 m-0">Questions</h4>
               <span className="text-muted m-0">{getTotalQuestions()}</span>
            </div>
            <div>
               <button className="btn btn-primary" onClick={goToAddQuestion}>
                  Add a Question
               </button>
               {!props.isFromBank && (
                  <button
                     type="button"
                     className="btn btn-primary ms-3"
                     data-bs-toggle="modal"
                     data-bs-target="#addQuestionBankModal"
                     data-bs-whatever="@mdo">
                     Add Questions from Bank
                  </button>
               )}
            </div>
         </div>
         <hr />
         {questionList()}

         {/* MODAL FOR ADD QUESTION BANK */}
         <div
            className="modal fade"
            id="addQuestionBankModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content">
                  <div className="modal-header">
                     <h5 className="modal-title" id="exampleModalLabel">
                        Add question from question bank
                     </h5>
                     <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                     <div className="mb-3">
                        <label
                           htmlFor="question_bank"
                           className="mb-2  d-block">
                           Correct Answer:
                        </label>
                        <select
                           id="question_bank"
                           className="form-select"
                           value={1}
                           name="bank">
                           <option value="none" disabled hidden>
                              Select an option
                           </option>
                           <option value={1}>Choice 1</option>
                           <option value={2}>Choice 2</option>
                           <option value={3}>Choice 3</option>
                           <option value={4}>Choice 4</option>
                        </select>
                     </div>
                     <div className="mb-3">
                        <label
                           htmlFor="number_field"
                           className="mb-2 mt-3 d-block">
                           Number of questions to pull:
                        </label>
                        <div className="input-group">
                           <input
                              id="number_field"
                              type="text"
                              className="form-control"
                              name="points"
                              // value={formData.points}
                              // onChange={handleTimeLimitInput}
                           />
                        </div>
                     </div>
                  </div>
                  <div className="modal-footer">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal">
                        Close
                     </button>
                     <button type="button" className="btn btn-primary">
                        Add
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
         {/* MODAL FOR DELETE CONFIRMATION */}
         <Modal show={isShownModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Delete Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Are you sure you want to delete this question?
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleModalClose}>
                  Cancel
               </Button>
               <Button variant="primary" onClick={deleteQuestion}>
                  Continue
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}
