import React, { useContext } from "react";
import css from "./css/StudentNavbar.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function StudentNavbar(props) {
   const navigate = useNavigate();

   const { user, setUser } = useContext(UserContext);

   const [isShownExamCodeModal, setIsShownExamCodeModal] =
      React.useState(false);
   const [isRegistering, setIsRegistering] = React.useState(false);

   const [formDataCode, setFormData] = React.useState({
      examCode: "",
   });

   const [generalError, setGenError] = React.useState({
      hasGenError: false,
      msg: "",
   });
   //errors for empty fields; false value means field is not empty
   const [emptyError, setEmptyErrors] = React.useState(false);
   const [invalidError, setErrors] = React.useState(false);

   function UpdateProfile() {
      navigate("/update-profile");
   }

   function ChangePassword() {
      navigate("/change-password");
   }

   function handleCodeModalClose() {
      //reset states on close
      setIsShownExamCodeModal(false);
      setFormData({ examCode: "" });
      setGenError({
         hasGenError: false,
         msg: "",
      });
      setEmptyErrors(false);
      setErrors(false);
   }

   function openCodeModal() {
      //reset states on open just to be sure
      setIsShownExamCodeModal(true);
      setFormData({ examCode: "" });
      setGenError({
         hasGenError: false,
         msg: "",
      });
      setEmptyErrors(false);
      setErrors(false);
   }

   async function logout() {
      await localStorage.removeItem("token");
      await localStorage.removeItem("isLoaded");
      navigate("/");
   }

   function handleOnChange(event) {
      const { name, value } = event.target;

      setEmptyErrors(false); //remove error everytime user changes exam code
      setErrors(false); //remove error everytime user changes exam code

      //set the new value to the formData
      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: value,
         };
      });
   }

   function validateForm() {
      // before validation, check if fields are filled up
      setEmptyErrors(!formDataCode.examCode);

      //if there are no empty fields, proceed to validation
      if (formDataCode.examCode) {
         // let Exam = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

         //validate code
         //matches alphanumeric characters and exactly 10 chars
         //because the code generated on the server follows this pattern
         let codeRegex = /^[a-zA-Z0-9]{10}$/;
         let code = formDataCode.examCode.trim();

         setErrors(!code.match(codeRegex));

         return !!code.match(codeRegex); //get the truthy/falsy value
      }
      return false;
   }

   async function submitCode(event) {
      event.preventDefault();
      if (validateForm()) {
         setGenError((prevVal) => ({
            hasGenError: false,
            msg: "",
         }));
         setIsRegistering(true);
         await axios({
            method: "POST",
            url: "http://localhost:5000/user/exam-code",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: formDataCode,
         })
            .then((data) => {
               setTimeout(() => {
                  setIsRegistering(false);
                  navigate("/");
               }, 2000);
            })
            .catch((err) => {
               setTimeout(() => {
                  //set errors only when modal is shown
                  if (isShownExamCodeModal) {
                     if (err.response.status !== 409)
                        setFormData({ examCode: "" });

                     setGenError({
                        hasGenError: true,
                        msg: err.response.data.msg,
                        status: err.response.status,
                     });
                  }

                  setIsRegistering(false);
               }, 1000);
            });
      }
   }

   function getErrors() {
      if (generalError.hasGenError) {
         if (generalError.status === 200) {
            return (
               <div className="alert alert-success" role="alert">
                  {generalError.msg}
               </div>
            );
         } else if (generalError.status === 409) {
            return (
               <div className="alert alert-warning" role="alert">
                  {generalError.msg}
               </div>
            );
         } else {
            return (
               <div className="alert alert-danger" role="alert">
                  {generalError.msg}
               </div>
            );
         }
      }
   }
   return (
      <>
         <nav
            className={`${css.stud_navbar_root} navbar navbar-expand-lg navbar-light`}>
            <div className="container">
               <a className="navbar-brand" href="/">
                  Online Exam
               </a>

               <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
               </button>

               <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                     <li className="nav-item me-4">
                        <button
                           type="button"
                           className={`${css.code_btn} btn btn-outline-dark`}
                           onClick={openCodeModal}>
                           Enter Exam Code
                        </button>
                     </li>
                     <li className="nav-item me-2">
                        <a
                           className="nav-link active"
                           aria-current="page"
                           href="/dashboard">
                           Dashboard
                        </a>
                     </li>
                     <li className="nav-item me-2">
                        <a className="nav-link" href="/">
                           History
                        </a>
                     </li>
                     {/* my profile dropdown */}
                     <li className="nav-item dropdown">
                        <a
                           className="nav-link dropdown-toggle"
                           href="/"
                           id="navbarDarkDropdownMenuLink"
                           role="button"
                           data-bs-toggle="dropdown"
                           aria-expanded="false">
                           {props.username}&nbsp;
                        </a>
                        <ul
                           className="dropdown-menu"
                           aria-labelledby="navbarDarkDropdownMenuLink">
                           <li
                              className={`${css.nav_link} dropdown-item`}
                              onClick={UpdateProfile}>
                              My Profile
                           </li>
                           <li
                              className={`${css.nav_link} dropdown-item`}
                              onClick={ChangePassword}>
                              Change Password
                           </li>
                           <li
                              className={`${css.nav_link} dropdown-item`}
                              onClick={logout}>
                              Logout
                           </li>
                        </ul>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>

         <Modal show={isShownExamCodeModal} onHide={handleCodeModalClose}>
            <Modal.Header closeButton>
               <Modal.Title>Register Exam</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mt-3">
               <form onSubmit={submitCode}>
                  {getErrors()}

                  {/* EXAM CODE INPUT */}
                  <div className="form-floating">
                     <input
                        id="InputExamCode"
                        type="text"
                        className={`form-control ${
                           invalidError || emptyError
                              ? "border border-danger"
                              : "mb-4"
                        }`}
                        name="examCode"
                        placeholder="Enter exam code"
                        onChange={handleOnChange}
                        value={formDataCode.examCode}
                     />
                     <label htmlFor="InputExamCode">Enter exam code</label>
                  </div>

                  {/* FIELD ERRORS */}
                  {invalidError && (
                     <small className="text-danger mb-4">Invalid Code</small>
                  )}
                  {emptyError && (
                     <small className="text-danger mb-4">
                        This field is required
                     </small>
                  )}
               </form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCodeModalClose}>
                  Cancel
               </Button>
               <Button
                  type="Submit"
                  variant="primary"
                  onClick={submitCode}
                  disabled={isRegistering}>
                  {isRegistering ? (
                     <div>
                        <span
                           className="spinner-border spinner-border-sm me-2"
                           role="status"
                           aria-hidden="true"></span>
                        <span>Registering...</span>
                     </div>
                  ) : (
                     "Join"
                  )}
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
}
