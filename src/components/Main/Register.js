import React from "react";
import css from "./css/Register.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//THIS IS A REACT SPINNER
//source: https://www.npmjs.com/package/react-spinners (see demo)
import PuffLoader from "react-spinners/PuffLoader";
import { FaExclamation, FaCheck, FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Register() {
   let navigate = useNavigate();

   const [loading, setLoading] = React.useState(false);

   //initialize state default values (for FORM FIELDS)
   const [formData, setFormData] = React.useState({
      fullname: "",
      email: "",
      username: "",
      pass: "",
      cpass: "",
      userType: "none",
      checked: false,
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
   const [isFocused, setFocuss] = React.useState(false);

   //errors for validation; false value means no error
   const [errors, setErrors] = React.useState({
      fullname: { hasError: false, msg: "Invalid Name" },
      email: { hasError: false, msg: "Invalid Email" },
      username: { hasError: false, msg: "Invalid Username" },
      pass: { hasError: false, msg: "Invalid Password" },
      cpass: { hasError: false, msg: "Passwords do not match" },
      userType: { hasError: false, msg: "Please select an option" },
      checked: {
         hasError: false,
         msg: "You must agree to our Terms and Conditions",
      },
   });

   //errors for empty fields; false value means field is not empty
   const [emptyErrors, setEmptyErrors] = React.useState({
      fullname: false,
      email: false,
      username: false,
      pass: false,
      cpass: false,
      userType: false,
   });

   //handles onchange on form fields
   function handleOnChange(event) {
      const { name, value, type, checked } = event.target;
      //removes error to TAC checkbox if the checkbox is clicked
      if (name === "checked") {
         setErrors((prevValue) => ({
            ...prevValue,
            checked: {
               hasError: false,
               msg: "You must agree to our Terms and Conditions",
            },
         }));
      }

      //remove error to the field that was changed
      setEmptyErrors((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      //set the new value to the formData
      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   // validates fields; returns true if form is valid, else returns false
   function validateForm() {
      // before validation, check if fields are filled up
      let tempEmptyErrors = { ...emptyErrors };

      //NOTE: in JS, if formData.email has a value, it is considered true
      tempEmptyErrors.fullname = formData.fullname ? false : true;
      tempEmptyErrors.email = formData.email ? false : true;
      tempEmptyErrors.username = formData.username ? false : true;
      tempEmptyErrors.pass = formData.pass ? false : true;
      tempEmptyErrors.cpass = formData.cpass ? false : true;
      tempEmptyErrors.userType = formData.userType !== "none" ? false : true;
      setEmptyErrors(tempEmptyErrors);

      // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
      var hasEmptyFields = Object.keys(tempEmptyErrors).some((k) => tempEmptyErrors[k] === true);

      //if there are no empty fields, proceed to validation
      if (!hasEmptyFields) {
         //temp errors
         //Use spread operator. Simply assigning the errors to tempError without spread doesn't assign the object as a value
         let tempErrors = { ...errors };

         //validate inputs
         let emailRegex = /^[a-zA-Z0-9.!#$%&???*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
         let email = formData.email.trim();
         tempErrors.email.hasError = !email.match(emailRegex);

         let usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
         let username = formData.username.trim();
         tempErrors.username.hasError = !username.match(usernameRegex);

         let passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
         let password = formData.pass.trim();
         let cpassword = formData.cpass.trim();

         tempErrors.pass.hasError = !password.match(passRegex);
         tempErrors.cpass.hasError = password !== cpassword;
         tempErrors.userType.hasError = formData.userType === "none";
         tempErrors.checked.hasError = !formData.checked;

         // set the tempErrors to the "errors" state
         setErrors(tempErrors);

         //the return statements will return a boolean. If true, it means the form inputs are valid, invalid otherwise
         //if there are no errors in the tempErrors, return true
         return !Object.keys(tempErrors).some((k) => tempErrors[k].hasError === true);
      }
      return false;
   }

   function handleOnChangePassword(event) {
      const { name, value, type, checked } = event.target;
      setEmptyErrors((prevValue) => ({
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

      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
         };
      });
   }

   function onFocus(event) {
      setFocuss(true);
   }

   //makes the call to the api, and send a post request for the server to process and write to DB
   async function registerUser(event) {
      event.preventDefault();
      if (validateForm()) {
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
            data: formData,
         })
            .then((data) => {
               //in this then, redirect user to login page
               setTimeout(() => {
                  setLoading(false);
                  navigate("/login-register");
               }, 5000);
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

   return (
      <div>
         {loading ? (
            <div
               className={`${css.register_root} d-flex flex-column align-items-center justify-content-center`}>
               <PuffLoader loading={loading} color="#006ec9" size={80} />
               <p className="lead mt-4">&nbsp;&nbsp;Creating your account...</p>
            </div>
         ) : (
            <div>
               <div className={`${css.register_root} d-flex`}>
                  {/* left section */}
                  <div className={`${css.left} d-none d-md-block`}></div>

                  {/* right section */}
                  <div
                     className={`${css.form_container} ${css.right} container p-0 m-0 w-100-md d-md-flex align-items-center`}>
                     {/* top divider (SHOWN ONLY ON MEDIUM SCREENS) */}
                     <div className={`${css.divider} d-block d-md-none`}></div>
                     {/* ACTUAL FORM */}
                     <div className={`${css.form} m-5`}>
                        <h1 className="mb-5">OnlineExam</h1>
                        <h2 className="mb-4">Create an Account</h2>
                        {generalError.hasGenError && (
                           <div className="alert alert-danger" role="alert">
                              {generalError.msg}
                           </div>
                        )}
                        <form onSubmit={registerUser}>
                           {/* full name field */}
                           <div className="form-floating">
                              <input
                                 id="Inputfullname"
                                 type="text"
                                 className={`form-control ${
                                    errors.fullname.hasError || emptyErrors.fullname
                                       ? "border border-danger"
                                       : "mb-4"
                                 }`}
                                 name="fullname"
                                 onChange={handleOnChange}
                                 value={formData.fullname}
                              />
                              <label htmlFor="Inputfullname">Full Name *</label>
                           </div>
                           {errors.fullname.hasError && (
                              <p className="text-danger mb-4 small">{errors.fullname.msg}</p>
                           )}
                           {emptyErrors.fullname && (
                              <p className="text-danger mb-4 small">This field is required</p>
                           )}

                           {/* email field */}
                           <div className="form-floating">
                              <input
                                 id="InputEmail"
                                 type="email"
                                 className={`form-control ${
                                    errors.email.hasError || emptyErrors.email
                                       ? "border border-danger"
                                       : "mb-4"
                                 }`}
                                 name="email"
                                 onChange={handleOnChange}
                                 value={formData.email}
                              />
                              <label htmlFor="InputEmail">Email address *</label>
                           </div>
                           {errors.email.hasError && (
                              <p className="text-danger mb-4 small">{errors.email.msg}</p>
                           )}
                           {emptyErrors.email && (
                              <p className="text-danger mb-4 small">This field is required</p>
                           )}

                           {/* username field */}
                           <div className="form-floating">
                              <input
                                 id="InputUsername"
                                 type="text"
                                 className={`form-control ${
                                    errors.username.hasError || emptyErrors.username
                                       ? "border border-danger"
                                       : "mb-4"
                                 }`}
                                 name="username"
                                 onChange={handleOnChange}
                                 value={formData.username}
                              />
                              <label htmlFor="InputUsername">Username *</label>
                           </div>
                           {emptyErrors.username && (
                              <p className="text-danger mb-4 small">This field is required</p>
                           )}
                           {errors.username.hasError && (
                              <p className="text-danger mb-4 small">{errors.username.msg}</p>
                           )}

                           {/* password field */}
                           <div className="form-floating">
                              <input
                                 id="InputPassword"
                                 type="password"
                                 className={`form-control ${
                                    (errors.pass.hasError || emptyErrors.pass) &&
                                    "border border-danger"
                                 }`}
                                 name="pass"
                                 onChange={handleOnChangePassword}
                                 onFocus={onFocus}
                                 value={formData.pass}
                              />
                              <label htmlFor="InputPassword">Password *</label>

                              {emptyErrors.pass && (
                                 <p className="text-danger m-0 small">This field is required</p>
                              )}

                              <motion.div
                                 initial={{ height: "0px", opacity: 0 }}
                                 animate={{
                                    height: isFocused ? "130px" : "0px",
                                    opacity: isFocused ? 1 : 0,
                                 }}
                                 transition={{ ease: "easeInOut", duration: 0.3 }}
                                 className={`form-text mb-4 ${
                                    errors.pass.hasError ? "text-danger" : "text-muted"
                                 }`}>
                                 A password must:
                                 <div className="d-flex ps-2">
                                    <div
                                       className="d-flex flex-column align-items-center"
                                       style={{ width: "30px" }}>
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
                                    <div>
                                       <span
                                          className={`d-block ${
                                             good
                                                ? isInit
                                                   ? "text-secondary"
                                                   : "text-danger"
                                                : "text-success"
                                          }`}>
                                          Have a minimum of 8 characters
                                       </span>
                                       <span
                                          className={`d-block ${
                                             good1
                                                ? isInit1
                                                   ? "text-secondary"
                                                   : "text-danger"
                                                : "text-success"
                                          }`}>
                                          Contain at least 1 uppercase letter (A-Z)
                                       </span>
                                       <span
                                          className={`d-block ${
                                             good2
                                                ? isInit2
                                                   ? "text-secondary"
                                                   : "text-danger"
                                                : "text-success"
                                          }`}>
                                          Contain at least 1 lowercase letter (a-z)
                                       </span>
                                       <span
                                          className={`d-block ${
                                             good3
                                                ? isInit3
                                                   ? "text-secondary"
                                                   : "text-danger"
                                                : "text-success"
                                          }`}>
                                          Contain at least 1 number (0-9)
                                       </span>
                                       <span
                                          className={`d-block ${
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

                              {/* <div
                                 className={`form-text mb-4 ${
                                    errors.pass.hasError ? "text-danger" : "text-muted"
                                 }`}>
                                 A password must:
                                 <ul>
                                    <li>Have a minimum of 8 characters</li>
                                    <li>Contain at least 1 uppercase letter (A-Z)</li>
                                    <li>Contain at least 1 lowercase letter (a-z)</li>
                                    <li>Contain at least 1 number (0-9)</li>
                                    <li>Contain at least 1 special character (!@#$%^&*)</li>
                                 </ul>
                              </div> */}
                           </div>
                           {/* {errors.pass.hasError && (
                              <p className="text-danger mb-4 small">
                                 {errors.pass.msg}
                              </p>
                           )} */}

                           {/* confirm pass field */}
                           <div className="form-floating mt-4">
                              <input
                                 id="InputCPassword"
                                 type="password"
                                 className={`form-control ${
                                    errors.cpass.hasError || emptyErrors.cpass
                                       ? "border border-danger"
                                       : "mb-4"
                                 }`}
                                 name="cpass"
                                 onChange={handleOnChange}
                                 value={formData.cpass}
                              />
                              <label htmlFor="InputCPassword">Confirm Password *</label>
                           </div>
                           {errors.cpass.hasError && (
                              <p className="text-danger mb-4 small">{errors.cpass.msg}</p>
                           )}
                           {emptyErrors.cpass && (
                              <p className="text-danger mb-4 small">This field is required</p>
                           )}

                           {/* select option field */}
                           <div className="form-floating">
                              <select
                                 id="floatingSelect"
                                 className={`form-control ${
                                    errors.userType.hasError || emptyErrors.userType
                                       ? "border border-danger"
                                       : "mb-4"
                                 }`}
                                 name="userType"
                                 defaultValue={formData.userType}
                                 onChange={handleOnChange}>
                                 <option disabled value="none">
                                    ----
                                 </option>
                                 <option value="student">Student</option>
                                 <option value="teacher">Teacher</option>
                              </select>
                              <label htmlFor="floatingSelect">Select User Type *</label>
                           </div>
                           {errors.userType.hasError && (
                              <p className="text-danger mb-4 small">{errors.userType.msg}</p>
                           )}
                           {emptyErrors.userType && (
                              <p className="text-danger mb-4 small">This field is required</p>
                           )}

                           {/* terms and conds checkbox */}
                           <div className="mb-5 form-check">
                              <input
                                 type="checkbox"
                                 className="form-check-input"
                                 id="tacCheckBox"
                                 name="checked"
                                 onChange={handleOnChange}
                                 checked={formData.checked}
                              />
                              <p className="form-check-label text-muted" htmlFor="tacCheckBox">
                                 By creating an account you agree to the&#160;
                                 <span
                                    className={`text-primary ${css.tac}`}
                                    data-bs-toggle="modal"
                                    data-bs-target="#tacModal">
                                    terms of use
                                 </span>{" "}
                                 and our
                                 <span
                                    className={`text-primary ${css.tac}`}
                                    data-bs-toggle="modal"
                                    data-bs-target="#ppModal">
                                    {" "}
                                    privacy policy
                                 </span>
                                 {errors.checked.hasError && (
                                    <>
                                       <br />
                                       <span className="text-danger mb-4 small">
                                          {errors.checked.msg}
                                       </span>
                                    </>
                                 )}
                              </p>
                           </div>
                           {/* submit button */}
                           <button type="submit" className={`${css.reg_btn} btn btn-primary`}>
                              Register
                           </button>

                           <p className="text-center mt-4 text-muted">
                              Already have an account?
                              <span className="text-primary">
                                 <a href="/login" className="text-decoration-none">
                                    {" "}
                                    Sign In
                                 </a>
                              </span>
                           </p>
                        </form>
                     </div>

                     {/* bottom divider (SHOWN ONLY ON MEDIUM SCREENS) */}
                     <div className={`${css.divider} d-block d-md-none`}></div>
                  </div>
               </div>

               <div
                  className="modal fade"
                  id="tacModal"
                  tabIndex="-1"
                  aria-labelledby="tacModal"
                  aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                     <div className="modal-content">
                        <div className="modal-header">
                           <h5 className="modal-title" id="tacModal">
                              Terms and Conditions
                           </h5>
                           <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                           <p>Content goes here...</p>
                        </div>
                        <div className="modal-footer">
                           <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal">
                              Close
                           </button>
                           <button type="button" className="btn btn-primary">
                              I Understand
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               <div
                  className="modal fade"
                  id="ppModal"
                  tabIndex="-1"
                  aria-labelledby="ppModal"
                  aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                     <div className="modal-content">
                        <div className="modal-header">
                           <h5 className="modal-title" id="ppModal">
                              Privacy Policy
                           </h5>
                           <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                           <p>Content goes here...</p>
                        </div>
                        <div className="modal-footer">
                           <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal">
                              Close
                           </button>
                           <button type="button" className="btn btn-primary">
                              I Understand
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
