import React from "react";
import css from "./css/QuestionList.module.css";
import { MdWarning } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function QuestionList(props) {
   const navigate = useNavigate();
   const [isShownModal, setisShownModal] = React.useState(false);
   const [isShownBankModal, setIsShownBankModal] = React.useState(false);
   const [questionBankList, setQuestionBankList] = React.useState([]);
   const [addBankError, setAddBankError] = React.useState(false);
   const [activeDeleteId, setActiveDeleteId] = React.useState(null);
   const [lastSelectedBank, setLastSelectedBank] = React.useState();
   const [isEditingBank, setIsEditingBank] = React.useState(false);
   const [questionBankForm, setQuestionBankForm] = React.useState({
      questionBankId: "",
      numOfItems: 1,
   });

   function handleBankFormChange(event) {
      const { name, value } = event.target;

      //if the question bank selection is changed, set the numOfItems field to 1
      if (name === "questionBankId") {
         setQuestionBankForm((prevVal) => ({
            ...prevVal,
            numOfItems: 1,
         }));
      }

      setQuestionBankForm((prevVal) => ({
         ...prevVal,
         [name]: value,
      }));
   }

   function handlePullNumberInput(event) {
      //this function prevents user from inputting 0 or negative values
      //if input is below 1, set input value to 1
      const { value } = event.target;
      const absValue = Math.abs(value);

      setAddBankError(false); //remove error if user types again on this field
      setQuestionBankForm((prevVal) => {
         let finalVal = 1;
         //this is the maximum "numOfItems" input based on the current selected questionBank
         let maxInput = questionBankList.find(
            (value) => value._id === questionBankForm.questionBankId
         ).totalQuestions;

         if (value >= maxInput || value === "-") {
            //set value of the field to the maximum input allowed if input is greater than maxInput
            finalVal = maxInput;
         } else {
            finalVal = !!value && absValue >= 1 ? absValue : "";
         }

         return {
            ...prevVal,
            numOfItems: finalVal,
         };
      });
   }

   function handlePullNumberType(event) {
      const { value } = event.target;
      //if the value is empty or not an integer, set the value to empty string
      if (!value) {
         setQuestionBankForm((prevVal) => ({
            ...prevVal,
            numOfItems: "",
         }));
      }
   }

   function handleModalClose() {
      setisShownModal(false);
   }

   function handleBankModalClose() {
      setIsShownBankModal(false);
      //reset form after modal closes
      setQuestionBankForm({
         questionBankId: questionBankList[0]._id,
         numOfItems: 1,
      });
      setAddBankError(false);
      setIsEditingBank(false);
   }

   function openBankModal() {
      setIsShownBankModal(true);
   }

   function editQuestion(questionData) {
      props.setCurrentQuestion(questionData);
      props.setisAddingQuestion(true);
   }

   function editBank(bankData) {
      setIsEditingBank(true);
      setQuestionBankForm({
         questionBankId: bankData.questionBankId,
         numOfItems: bankData.numOfItems,
      });
      setIsShownBankModal(true);
   }

   function openDeleteModal(questionData) {
      //open modal and set the activeDeleteId to the id of the item to be deleted

      //this step is necessary because we cannot pass data to the modal directly
      //so we put the id into a state, so that the modal will have a reference
      //on what data to be deleted once the "continue" button is clicked
      //the actual deletion happens on deleteQuestion()
      setisShownModal(true);
      if (questionData.isQuestionBank) {
         setActiveDeleteId(questionData.questionBankId);
      } else {
         setActiveDeleteId(questionData.localId);
      }
   }

   function deleteQuestion() {
      props.setQuestions(
         (prevVal) =>
            prevVal.filter((val) => {
               if (val.isQuestionBank) {
                  return val.questionBankId !== activeDeleteId;
               }
               return val.localId !== activeDeleteId;
            }) //use filter to filter out the deleted item
      );
      setActiveDeleteId(null);
      handleModalClose();
   }

   function getTotalQuestions() {
      // returns the text of the total items of the exam
      let questionLength = props.questions.reduce((acc, question) => {
         return question.isQuestionBank ? acc + question.numOfItems : acc + 1;
      }, 0);

      if (questionLength === 1) return "1 Question Total";
      else if (questionLength === 0) return "";
      else return questionLength + " Questions Total";
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
   function getQuestionList() {
      //shows only if questions are empty
      if (props.questions.length === 0) {
         if (!props.isError.hasError) {
            return (
               <div className={`${css.no_questions_container}`}>
                  <p className="text-muted text-center">
                     No questions yet. Click on "Add a Question" button to add a question.
                  </p>
               </div>
            );
         } else {
            return (
               <div className={`${css.no_questions_container2}`} name="questions">
                  <div className={`alert alert-danger ${css.no_questions_alert}`} role="alert">
                     <MdWarning size={"40px"} className="me-2" />
                     You must have at least 1 question. Add a question first to proceed.
                  </div>
               </div>
            );
         }
      }

      //separate the questions and the question banks into 2 different arrays before displaying
      const questionBanks = props.questions.filter((val) => val.isQuestionBank);
      const questions = props.questions.filter((val) => !val.isQuestionBank);

      return (
         <div className={`${css.questions_container} mb-5`}>
            {questionBanks.length > 0 && (
               <div>
                  <h5>Question Banks</h5>
                  {/* map the array in reverse */}
                  {questionBanks
                     .slice(0)
                     .reverse()
                     .map((val, i) => {
                        return (
                           <div
                              className="card p-3 px-4 mb-4 d-flex flex-row justify-content-between"
                              key={i + 1}>
                              <p className="m-0 me-3">
                                 {val.questionBankTitle + " "}
                                 <small className="text-muted ms-2">
                                    ({val.numOfItems}
                                    {val.numOfItems === 1 ? " question" : " questions"})
                                 </small>
                              </p>
                              <div className="">
                                 <span
                                    className={`${css.action_button} me-3`}
                                    onClick={() => editBank(val)}>
                                    <MdEdit className={css.action_icon} />
                                 </span>
                                 <span
                                    className={`${css.action_button} me-0`}
                                    onClick={() => openDeleteModal(val)}>
                                    <MdDelete className={css.action_icon} />
                                 </span>
                              </div>
                           </div>
                        );
                     })}
               </div>
            )}

            {questions.length > 0 && (
               <div>
                  {/* show questions header only if there are question banks */}
                  {questionBanks.length > 0 && <h5>Exam Questions</h5>}
                  {/* map the array in reverse */}
                  {questions
                     .slice(0)
                     .reverse()
                     .map((val, i) => (
                        <div
                           className="card p-3 px-4 mb-4 d-flex flex-row justify-content-between"
                           key={i + 1}>
                           <p className="m-0 me-3 text-truncate w-75">{val.question}</p>
                           <div className="">
                              <span
                                 className={`${css.action_button} me-3`}
                                 onClick={() => editQuestion(val)}>
                                 <MdEdit className={css.action_icon} />
                              </span>
                              <span
                                 className={`${css.action_button} me-0`}
                                 onClick={() => openDeleteModal(val)}>
                                 <MdDelete className={css.action_icon} />
                              </span>
                           </div>
                        </div>
                     ))}
               </div>
            )}
         </div>
      );
   }

   function upsert(array, item) {
      //this function identifies if the item being pushed already exists.
      //if it doesnt exist, push value to array
      //else, update the existing value
      const i = array.findIndex((_item) => {
         if (_item.isQuestionBank) {
            //if the item is a questionBank, compare them by their question bank id
            return _item.questionBankId === item.questionBankId;
         }

         return _item.localId === item.localId;
      });

      if (i > -1) array[i] = item;
      else array.push(item);

      return array;
   }

   function AddQuestionBank() {
      if (!questionBankForm.numOfItems) {
         setAddBankError(true);
         return;
      }

      props.setQuestions((prevVal) => {
         //note: see upsert function
         return upsert(prevVal, {
            questionBankTitle: questionBankList.find((val) => {
               return val._id === questionBankForm.questionBankId;
            }).title, //get the title of the current selected bank
            questionBankId: questionBankForm.questionBankId,
            numOfItems: questionBankForm.numOfItems,
            isQuestionBank: true,
         });
      });

      setIsShownBankModal(false);
   }

   function setBankOptions() {
      return questionBankList.map((bank) => {
         return (
            <option key={bank._id} value={bank._id}>
               {bank.title} ({bank.totalQuestions}
               {bank.totalQuestions === 1 ? " question" : " questions"})
            </option>
         );
      });
   }

   async function getQuestionBanks() {
      //get question banks to be displayed in the options
      await axios({
         method: "GET",
         baseURL: "http://localhost:5000/question-banks",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then((data) => {
            //set only if the user has created at least 1 bank
            if (data.data.questionBanks.length > 0) {
               //pass the array of banks
               setQuestionBankList(data.data.questionBanks);
               setQuestionBankForm((prevVal) => ({
                  ...prevVal,
                  questionBankId: data.data.questionBanks[0]._id,
               }));
            }
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      //false if adding question bank from exam
      if (!props.isFromBank) getQuestionBanks();
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
                  Add Question
               </button>
               {!props.isFromBank && (
                  <button type="button" className="btn btn-primary ms-3" onClick={openBankModal}>
                     Add Questions from Bank
                  </button>
               )}
            </div>
         </div>
         <hr />
         {getQuestionList()}

         {/* MODAL FOR ADD QUESTION BANK */}
         <Modal show={isShownBankModal} onHide={handleBankModalClose} centered>
            <Modal.Header closeButton>
               <Modal.Title>
                  {isEditingBank ? "Edit question bank" : "Add question from question bank"}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {questionBankList.length === 0 ? (
                  <div
                     className={`${css.no_question_banks} d-flex align-items-center justify-content-center`}>
                     <span className="text-muted">
                        No question banks found. Create a question bank first.
                     </span>
                  </div>
               ) : (
                  <div>
                     <div className="mb-3">
                        <label htmlFor="question_bank" className="mb-2  d-block">
                           Select question bank:
                        </label>
                        <select
                           id="question_bank"
                           className="form-select"
                           defaultValue={questionBankForm.questionBankId}
                           onChange={handleBankFormChange}
                           name="questionBankId"
                           disabled={isEditingBank}>
                           <option value="none" disabled hidden>
                              Select an option
                           </option>
                           {setBankOptions()}
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
                              value={questionBankForm.numOfItems}
                              // onChange={handleBankFormChange}
                              onChange={handlePullNumberInput}
                              onKeyUp={handlePullNumberType}
                              className={`form-control ${addBankError && "border-danger"}`}
                              name="numberToPull"
                           />
                        </div>
                        {addBankError && (
                           <small className="text-danger position-absolute">
                              Specify the number of items to pull
                           </small>
                        )}
                     </div>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleBankModalClose}>
                  Close
               </Button>
               {questionBankList.length !== 0 && (
                  <Button variant="primary" onClick={AddQuestionBank}>
                     Add
                  </Button>
               )}
            </Modal.Footer>
         </Modal>

         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
         {/* MODAL FOR DELETE CONFIRMATION */}
         <Modal show={isShownModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Delete Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
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
