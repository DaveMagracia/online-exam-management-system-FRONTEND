import React from "react";
import css from "./css/QuestionList.module.css";
import { MdWarning } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function QuestionList(props) {
   const navigate = useNavigate();
   const [isShownModal, setisShownModal] = React.useState(false);
   const [isShownBankModal, setIsShownBankModal] = React.useState(false);
   const [questionBankList, setQuestionBankList] = React.useState(false);
   const [activeDeleteId, setActiveDeleteId] = React.useState(null);

   function handleModalClose() {
      setisShownModal(false);
   }
   function handleBankModalClose() {
      setIsShownBankModal(false);
   }

   function openBankModal() {
      setIsShownBankModal(true);
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

   function setBankOptions() {
      return questionBankList.map((bank) => {
         return (
            <option>
               {bank.title} ({bank.totalQuestions}
               {bank.totalQuestions === 1 ? " question" : " questions"})
            </option>
         );
      });
   }

   async function getQuestionBanks() {
      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/question-banks",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {
            //pass the array of banks
            setQuestionBankList(data.data.questionBanks);
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      getQuestionBanks();
   }, []);

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
                     onClick={openBankModal}>
                     Add Questions from Bank
                  </button>
               )}
            </div>
         </div>
         <hr />
         {questionList()}

         {/* MODAL FOR ADD QUESTION BANK */}
         <Modal show={isShownBankModal} onHide={handleBankModalClose} centered>
            <Modal.Header closeButton>
               <Modal.Title>Add question from question bank</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="mb-3">
                  <label htmlFor="question_bank" className="mb-2  d-block">
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
                     {/* {setBankOptions()} */}
                  </select>
               </div>
               <div className="mb-3">
                  <label htmlFor="number_field" className="mb-2 mt-3 d-block">
                     Number of questions to pull:
                  </label>
                  <div className="input-group">
                     <input
                        id="number_field"
                        type="text"
                        className="form-control"
                        name="points"
                     />
                  </div>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleModalClose}>
                  Close
               </Button>
               <Button variant="primary" onClick={deleteQuestion}>
                  Add
               </Button>
            </Modal.Footer>
         </Modal>

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
