import React from "react";
import css from "./css/QuestionBankListBox.module.css";
import { useNavigate } from "react-router-dom";
import {
   MdModeEdit,
   MdDelete,
   MdOutlineMoreVert,
   MdContentCopy,
} from "react-icons/md";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function QuestionBankListBox(props) {
   const navigate = useNavigate();
   const questionBankData = props.questionBankData;

   const [isShownModal, setisShownModal] = React.useState(false);
   const [activeDeleteId, setActiveDeleteId] = React.useState(null);

   function openDeleteModal(examId) {
      setisShownModal(true);
      setActiveDeleteId(examId);
   }

   function handleModalClose() {
      setisShownModal(false);
   }

   function goToEditBank() {
      navigate(`/edit-question-bank/${questionBankData._id}`);
   }

   async function deleteQuestionBank() {
      //delete the exam in db
      await axios({
         method: "DELETE",
         baseURL: `http://www.localhost:5000/question-banks/${activeDeleteId}`,
         headers: {
            Authorization: localStorage.getItem("token"),
         },
      })
         .then(() => {
            props.getQuestionBanks(); //getQuestionBanks again to refresh the list
         })
         .catch((err) => {
            console.log(err);
         });

      setActiveDeleteId(null);
      handleModalClose();
   }

   return (
      <>
         <div className={`${css.question_box} card p-4 m-0`}>
            <h4>{questionBankData.title}</h4>
            <p className="text-muted m-0">
               {questionBankData.totalQuestions} Questions
            </p>

            <div className="d-flex flex-row justify-content-end mt-4 mt-auto">
               <MdModeEdit
                  size={"28px"}
                  className={`${css.action_button} me-2`}
                  color="#787878"
                  onClick={goToEditBank}
               />
               <MdDelete
                  className={`${css.action_button}`}
                  size={"28px"}
                  color="#787878"
                  onClick={() => openDeleteModal(questionBankData._id)}
               />
            </div>
         </div>

         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
         <Modal show={isShownModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Delete question bank</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Are you sure you want to delete this Question Bank? You won't be
               able to undo this action.
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleModalClose}>
                  Cancel
               </Button>
               <Button variant="primary" onClick={deleteQuestionBank}>
                  Continue
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}
