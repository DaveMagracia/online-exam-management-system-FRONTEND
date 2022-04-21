import React, { useContext } from "react";
import css from "./css/ExamListBox.module.css";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { UserContext } from "../../UserContext";
import { MdModeEdit, MdDelete, MdOutlineMoreVert, MdContentCopy } from "react-icons/md";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

export default function ExamListBox(props) {
   const navigate = useNavigate();
   const examData = props.examData;
   const { user, setUser } = useContext(UserContext);
   const [isShownModal, setisShownModal] = React.useState(false);
   const [activeDeleteId, setActiveDeleteId] = React.useState(null);
   const [isShownCodeModal, setIsShownCodeModal] = React.useState(false);
   const [examCode, setExamCode] = React.useState("");

   function openDeleteModal(examId) {
      //open modal and set the activeDeleteId to the id of the item to be deleted

      //this step is necessary because we cannot pass data to the modal directly
      //so we put the id into a state, so that the modal will have a reference
      //on what data to be deleted once the "continue" button is clicked
      //the actual deletion happens on deleteQuestion()
      setisShownModal(true);
      setActiveDeleteId(examId);
   }

   function openExamCodeModal(examCode) {
      setExamCode(examCode);
      setIsShownCodeModal(true);
   }

   async function deleteQuestion() {
      //delete the exam in db
      await axios({
         method: "DELETE",
         baseURL: `http://www.localhost:5000/exams/${activeDeleteId}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
      })
         .then(() => {
            props.getExams(); //getExams again to refresh the list
         })
         .catch((err) => {
            console.log(err);
         });

      setActiveDeleteId(null);
      handleModalClose();
   }

   function handleModalClose() {
      setisShownModal(false);
   }

   function handleCodeModalClose() {
      setIsShownCodeModal(false);
   }

   function goToEditExam() {
      navigate(`/edit-exam/${examData._id}`);
   }

   function getExamStatus(status) {
      if (status === "posted") {
         return <span className="badge rounded-pill bg-success">Posted</span>;
      } else if (status === "open") {
         return <span className="badge rounded-pill bg-warning">Open</span>;
      } else if (status === "closed") {
         return <span className="badge rounded-pill bg-danger">Closed</span>;
      } else {
         // return <small className="text-muted">Unposted</small>;
         return <span className="badge rounded-pill bg-secondary">Unposted</span>;
      }
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

   function formatDate(date) {
      date = new Date(date);
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

      var hour12HrFormat = date.getHours() % 12 || 12;
      var minutes = date.getMinutes();

      if (minutes.toString().length === 1) {
         //add 0 to start of number if minutes is a single digit
         minutes = "0" + minutes.toString();
      }

      var ampm = date.getHours() < 12 || date.getHours() === 24 ? "AM" : "PM";

      let formattedDate = `${
         months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()} at ${hour12HrFormat}:${minutes} ${ampm}`;

      return formattedDate;
   }

   function goToExamDetails(examId) {
      navigate(`/exam-details/${examId}`);
   }

   function getItemsAndPoints() {
      let items = examData.totalItems;
      let points = examData.totalPoints === 0 ? 1 : examData.totalPoints;

      items += examData.totalItems === 1 ? " item" : " items";

      if (!examData.isQuestionBankEmpty) {
         //this character will only show if the exam includes a question bank
         //this is because since the questions are randomly pulled on every instance of the exam,
         //there is no way to identify what the total points of the exam will be
         points += "+ points";
      } else {
         points += examData.totalPoints === 1 ? " point" : " points";
      }

      return `${items} ⸱ ${points}`;
   }

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
   }, []);

   return (
      <>
         <div className={`${css.exam_box} card p-4`}>
            <div className="d-flex flex-row justify-content-between">
               <div>
                  {/* exam title is only clickable on student side */}
                  {user && user.userType === "teacher" ? (
                     <h4 className="m-0">{examData.title}</h4>
                  ) : (
                     <h4
                        className={`${css.exam_title} m-0`}
                        onClick={() => goToExamDetails(examData._id)}>
                        {examData.title}
                     </h4>
                  )}
                  <span className="mt-1">{getExamStatus(examData.status)}</span>
               </div>

               {/* show this menu only on faculty side */}
               {user && user.userType === "teacher" && examData.status !== "unposted" && (
                  <>
                     <MdOutlineMoreVert
                        type="button"
                        id="defaultDropdown"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="true"
                        aria-expanded="false"
                        className={`${css.action_button}`}
                        size={"28px"}
                        color="#787878"
                     />
                     <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                        <li
                           className={`${css.action_button} dropdown-item`}
                           onClick={() => goToExamDetails(examData._id)}>
                           Details
                        </li>

                        <li
                           className={`${css.action_button} dropdown-item`}
                           onClick={() => openExamCodeModal(examData.examCode)}>
                           Get exam code
                        </li>
                     </ul>
                  </>
               )}
            </div>

            {examData.status !== "unposted" && (
               <>
                  <small className="m-0 mt-3">Open from: {formatDate(examData.date_from)}</small>
                  <small className="m-0">Until: {formatDate(examData.date_to)}</small>
               </>
            )}

            <p className="mt-4 m-0">
               {examData.totalItems === 0 ? "No questions added" : getItemsAndPoints()}
            </p>

            {/* ACTION BUTTONS */}
            <div className="d-flex flex-row justify-content-end mt-4 mt-auto">
               {/* //show edit button only when exam is not posted/published */}

               {/* ONLY SHOW BUTTONS WHEN USER IS A FACULTY */}
               {user && user.userType === "teacher" && examData.status === "unposted" && (
                  <MdModeEdit
                     size={"28px"}
                     className={`${css.action_button} me-2`}
                     color="#787878"
                     onClick={goToEditExam}
                  />
               )}
               {user && user.userType === "teacher" && examData.status !== "closed" && (
                  <MdDelete
                     className={`${css.action_button}`}
                     size={"28px"}
                     color="#787878"
                     onClick={() => openDeleteModal(examData._id)}
                  />
               )}
            </div>
         </div>

         {/* MODAL FROM REACT-BOOTSTRAP LIBRARY */}
         <Modal show={isShownModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Delete Exam</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               Are you sure you want to delete this exam? You won't be able to undo this action.
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

         {/* modal for exam code */}
         <Modal
            show={isShownCodeModal}
            onHide={handleCodeModalClose}
            size="lg" //size of the modal. can't change in css idk why
            centered>
            <Modal.Header className={css.modal_header} closeButton>
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
               <Button variant="secondary" onClick={handleCodeModalClose}>
                  Close
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}
