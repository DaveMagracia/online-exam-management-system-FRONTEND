import React from "react";
import css from "./css/Login.module.css";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
   let navigate = useNavigate();
   //form state
   const [formData, setFormData] = React.useState({
      email_username: "",
      pass: "",
   });

   const [loginError, setLoginError] = React.useState({
      hasError: false,
      errorMsg: "",
   });

   //errors for empty fields; false value means field is not empty
   const [emptyErrors, setEmptyErrors] = React.useState({
      email_username: false,
      pass: false,
   });

   function handleOnChange(event) {
      const { name, value, type, checked } = event.target;
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

   function validateForm() {
      let tempEmptyErrors = { ...emptyErrors };

      tempEmptyErrors.email_username = formData.email_username ? false : true;
      tempEmptyErrors.pass = formData.pass ? false : true;

      setEmptyErrors(tempEmptyErrors);

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
      if (validateForm()) {
         //SEND REQUEST, THEN CHECK IF USER EXISTS IN DB
         await axios({
            method: "POST",
            url: "http://localhost:5000/user/login",
            data: formData,
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

   return (
      <div>
         <Navbar />
         <div className={`${css.login_root} d-flex align-items-center justify-content-center`}>
            <div className={`${css.form_container} container`}>
               <h1 className="mb-4">Login</h1>
               <form onSubmit={loginUser}>
                  {loginError.hasError && (
                     <div className="alert alert-danger" role="alert">
                        {loginError.errorMsg}
                     </div>
                  )}

                  {/* USERNAME/EMAIL FIELD */}
                  <div className="form-floating">
                     <input
                        id="InputEmailUsername"
                        type="text"
                        className={`form-control 
                        ${emptyErrors.email_username ? "border border-danger" : "mb-4"}`}
                        name="email_username"
                        onChange={handleOnChange}
                        value={formData.email_username}
                     />
                     <label htmlFor="InputEmailUsername">email/username</label>
                  </div>
                  {emptyErrors.email_username && (
                     <p className="text-danger mb-4 small">This field is required</p>
                  )}

                  {/* PASSWORD FIELD */}
                  <div className="form-floating">
                     <input
                        id="InputPassword"
                        type="password"
                        className={`form-control ${
                           emptyErrors.pass ? "border border-danger" : "mb-4"
                        }`}
                        name="pass"
                        onChange={handleOnChange}
                        value={formData.pass}
                     />
                     <label htmlFor="InputEmailUsername">password</label>
                  </div>
                  {emptyErrors.pass && (
                     <p className="text-danger mb-4 small">This field is required</p>
                  )}

                  <button type="submit" className={`btn btn-primary w-100`}>
                     Login
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
