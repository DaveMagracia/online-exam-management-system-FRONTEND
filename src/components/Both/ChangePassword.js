import React, { useContext } from "react";
import StudentNavbar from "../Student/StudentNavbar";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import Sidebar from "../Both/Sidebar";
import { motion } from "framer-motion";
import axios from "axios";
import css from "./css/ChangePassword.module.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";
import { FaExclamation, FaCheck, FaCircle } from "react-icons/fa";
import { VscCircleFilled } from "react-icons/vsc";

export default function ChangePassword(props) {
   const { user, setUser } = useContext(UserContext);
   const [loading, setLoading] = React.useState(false);
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

   let navigate = useNavigate();

   //initialize state default values (for FORM FIELDS)
   const [formData, setFormData] = React.useState({
      newpass: "",
      cpass: "",
      pass: "",
   });

   //general error; shown on top of the form
   const [generalError, setGenError] = React.useState({
      hasGenError: false,
      msg: "",
   });

   //errors for validation; false value means no error
   const [errors, setErrors] = React.useState({
      pass: { hasError: false, msg: "Invalid Password" },
      newpass: { hasError: false, msg: "Invalid Password" },
      cpass: { hasError: false, msg: "Password not Match" },
   });

   //errors for empty fields; false value means field is not empty
   const [emptyErrors, setEmptyErrors] = React.useState({
      pass: false,
      newpass: false,
      cpass: false,
   });

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

   //handles onchange on form fields
   function handleOnChange(event) {
      const { name, value } = event.target;
      //remove error to the field that was changed
      setEmptyErrors((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

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
      let tempEmptyErrors = { ...emptyErrors };

      //NOTE: in JS, if formData.email has a value, it is considered true

      tempEmptyErrors.pass = formData.pass ? false : true;
      tempEmptyErrors.newpass = formData.newpass ? false : true;
      tempEmptyErrors.cpass = formData.cpass ? false : true;
      setEmptyErrors(tempEmptyErrors);

      // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
      var hasEmptyFields = Object.keys(tempEmptyErrors).some((k) => tempEmptyErrors[k] === true);

      //if there are no empty fields, proceed to validation
      if (!hasEmptyFields) {
         //temp errors
         //Use spread operator. Simply assigning the errors to tempError without spread doesn't assign the object as a value
         let tempErrors = { ...errors };

         //validate inputs

         let passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
         let password = formData.pass.trim();
         let cpassword = formData.cpass.trim();
         let newpassword = formData.newpass.trim();

         tempErrors.newpass.hasError = !newpassword.match(passRegex);
         tempErrors.cpass.hasError = newpassword !== cpassword;
         // set the tempErrors to the "errors" state
         setErrors(tempErrors);

         //the return statements will return a boolean. If true, it means the form inputs are valid, invalid otherwise
         //if there are no errors in the tempErrors, return true
         return !Object.keys(tempErrors).some((k) => tempErrors[k].hasError === true);
      }
      return false;
   }

   async function ChangePassword(event) {
      event.preventDefault();
      if (validateForm()) {
         setLoading(true);
         await axios({
            method: "PATCH",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            baseURL: `http://localhost:5000/user`,
            data: formData,
         })
            .then((data) => {
               //in this then, redirect user to login page
               setTimeout(() => {
                  setLoading(false);
                  navigate("/dashboard");
               }, 1000);
            })
            .catch((err) => {
               setTimeout(() => {
                  setLoading(false);
                  setGenError({
                     hasGenError: true,
                     msg: err.response.data.msg,
                  });
               }, 1000);
            });
      }
   }

   function getNavbar() {
      // identifies what type of navbar to be displayed
      if (user) {
         if (user.userType === "student") {
            return <StudentNavbar username={user.username} />;
         } else if (user.userType === "teacher") {
            return <FacultyNavbar username={user.username} />;
         }
      }
   }

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
   }, []);

   return (
      <>
         <Sidebar>
            {loading ? (
               <div
                  className={`${css.changePass_root} d-flex flex-column align-items-center justify-content-center`}>
                  <PuffLoader loading={loading} color="#9c2a22" size={80} />
                  <p className="lead mt-4">&nbsp;&nbsp;Updating Password...</p>
               </div>
            ) : (
               <motion.div
                  initial={{ transform: "translateX(70px)", opacity: 0 }}
                  animate={{ transform: "translateX(0px)", opacity: 1 }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                  className={`${css.changePass_root}`}>
                  {/* ACTUAL FORM */}
                  <div className={`${css.form} container p-5`}>
                     <h2 className="mb-4">Change Password</h2>
                     {generalError.hasGenError && (
                        <div className="alert alert-danger" role="alert">
                           {generalError.msg}
                        </div>
                     )}
                     <form onSubmit={ChangePassword}>
                        {/* password field */}
                        <div className="form-floating">
                           <input
                              id="InputOldPassword"
                              type="password"
                              className={`form-control ${
                                 errors.pass.hasError || emptyErrors.pass
                                    ? "border border-danger"
                                    : "mb-4"
                              }`}
                              name="pass"
                              onChange={handleOnChange}
                              value={formData.pass}
                           />
                           <label htmlFor="InputOldPassword">Old Password</label>
                        </div>
                        {errors.pass.hasError && (
                           <p className="text-danger mb-4 small">{errors.pass.msg}</p>
                        )}
                        {emptyErrors.pass && (
                           <p className="text-danger mb-4 small">This field is required</p>
                        )}

                        {/* newpassword field */}
                        <div className="form-floating">
                           <input
                              id="InputNewPassword"
                              type="password"
                              className={`form-control ${
                                 (errors.newpass.hasError || emptyErrors.newpass) &&
                                 "border border-danger"
                              }`}
                              name="newpass"
                              onChange={handleOnChangePassword}
                              value={formData.newpass}
                           />
                           <label className="m-0" htmlFor="InputNewPassword">
                              New Password
                           </label>
                           {emptyErrors.newpass && (
                              <p className="text-danger small m-0">This field is required</p>
                           )}
                           <div
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
                           </div>
                        </div>

                        {/* cpassword field */}
                        <div className="form-floating">
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
                           <label htmlFor="InputCPassword">Confirm New Password</label>
                        </div>
                        {errors.cpass.hasError && (
                           <p className="text-danger mb-4 small">{errors.cpass.msg}</p>
                        )}
                        {emptyErrors.cpass && (
                           <p className="text-danger mb-4 small">This field is required</p>
                        )}

                        {/* submit button */}
                        <button type="submit" className={`btn btn-primary`}>
                           Update Password
                        </button>
                        <span
                           className={`${css.link} d-block mt-4 link-primary`}
                           onClick={() => navigate("/update-profile")}>
                           Edit Profile
                        </span>
                     </form>
                  </div>
               </motion.div>
            )}
         </Sidebar>
      </>
   );
}
