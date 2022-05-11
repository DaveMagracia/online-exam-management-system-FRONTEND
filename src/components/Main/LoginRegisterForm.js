import React from "react";
import css from "./css/LoginRegisterForm.module.css";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MdWarning } from "react-icons/md";
import PuffLoader from "react-spinners/PuffLoader";
import { FaExclamation, FaCheck, FaCircle } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";
// import LoginRegisterBG from "/images/res/login_register_bg.jpg";

export default function LoginRegisterForm() {
   const { state } = useLocation();
   const { name } = state;
   const [isContainerActive, setIsContainerActive] = React.useState(name !== "login");
   let navigate = useNavigate();

   //REGISTER STATES
   const [loading, setLoading] = React.useState(false);

   // initialize state default values (for FORM FIELDS)
   const [formDataRegister, setFormDataRegister] = React.useState({
      fullname: "",
      email: "",
      username: "",
      pass: "",
      cpass: "",
      userType: "none",
      // checked: false,
   });

   //general error; shown on top of the form
   const [generalError, setGenError] = React.useState({
      hasGenError: false,
      msg: "",
   });

   const [isInit, setIsInit] = React.useState(true);
   const [isInit1, setIsInit1] = React.useState(true);
   const [isInit2, setIsInit2] = React.useState(true);
   const [isInit3, setIsInit3] = React.useState(true);
   const [isInit4, setIsInit4] = React.useState(true);
   const [good, setnotgood] = React.useState(true);
   const [good1, setnotgood1] = React.useState(true);
   const [good2, setnotgood2] = React.useState(true);
   const [good3, setnotgood3] = React.useState(true);
   const [good4, setnotgood4] = React.useState(true);
   const [isFocused, setFocus] = React.useState(false);

   //errors for validation; false value means no error
   const [errorsRegister, setErrorsRegister] = React.useState({
      fullname: { hasError: false, msg: "Invalid Name" },
      email: { hasError: false, msg: "Invalid Email" },
      username: { hasError: false, msg: "Invalid Username" },
      pass: { hasError: false, msg: "Invalid Password" },
      cpass: { hasError: false, msg: "Passwords do not match" },
      userType: { hasError: false, msg: "Please select an option" },
      // checked: {
      //    hasError: false,
      //    msg: "You must agree to our Terms and Conditions",
      // },
   });

   // errors for empty fields; false value means field is not empty
   const [emptyErrorsRegister, setEmptyErrorsRegister] = React.useState({
      fullname: false,
      email: false,
      username: false,
      pass: false,
      cpass: false,
      userType: false,
   });

   // --------------------------- REGISTER FUNCTIONS ---------------------------

   //handles onchange on form fields
   function handleOnChangeRegister(event) {
      const { name, value, type, checked } = event.target;
      //removes error to TAC checkbox if the checkbox is clicked
      if (name === "checked") {
         setErrorsRegister((prevValue) => ({
            ...prevValue,
            checked: {
               hasError: false,
               msg: "You must agree to our Terms and Conditions",
            },
         }));
      }

      //remove error to the field that was changed
      setEmptyErrorsRegister((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      //set the new value to the formData
      setFormDataRegister((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   // validates fields; returns true if form is valid, else returns false
   function validateFormRegister() {
      // before validation, check if fields are filled up
      let tempEmptyErrors = { ...emptyErrorsRegister };

      //NOTE: in JS, if formData.email has a value, it is considered true
      tempEmptyErrors.fullname = formDataRegister.fullname ? false : true;
      tempEmptyErrors.email = formDataRegister.email ? false : true;
      tempEmptyErrors.username = formDataRegister.username ? false : true;
      tempEmptyErrors.pass = formDataRegister.pass ? false : true;
      tempEmptyErrors.cpass = formDataRegister.cpass ? false : true;
      tempEmptyErrors.userType = formDataRegister.userType !== "none" ? false : true;

      if (!tempEmptyErrors.pass && !tempEmptyErrors.cpass) {
         let tempErrors = { ...errorsRegister };
         let password = formDataRegister.pass.trim();
         let cpassword = formDataRegister.cpass.trim();
         tempErrors.cpass.hasError = password !== cpassword;
         setErrorsRegister(tempErrors);
      }

      setEmptyErrorsRegister(tempEmptyErrors);

      // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
      var hasEmptyFields = Object.keys(tempEmptyErrors).some((k) => tempEmptyErrors[k] === true);

      //if there are no empty fields, proceed to validation
      if (!hasEmptyFields) {
         //temp errors
         //Use spread operator. Simply assigning the errors to tempError without spread doesn't assign the object as a value
         let tempErrors = { ...errorsRegister };

         //validate inputs
         let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
         let email = formDataRegister.email.trim();
         tempErrors.email.hasError = !email.match(emailRegex);

         let usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
         let username = formDataRegister.username.trim();
         tempErrors.username.hasError = !username.match(usernameRegex);

         let passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
         let password = formDataRegister.pass.trim();
         let cpassword = formDataRegister.cpass.trim();

         tempErrors.pass.hasError = !password.match(passRegex);
         tempErrors.cpass.hasError = password !== cpassword;
         tempErrors.userType.hasError = formDataRegister.userType === "none";

         // set the tempErrors to the "errors" state
         setErrorsRegister(tempErrors);

         //the return statements will return a boolean. If true, it means the form inputs are valid, invalid otherwise
         //if there are no errors in the tempErrors, return true
         return !Object.keys(tempErrors).some((k) => tempErrors[k].hasError === true);
      }
      return false;
   }

   function handleOnChangePassword(event) {
      const { name, value, type, checked } = event.target;
      setEmptyErrorsRegister((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      const is_length = /^.{8,35}$/.test(value);
      if (!is_length) {
         setnotgood(true);
      } else {
         setnotgood(false);
      }

      if (isInit && is_length) {
         setIsInit(false);
      }

      const is_Upper = /(?=.*[A-Z])/.test(value);
      if (!is_Upper) {
         setnotgood1(true);
      } else {
         setnotgood1(false);
      }

      if (isInit1 && is_Upper) {
         setIsInit1(false);
      }

      const is_lower = /(?=.*[a-z])/.test(value);
      if (!is_lower) {
         setnotgood2(true);
      } else {
         setnotgood2(false);
      }

      if (isInit2 && is_lower) {
         setIsInit2(false);
      }

      const is_upper = /(?=.*[0-9])/.test(value);
      if (!is_upper) {
         setnotgood3(true);
      } else {
         setnotgood3(false);
      }

      if (isInit3 && is_upper) {
         setIsInit3(false);
      }

      const is_Special = /(?=.*[!@#$%^&*])/.test(value);
      if (!is_Special) {
         setnotgood4(true);
      } else {
         setnotgood4(false);
      }

      if (isInit4 && is_Special) {
         setIsInit4(false);
      }

      if (value === "") {
         setnotgood(true);
         setnotgood1(true);
         setnotgood2(true);
         setnotgood3(true);
         setnotgood4(true);
      }

      setFormDataRegister((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   function onFocusPassword(event) {
      setFocus(true);
   }

   function onBlurPassword(event) {
      setFocus(false);
   }

   //makes the call to the api, and send a post request for the server to process and write to DB
   async function registerUser(event) {
      event.preventDefault();
      if (validateFormRegister()) {
         //SEND POST REQUEST TO API, THEN WRITE TO DB
         setLoading(true);
         //crud
         //c - post
         //r - get
         //u - put/patch
         //d - delete
         await axios({
            method: "POST",
            url: "http://www.localhost:5000/user/register",
            data: formDataRegister,
         })
            .then((data) => {
               //in this then, redirect user to login page
               setTimeout(() => {
                  setLoading(false);
                  setIsContainerActive(false);
                  //RESET REGISTER FORM
                  setEmptyErrorsRegister({
                     fullname: false,
                     email: false,
                     username: false,
                     pass: false,
                     cpass: false,
                     userType: false,
                  });

                  setFormDataRegister({
                     fullname: "",
                     email: "",
                     username: "",
                     pass: "",
                     cpass: "",
                     userType: "none",
                  });

                  setGenError({
                     hasGenError: false,
                     msg: "",
                  });
                  setErrorsRegister({
                     fullname: { hasError: false, msg: "Invalid Name" },
                     email: { hasError: false, msg: "Invalid Email" },
                     username: { hasError: false, msg: "Invalid Username" },
                     pass: { hasError: false, msg: "Invalid Password" },
                     cpass: { hasError: false, msg: "Passwords do not match" },
                     userType: { hasError: false, msg: "Please select an option" },
                  });
                  setIsInit(true);
                  setIsInit1(true);
                  setIsInit2(true);
                  setIsInit3(true);
                  setIsInit4(true);
                  setnotgood(true);
                  setnotgood1(true);
                  setnotgood2(true);
                  setnotgood3(true);
                  setnotgood4(true);
                  setFocus(false);
               }, 3000);
            })
            .catch((err) => {
               setTimeout(() => {
                  setLoading(false);
                  console.log(err.response);
                  setGenError({
                     hasGenError: true,
                     msg: err.response.data.msg,
                  });
               }, 2000);
            });
      }
   }

   React.useEffect(() => {
      //if user accesses this page while logged in, log the user out
      localStorage.removeItem("token");
      localStorage.removeItem("isLoaded");
      localStorage.removeItem("isSidebarOpen");
   });

   // ------------------------------------ LOGIN STATES------------------------------------
   //form state
   const [formDataLogin, setFormDataLogin] = React.useState({
      email_username: "",
      pass: "",
   });

   const [loginError, setLoginError] = React.useState({
      hasError: false,
      errorMsg: "",
   });

   //errors for empty fields; false value means field is not empty
   const [emptyErrorsLogin, setEmptyErrorsLogin] = React.useState({
      email_username: false,
      pass: false,
   });

   // --------------------------- LOGIN FUNCTIONS ---------------------------
   function handleOnChangeLogin(event) {
      const { name, value, type, checked } = event.target;
      //remove error to the field that was changed
      setEmptyErrorsLogin((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      //set the new value to the formData
      setFormDataLogin((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   function validateFormLogin() {
      let tempEmptyErrors = { ...emptyErrorsLogin };

      tempEmptyErrors.email_username = formDataLogin.email_username ? false : true;
      tempEmptyErrors.pass = formDataLogin.pass ? false : true;

      setEmptyErrorsLogin(tempEmptyErrors);

      // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
      var hasEmptyFields = Object.keys(tempEmptyErrors).some((k) => tempEmptyErrors[k] === true);

      return !hasEmptyFields;
   }

   React.useEffect(() => {
      //if user tries to access this page while logged in, navigate to dashboard
      const token = localStorage.getItem("token");
      if (token) navigate("/dashboard");
   });

   async function loginUser(event) {
      event.preventDefault();
      if (validateFormLogin()) {
         //SEND REQUEST, THEN CHECK IF USER EXISTS IN DB
         await axios({
            method: "POST",
            url: "http://localhost:5000/user/login",
            data: formDataLogin,
         })
            //in this then, redirect user to main page
            .then((data) => {
               if (data.data.user) {
                  localStorage.setItem("token", data.data.user); //put the token in local storage
                  navigate("/dashboard");
               }
            })
            .catch((err) => {
               setLoginError({
                  hasError: true,
                  errorMsg: err.response.data.msg,
               });
            });
      }
   }

   function goToSignUp() {
      setIsContainerActive(true);
      setEmptyErrorsRegister((prevValue) => ({
         fullname: false,
         email: false,
         username: false,
         pass: false,
         cpass: false,
         userType: false,
      }));

      setFormDataRegister({
         fullname: "",
         email: "",
         username: "",
         pass: "",
         cpass: "",
         userType: "none",
      });
   }

   function goToSignIn() {
      setIsContainerActive(false);
      //remove all errors from login when going to register
      setEmptyErrorsLogin((prevValue) => ({
         email_username: false,
         pass: false,
      }));

      setFormDataLogin({
         email_username: "",
         pass: "",
      });
      setnotgood(true);
      setnotgood1(true);
      setnotgood2(true);
      setnotgood3(true);
      setnotgood4(true);
      setFocus(false);
      setIsInit(true);
      setIsInit1(true);
      setIsInit2(true);
      setIsInit3(true);
      setIsInit4(true);
   }

   return (
      <>
         {/* <Navbar /> */}
         );
         <div className={css.LoginTest_container}>
            <div
               className={`${css.container} ${isContainerActive && css.right_panel_active}`}
               id="container">
               <motion.span
                  initial={{
                     color: isContainerActive ? "#363636" : "#ffffff",
                  }}
                  animate={{
                     color: isContainerActive ? "#ffffff" : "#363636",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={css.back_btn}
                  onClick={() => navigate("/")}>
                  <IoMdArrowRoundBack className={css.back_icon} />
                  Home
               </motion.span>

               {/* REGISTER */}
               <div className={`${css.form_container} ${css.sign_up_container}`}>
                  <form action="#" className={css.formRegister} onSubmit={registerUser}>
                     <h1 className={`${css.header} mb-4`}>Create Account</h1>
                     {generalError.hasGenError && (
                        <div
                           className={`${css.error_alert} alert alert-danger text-start`}
                           role="alert">
                           <MdWarning size={20} className="me-3" />
                           {generalError.msg}
                        </div>
                     )}

                     <div className="form-floating">
                        <input
                           id="Inputfullname"
                           type="text"
                           className={`form-control ${css.fields} ${
                              errorsRegister.fullname.hasError || emptyErrorsRegister.fullname
                                 ? "border border-danger"
                                 : "mb-4"
                           }`}
                           // placeholder="Full Name"
                           name="fullname"
                           onChange={handleOnChangeRegister}
                           value={formDataRegister.fullname}
                        />
                        <label htmlFor="Inputfullname">Full Name *</label>
                     </div>
                     {errorsRegister.fullname.hasError && (
                        <p className={`${css.error_text} text-danger mb-4 text-start small`}>
                           {errorsRegister.fullname.msg}
                        </p>
                     )}
                     {emptyErrorsRegister.fullname && (
                        <p className={`${css.error_text} text-danger mb-4 text-start small`}>
                           This field is required
                        </p>
                     )}
                     <div className="form-floating">
                        <input
                           id="InputEmail"
                           type="text"
                           className={`form-control ${css.fields} ${
                              errorsRegister.email.hasError || emptyErrorsRegister.email
                                 ? "border border-danger"
                                 : "mb-4"
                           }`}
                           name="email"
                           onChange={handleOnChangeRegister}
                           value={formDataRegister.email}
                        />
                        <label htmlFor="InputEmail">Email address *</label>
                     </div>
                     {errorsRegister.email.hasError && (
                        <p className={`${css.error_text} text-danger mb-4 text-start small`}>
                           {errorsRegister.email.msg}
                        </p>
                     )}

                     {emptyErrorsRegister.email && (
                        <p className={`${css.error_text} text-danger mb-4 text-start small`}>
                           This field is required
                        </p>
                     )}

                     <div className="form-floating">
                        <input
                           id="InputUsername"
                           // placeholder="Username"
                           type="text"
                           className={`form-control ${css.fields} ${
                              errorsRegister.username.hasError || emptyErrorsRegister.username
                                 ? "border border-danger"
                                 : "mb-4"
                           }`}
                           name="username"
                           onChange={handleOnChangeRegister}
                           value={formDataRegister.username}
                        />
                        <label htmlFor="InputUsername">Username *</label>
                     </div>
                     {emptyErrorsRegister.username && (
                        <p className="text-danger mb-4 small">This field is required</p>
                     )}
                     {errorsRegister.username.hasError && (
                        <p className="text-danger mb-4 small">{errorsRegister.username.msg}</p>
                     )}

                     <div className="form-floating">
                        <input
                           id="InputPassword"
                           type="password"
                           // placeholder="Password"
                           className={`form-control ${css.fields} ${
                              (errorsRegister.pass.hasError || emptyErrorsRegister.pass) &&
                              "border border-danger"
                           }`}
                           name="pass"
                           onChange={handleOnChangePassword}
                           onFocus={onFocusPassword}
                           onBlur={onBlurPassword}
                           value={formDataRegister.pass}
                        />
                        <label htmlFor="InputPassword">Password *</label>
                     </div>

                     {emptyErrorsRegister.pass && (
                        <p className="text-danger m-0 small">This field is required</p>
                     )}

                     <motion.div
                        initial={{ height: "0px", opacity: 0 }}
                        animate={{
                           height: isFocused ? "130px" : "0px",
                           opacity: isFocused ? 1 : 0,
                        }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        className={`form-text ${
                           errorsRegister.pass.hasError ? "text-danger" : "text-muted"
                        }`}>
                        <span className={`d-block mb-2 ${css.password_rules}`}>
                           A password must:
                        </span>
                        <div className="d-flex ps-2">
                           <div className="d-flex flex-column" style={{ width: "30px" }}>
                              <span
                                 className={`d-block ${
                                    good
                                       ? isInit
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 {/* show bullet only when initially loaded */}
                                 {!isInit ? (
                                    <>{good ? <FaExclamation /> : <FaCheck />}</>
                                 ) : (
                                    <FaCircle size={"6px"} />
                                 )}
                              </span>
                              <span
                                 className={`d-block ${
                                    good1
                                       ? isInit1
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 {!isInit1 ? (
                                    <>{good1 ? <FaExclamation /> : <FaCheck />}</>
                                 ) : (
                                    <FaCircle size={"6px"} />
                                 )}
                              </span>
                              <span
                                 className={`d-block ${
                                    good2
                                       ? isInit2
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 {!isInit2 ? (
                                    <>{good2 ? <FaExclamation /> : <FaCheck />}</>
                                 ) : (
                                    <FaCircle size={"6px"} />
                                 )}
                              </span>
                              <span
                                 className={`d-block ${
                                    good3
                                       ? isInit3
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 {!isInit3 ? (
                                    <>{good3 ? <FaExclamation /> : <FaCheck />}</>
                                 ) : (
                                    <FaCircle size={"6px"} />
                                 )}
                              </span>
                              <span
                                 className={`d-block ${
                                    good4
                                       ? isInit4
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 {!isInit4 ? (
                                    <>{good4 ? <FaExclamation /> : <FaCheck />}</>
                                 ) : (
                                    <FaCircle size={"6px"} />
                                 )}
                              </span>
                           </div>
                           <div className="d-flex flex-column justify-content-between">
                              <span
                                 className={`d-block ${css.password_rules} ${
                                    good
                                       ? isInit
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 Have a minimum of 8 characters
                              </span>
                              <span
                                 className={`d-block ${css.password_rules} ${
                                    good1
                                       ? isInit1
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 Contain at least 1 uppercase letter (A-Z)
                              </span>
                              <span
                                 className={`d-block ${css.password_rules} ${
                                    good2
                                       ? isInit2
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 Contain at least 1 lowercase letter (a-z)
                              </span>
                              <span
                                 className={`d-block ${css.password_rules} ${
                                    good3
                                       ? isInit3
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 Contain at least 1 number (0-9)
                              </span>
                              <span
                                 className={`d-block ${css.password_rules} ${
                                    good4
                                       ? isInit4
                                          ? "text-secondary"
                                          : "text-danger"
                                       : "text-success"
                                 }`}>
                                 Contain at least 1 special character (!@#$%^&*)
                              </span>
                           </div>
                        </div>
                     </motion.div>

                     <div className="form-floating mt-4">
                        <input
                           id="InputCPassword"
                           type="password"
                           className={`form-control ${css.fields} ${
                              errorsRegister.cpass.hasError || emptyErrorsRegister.cpass
                                 ? "border border-danger"
                                 : "mb-4"
                           }`}
                           name="cpass"
                           onChange={handleOnChangeRegister}
                           value={formDataRegister.cpass}
                        />
                        <label htmlFor="InputCPassword">Confirm Password *</label>
                     </div>
                     {errorsRegister.cpass.hasError && (
                        <p className="text-danger mb-4 small">{errorsRegister.cpass.msg}</p>
                     )}
                     {emptyErrorsRegister.cpass && (
                        <p className="text-danger mb-4 small">This field is required</p>
                     )}

                     <div className="form-floating">
                        <select
                           id="floatingSelect"
                           className={`form-control ${css.fields} ${
                              errorsRegister.userType.hasError || emptyErrorsRegister.userType
                                 ? "border border-danger"
                                 : "mb-4"
                           }`}
                           name="userType"
                           defaultValue={formDataRegister.userType}
                           onChange={handleOnChangeRegister}>
                           <option disabled value="none">
                              Choose Type
                           </option>
                           <option value="student">Student</option>
                           <option value="teacher">Teacher</option>
                        </select>
                        <label htmlFor="floatingSelect">Select User Type *</label>
                     </div>
                     {errorsRegister.userType.hasError && (
                        <p className="text-danger mb-4 small">{errorsRegister.userType.msg}</p>
                     )}
                     {emptyErrorsRegister.userType && (
                        <p className="text-danger mb-4 small">This field is required</p>
                     )}

                     <button type="submit" className={`${css.buttons} mb-4`} disabled={loading}>
                        {loading ? (
                           <>
                              <span
                                 className="spinner-border spinner-border-sm me-2"
                                 role="status"
                                 aria-hidden="true"></span>
                              Registering...
                           </>
                        ) : (
                           <>Sign Up</>
                        )}
                     </button>
                  </form>
               </div>

               {/* LOGIN */}
               <div className={`${css.form_container} ${css.sign_in_container}`}>
                  <form action="#" className={css.formLogin} onSubmit={loginUser}>
                     <h1 className={`${css.header} mb-4`}>Sign in</h1>
                     {loginError.hasError && (
                        <div
                           className={`${css.error_alert} alert alert-danger text-start`}
                           role="alert">
                           <MdWarning size={20} className="me-3" />
                           {loginError.errorMsg}
                        </div>
                     )}
                     {/* <span className={css.subtext}>or use your account</span> */}
                     <div className="form-floating">
                        <input
                           id="InputEmailUsername"
                           className={`form-control ${css.fields} ${
                              emptyErrorsLogin.email_username ? "border border-danger" : "mb-3"
                           }`}
                           type="text"
                           // placeholder="Email/Username"
                           name="email_username"
                           onChange={handleOnChangeLogin}
                           value={formDataLogin.email_username}
                        />
                        <label htmlFor="InputEmailUsername">Email/Username</label>
                     </div>
                     {emptyErrorsLogin.email_username && (
                        <p className={`${css.error_text} text-danger mb-2 text-start small`}>
                           This field is required
                        </p>
                     )}

                     <div className="form-floating">
                        <input
                           id="InputLoginPassword"
                           className={`form-control ${css.fields} ${
                              emptyErrorsLogin.pass ? "border border-danger" : "mb-5"
                           }`}
                           type="password"
                           // placeholder="Password"
                           name="pass"
                           onChange={handleOnChangeLogin}
                           value={formDataLogin.pass}
                        />
                        <label htmlFor="InputLoginPassword">Password</label>
                     </div>
                     {emptyErrorsLogin.pass && (
                        <p className={`${css.error_text} text-danger mb-4 text-start small`}>
                           This field is required
                        </p>
                     )}
                     {/* <a className={css.forgot_pass} href="#">
                     Forgot your password?
                  </a> */}
                     <button type="submit" className={css.buttons}>
                        Sign In
                     </button>
                  </form>
               </div>

               {/* OVERLAY */}
               <div className={css.overlay_container}>
                  <div className={css.overlay}>
                     <img
                        src="/images/res/login_register_bg.jpg"
                        alt=""
                        className={`${css.login_register_bg} img-fluid`}
                     />
                     <div className={css.bg_overlay}></div>
                     <div className={`${css.overlay_panel} ${css.overlay_left}`}>
                        <h1 className={css.welcome}>Welcome!</h1>
                        <p className={css.message}>
                           Join us and start conducting your exams online.
                        </p>
                        <button
                           className={`${css.buttons} ${css.ghost}`}
                           id="signIn"
                           onClick={goToSignIn}>
                           Sign In
                        </button>
                     </div>
                     <div className={`${css.overlay_panel} ${css.overlay_right} `}>
                        <p className={`${css.logo} m-0`}>
                           Ex
                           <GiBrain />
                           mplify.
                        </p>
                        {/* <h1>Welcome.</h1> */}
                        <p className={`${css.message}`}>The future of online examination</p>
                        {/* <div className="d-flex align-items-center mb-4">
                           <div className={css.line}></div>
                           <span className={css.or}>OR</span>
                           <div className={css.line}></div>
                        </div> */}
                        <button
                           className={`${css.buttons} ${css.ghost}`}
                           id="signUp"
                           onClick={goToSignUp}>
                           Sign Up
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
