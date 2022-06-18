import React, { useContext } from "react";
//components
import AdminDashboard from "./AdminDashboard";
import { UserContext } from "../../UserContext";
import css from "./css/MainAdmin.module.css";

import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";
import { motion, AnimatePresence } from "framer-motion"; //FRAMER MOTION FOR ANIMATION

export default function MainAdmin() {
   //useNavigate hook from React Router
   const { user, setUser } = useContext(UserContext);
   const [isLoading, setLoading] = React.useState(true); //if the user is already set in the context, don't show loading
   const [isLoaded, setIsLoaded] = React.useState(true); //if the user is already set in the context, don't show loading
   const navigate = useNavigate();

   //REMOVED
   //reason: the jwt token can already be decoded in the frontend. there is no reason to make a request to get the user info again
   // gets the user info based on the token
   // async function getUserInfo() {
   //    await axios({
   //       method: "GET",
   //       headers: {
   //          Authorization: `Bearer ${localStorage.getItem("token")}`,
   //       },
   //       baseURL: "http://localhost:5000/user/info",
   //    })
   //       .then((response) => {
   //          setTimeout(() => {
   //             setUser({
   //                email: response.data.email,
   //                username: response.data.username,
   //                userType: response.data.userType,
   //             });

   //             setLoading(false);
   //          }, 2000);
   //       })
   //       .catch((err) => {
   //          console.log(err);
   //          setLoading(false);
   //       });
   // }

   //runs after the component mounts
   React.useEffect(() => {
      const token = localStorage.getItem("token");
      const isLoaded = localStorage.getItem("isLoaded");
      setIsLoaded(isLoaded);
      //initially, upon logging in, this will be false because it is not yet set
      //if true, skip the loading animation whenever the user navigates to the dashboard
      if (isLoaded) {
         const userTokenDecoded = jwt_decode(token);
         setUser(userTokenDecoded);
         setLoading(false);
      } else {
         if (token) {
            const userTokenDecoded = jwt_decode(token);
            if (!userTokenDecoded) {
               setLoading(false);
               localStorage.removeItem("token");
               localStorage.removeItem("isLoaded");
               localStorage.removeItem("isSidebarOpen");
               navigate("/login-register"); //redirect to login page if something went wrong
            } else {
               setTimeout(() => {
                  setUser(userTokenDecoded);
                  setLoading(false);
               }, 2000);
            }
         } else {
            navigate("/login-register"); //if user tries to access dashboard while not logged in, redirect to login page
         }
      }
   }, []); // empty array as the second agument means this effect will only run once after the component mounts

   React.useEffect(() => {
      //this will allow the page to reload. if this is set, the loading animation will cancel
      if (localStorage.getItem("token")) {
         localStorage.setItem("isLoaded", true);
      }

      if (localStorage.getItem("isSidebarOpen") === null) {
         localStorage.setItem("isSidebarOpen", true);
      }
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
                        <PuffLoader loading={isLoading} color="#006ec9" size={80} />
                        <p className="lead mt-3">&nbsp;Logging In...</p>
                     </motion.div>
                  )}
               </AnimatePresence>
            ) : (
               <>
                  <motion.div
                     // cont animate when page is previously loaded
                     initial={{ opacity: isLoaded ? 1 : 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.5 }}>
                     <AdminDashboard username={user.username} />
                  </motion.div>
               </>
            )
         }
      </>
   );
}
