import React, { useContext } from "react";
import css from "./css/UpdateProfile.module.css";
import StudentNavbar from "../Student/StudentNavbar";
import Sidebar from "./Sidebar";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";
import { MdPhotoCamera } from "react-icons/md";
import { FaExclamation, FaCheck } from "react-icons/fa";

export default function UpdateProfile(props) {
   const { user, setUser } = useContext(UserContext);
   const [loading, setLoading] = React.useState(false);
   const [isShownSuccess, setIsShownSuccess] = React.useState(false);
   const [good, setnotgood] = React.useState(false);
   const [good1, setnotgood1] = React.useState(false);
   const [good2, setnotgood2] = React.useState(false);

   let navigate = useNavigate();

   //initialize state default values (for FORM FIELDS)
   const [formData, setFormData] = React.useState({
      fullname: "",
      email: "",
      username: "",
   });

   //general error; shown on top of the form
   const [generalError, setGenError] = React.useState({
      hasGenError: false,
      msg: "",
   });

   //errors for validation; false value means no error
   const [errors, setErrors] = React.useState({
      fullname: { hasError: false, msg: "Invalid Name" },
      email: { hasError: false, msg: "Invalid Email" },
      username: {
         hasError: false,
         msg: "Invalid Username. Must be alphanumeric with 4-20 characters.",
      },
      pass: { hasError: false, msg: "Invalid Password" },
   });

   function handleOnChangeusername(event) {
      const { name, value } = event.target;
      //remove error to the field that was changed
      setEmptyErrors((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      const is_valid = /^.{4,35}$/.test(value);
      console.log(is_valid);
      if (!is_valid) {
         setnotgood(true);
      } else {
         setnotgood(false);
      }
      const is_valid_alpha = /^[0-9a-zA-Z]+$/.test(value);
      if (is_valid_alpha) {
         setnotgood1(false);
      } else {
         setnotgood1(true);
      }
      const is_not_containSpecialchar = /^[^ !"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/.test(
         value
      );
      if (is_not_containSpecialchar) {
         setnotgood2(false);
      } else {
         setnotgood2(true);
      }

      if (value === "") {
         setnotgood(true);
         setnotgood1(true);
         setnotgood2(true);
      }
      //set the new value to the formData
      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: value,
         };
      });
   }

   //errors for empty fields; false value means field is not empty
   const [emptyErrors, setEmptyErrors] = React.useState({
      fullname: false,
      email: false,
      username: false,
      pass: false,
   });

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
      tempEmptyErrors.fullname = formData.fullname ? false : true;
      tempEmptyErrors.email = formData.email ? false : true;
      tempEmptyErrors.username = formData.username ? false : true;
      //   tempEmptyErrors.pass = formData.pass ? false : true;
      setEmptyErrors(tempEmptyErrors);

      // "hasEmptyField" will be true if one of the key in the emptyErrors obj has a value of true
      var hasEmptyFields = Object.keys(tempEmptyErrors).some((k) => tempEmptyErrors[k] === true);

      //if there are no empty fields, proceed to validation
      if (!hasEmptyFields) {
         //temp errors
         //Use spread operator. Simply assigning the errors to tempError without spread doesn't assign the object as a value
         let tempErrors = { ...errors };

         //validate inputs
         let emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
         let email = formData.email.trim();
         tempErrors.email.hasError = !email.match(emailRegex);

         //alphanumeric with character count ranging from 4-20. (NO SPACES)
         let usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
         let username = formData.username.trim();
         tempErrors.username.hasError = !username.match(usernameRegex);

         //  let passRegex =
         //     /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
         //  let password = formData.pass.trim();

         //  tempErrors.pass.hasError = !password.match(passRegex);

         // set the tempErrors to the "errors" state
         setErrors(tempErrors);

         //the return statements will return a boolean. If true, it means the form inputs are valid, invalid otherwise
         //if there are no errors in the tempErrors, return true
         return !Object.keys(tempErrors).some((k) => tempErrors[k].hasError === true);
      }
      return false;
   }

   async function submitForm(event) {
      event.preventDefault();
      if (validateForm()) {
         setLoading(true);
         await axios({
            method: "PUT",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            baseURL: `http://localhost:5000/user/${user.id}`,
            data: formData,
         })
            .then((data) => {
               //in this then, redirect user to dashboard page
               setTimeout(() => {
                  //re-issue the existing token

                  localStorage.removeItem("token");
                  localStorage.setItem("token", data.data.token);
                  setLoading(false);
                  setIsShownSuccess(true);
               }, 2000);
            })
            .catch((err) => {
               console.log(err.response);
               setTimeout(() => {
                  setLoading(false);
                  setGenError({
                     hasGenError: true,
                     msg: err.response.data.msg,
                  });
               }, 2000);
            });
      }
   }

   React.useEffect(() => {
      document.title = `Update Profile | Online Examination`;
      //get user details from token to set the initial values of the form
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
      setFormData({
         email: userTokenDecoded.email,
         username: userTokenDecoded.username,
         fullname: userTokenDecoded.fullname,
         pass: "",
      });
   }, []);

   return (
      <>
         <div>
            {loading ? (
               <div
                  className={`${css.updateProfile_root} d-flex flex-column align-items-center justify-content-center`}>
                  <PuffLoader loading={loading} color="#9c2a22" size={80} />
                  <p className="lead mt-4">&nbsp;&nbsp;Updating Profile...</p>
               </div>
            ) : (
               <Sidebar>
                  <motion.div
                     initial={{ transform: "translateX(-70px)", opacity: 0 }}
                     animate={{ transform: "translateX(0px)", opacity: 1 }}
                     transition={{ ease: "easeOut", duration: 0.2 }}>
                     <div
                        className={`${css.updateProfile_root} d-flex flex-column flex-lg-row py-5 container`}>
                        {/* ACTUAL FORM */}
                        {/* profile picture section */}
                        <div>
                           <div className={`${css.profile_picture_container}`}>
                              <div className={`${css.profile_picture} img-fluid mx-auto`}></div>
                              <MdPhotoCamera className={css.profile_picture_icon} />
                           </div>
                           <div className="mb-3 mt-3">
                              <label for="formFile" className="form-label">
                                 Profile Picture
                              </label>
                              <input
                                 className="form-control form-control-sm"
                                 type="file"
                                 id="formFile"
                              />
                           </div>
                        </div>

                        {/* textfields section */}
                        <div className={`${css.form} px-lg-5 py-0 w-100`}>
                           <div className="ps-lg-4">
                              <h2 className="mb-4">Update Profile</h2>

                              {isShownSuccess && (
                                 <div
                                    class="alert alert-success alert-dismissible fade show"
                                    role="alert">
                                    Profile successfuly updated.
                                    <button
                                       type="button"
                                       class="btn-close"
                                       data-bs-dismiss="alert"
                                       aria-label="Close"></button>
                                 </div>
                              )}

                              {generalError.hasGenError && (
                                 <div className="alert alert-danger" role="alert">
                                    {generalError.msg}
                                 </div>
                              )}
                              <form onSubmit={submitForm}>
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
                                    <label htmlFor="Inputfullname">fullname</label>
                                 </div>
                                 {errors.fullname.hasError && (
                                    <p className="text-danger mb-4 small">{errors.fullname.msg}</p>
                                 )}
                                 {emptyErrors.fullname && (
                                    <p className="text-danger mb-4 small">This field is required</p>
                                 )}

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
                                    <label htmlFor="InputEmail">Email Address</label>
                                 </div>
                                 {errors.email.hasError && (
                                    <p className="text-danger mb-4 small">{errors.email.msg}</p>
                                 )}
                                 {emptyErrors.email && (
                                    <p className="text-danger mb-4 small">This field is required</p>
                                 )}

                                 <div className="form-floating">
                                    <input
                                       id="InputUsername"
                                       type="text"
                                       className={`form-control ${
                                          (errors.username.hasError || emptyErrors.username) &&
                                          "border border-danger"
                                       }`}
                                       name="username"
                                       onChange={handleOnChangeusername}
                                       value={formData.username}
                                    />
                                    <label htmlFor="InputUsername">Username</label>
                                    {emptyErrors.username && (
                                       <p className="text-danger m-0 small">
                                          This field is required
                                       </p>
                                    )}

                                    <div
                                       className={`form-text mb-4 ${
                                          errors.username.hasError ? "text-danger" : "text-muted"
                                       }`}>
                                       Username must:
                                       <ul>
                                          <li className={good ? null : "text-success"}>
                                             {good ? <FaExclamation /> : <FaCheck />}
                                             &nbsp;&nbsp;Have a minimum of 4 characters
                                          </li>
                                          <li className={good1 ? null : "text-success"}>
                                             {good1 ? <FaExclamation /> : <FaCheck />}
                                             &nbsp;&nbsp;Contain alphanumeric characters
                                          </li>
                                          <li className={good2 ? null : "text-success"}>
                                             {good2 ? <FaExclamation /> : <FaCheck />}
                                             &nbsp;&nbsp;Not contain special characters
                                          </li>
                                       </ul>
                                    </div>
                                 </div>

                                 {/* password field */}
                                 {/* <div className="form-floating">
                           <input
                              id="InputPassword"
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
                           <label htmlFor="InputPassword">Password *</label>
                        </div>
                        {errors.pass.hasError && (
                           <p className="text-danger mb-4 small">
                              {errors.pass.msg}
                           </p>
                        )}
                        {emptyErrors.pass && (
                           <p className="text-danger mb-4 small">
                              This field is required
                           </p>
                        )} */}
                                 <button
                                    type="submit"
                                    className={`${css.reg_btn} btn btn-primary me-4`}>
                                    Update Profile
                                 </button>
                                 <span
                                    className={`${css.link} d-block mt-4 link-primary`}
                                    onClick={() => navigate("/change-password")}>
                                    Change password
                                 </span>
                              </form>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </Sidebar>
            )}
         </div>
      </>
   );
}
