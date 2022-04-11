import React, { useContext } from "react";
//components
import StudentDashboard from "../Student/StudentDashboard";
import FacultyDashboard from "../Faculty/FacultyDashboard";
import { UserContext } from "../../UserContext";
import css from "./css/Main.module.css";

import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import { motion, AnimatePresence } from "framer-motion"; //FRAMER MOTION FOR ANIMATION

export default function Main() {
   //useNavigate hook from React Router
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setLoading] = React.useState(true); //if the user is already set in the context, don't show loading
   const navigate = useNavigate();

   // gets the user info based on the token
   const getUserInfo = async () => {
      await axios({
         method: "GET",
         headers: {
            token: localStorage.getItem("token"),
         },
         baseURL: "http://localhost:5000/user/info",
      })
         .then((response) => {
            setTimeout(() => {
               setUser({
                  email: response.data.email,
                  username: response.data.username,
                  userType: response.data.userType,
               });

               setLoading(false);
            }, 2000);
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
         });
   };

   //runs after the component mounts
   React.useEffect(() => {
      //if userData is already on local storage, then there is no need to fetch user data from server
      const userData = localStorage.getItem("userData");
      if (userData) {
         setLoading(false);
         setUser(JSON.parse(userData));
      } else {
         const token = localStorage.getItem("token"); //get token from local storage; run 'localStorage' in console to see the token
         if (token) {
            let user = jwt_decode(token); //decode the received token
            if (!user) {
               setLoading(false);
               localStorage.removeItem("token");
               navigate("/login"); //redirect to login page if something went wrong
            } else {
               //if user exists, get their info
               getUserInfo();
            }
         } else {
            //if user tries to access dashboard while not logged in, redirect to login page
            navigate("/login");
         }
      }
   }, []); // empty array as the second agument means this effect will only run once after the component mounts

   React.useEffect(() => {
      //put userData on local storage; data only contains email, username, and usertype
      //This is for the browser to remember the user, to prevent from fetching user data everytime the page is reloaded
      localStorage.setItem("userData", JSON.stringify(user));
   });

   return (
      <>
         {
            // If  loading, show Loading, else show main content
            isLoading ? (
               <AnimatePresence>
                  {isLoading && (
                     <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`${css.loading} d-flex flex-column align-items-center justify-content-center`}>
                        <PuffLoader
                           loading={isLoading}
                           color="#9c2a22"
                           size={80}
                        />
                        <p className="lead mt-3">&nbsp;Logging In...</p>
                     </motion.div>
                  )}
               </AnimatePresence>
            ) : (
               <>
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.5 }}>
                     {user.userType === "student" ? (
                        <StudentDashboard username={user.username} />
                     ) : (
                        <FacultyDashboard username={user.username} />
                     )}
                  </motion.div>
               </>
            )
         }
      </>
   );
}
