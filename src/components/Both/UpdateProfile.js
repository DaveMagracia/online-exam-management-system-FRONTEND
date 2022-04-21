import React, { useContext } from "react";
import css from "./css/UpdateProfile.module.css";
import StudentNavbar from "../Student/StudentNavbar";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import PuffLoader from "react-spinners/PuffLoader";
import jwt_decode from "jwt-decode";

export default function UpdateProfile(props) {
   const { user, setUser } = useContext(UserContext);
   const [loading, setLoading] = React.useState(false);
   let navigate = useNavigate();

   //initialize state default values (for FORM FIELDS)
   const [formData, setFormData] = React.useState({
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
      email: { hasError: false, msg: "Invalid Email" },
      username: {
         hasError: false,
         msg: "Invalid Username. Must be alphanumeric with 4-20 characters.",
      },
      pass: { hasError: false, msg: "Invalid Password" },
   });

   //errors for empty fields; false value means field is not empty
   const [emptyErrors, setEmptyErrors] = React.useState({
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
                  window.location.reload(); //reload page. navigate() doesnt update navbar username
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
      //get user details from token to set the initial values of the form
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
      setFormData({
         email: userTokenDecoded.email,
         username: userTokenDecoded.username,
         pass: "",
      });
   }, []);

   return (
      <>
         {getNavbar()}
         <div>
            {loading ? (
               <div
                  className={`${css.updateProfile_root} d-flex flex-column align-items-center justify-content-center`}>
                  <PuffLoader loading={loading} color="#9c2a22" size={80} />
                  <p className="lead mt-4">&nbsp;&nbsp;Updating Profile...</p>
               </div>
            ) : (
               <div className={`${css.updateProfile_root}`}>
                  {/* ACTUAL FORM */}
                  <div className={`${css.form} container p-5`}>
                     <h2 className="mb-4">Update Profile</h2>
                     {generalError.hasGenError && (
                        <div className="alert alert-danger" role="alert">
                           {generalError.msg}
                        </div>
                     )}
                     <form onSubmit={submitForm}>
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
                              onChange={handleOnChange}
                              value={formData.username}
                           />
                           <label htmlFor="InputUsername">Username</label>
                           {emptyErrors.username && (
                              <p className="text-danger m-0 small">This field is required</p>
                           )}

                           <div
                              className={`form-text mb-4 ${
                                 errors.username.hasError ? "text-danger" : "text-muted"
                              }`}>
                              Username must:
                              <ul>
                                 <li>Have a minimum of 4 characters</li>
                                 <li>Contain alphanumeric characters</li>
                                 <li>Not contain special characters</li>
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
                        <button type="submit" className={`${css.reg_btn} btn btn-primary`}>
                           Update Profile
                        </button>
                     </form>
                  </div>
               </div>
            )}
         </div>
      </>
   );
}
