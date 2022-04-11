import React from "react";
import css from "./css/ExamQuestionList.module.css";
import { MdWarning } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ExamQuestionList(props) {
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
            {props.questions.map((val, i) => (
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
               <button
                  className="btn btn-primary me-3"
                  onClick={goToAddQuestion}>
                  Add a Question
               </button>
               <button className="btn btn-primary" onClick={goToAddQuestion}>
                  Add Questions from Bank
               </button>
            </div>
         </div>
         <hr />
         {questionList()}

         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
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
