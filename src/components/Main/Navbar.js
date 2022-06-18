import React from "react";
import css from "./css/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GiBrain } from "react-icons/gi";
import axios from "axios";

export default function Navbar(props) {
   const navigate = useNavigate();

   function goToLogin() {
      navigate("/login-register", { state: { name: "login" } });
   }

   function goToRegister() {
      navigate("/login-register", { state: { name: "register" } });
   }

   const [content, setContent] = React.useState({
      logo: "",
   });

   async function getWebsiteContents() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/admin/content`,
      })
         .then((res) => {
            setContent({
               logo: res.data.contents.logo,
            });
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function setImgSrc(imageName) {
      var url = "";
      if (imageName === "logo.png") {
         imageName = "logo.PNG";
      }
      try {
         //require url to catch error if image is not found
         const src = require(`../../../public/images/profilePictures/${imageName}`);
         url = `/images/profilePictures/${imageName}`;
      } catch (err) {
         url = `/images/profilePictures/ExamplifyLogo.png`;
      }
      return url;
   }

   React.useEffect(() => {
      getWebsiteContents();
   }, []);

   return (
      <>
         <motion.nav
            initial={{
               height: props.navbarOpened ? "80px" : "70px",
               backgroundColor: props.navbarOpened ? "white" : "transparent",
               boxShadow: props.navbarOpened
                  ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                  : "none",
            }}
            animate={{
               height: props.navbarOpened ? "80px" : "70px",
               backgroundColor: props.navbarOpened ? "white" : "transparent",
               boxShadow: props.navbarOpened
                  ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                  : "none",
            }}
            className={`${css.navbar_root} navbar navbar-expand-lg navbar-light `}>
            <div className="container">
               {content.logo === "ExamplifyLogo.png" ? (
                  <span className={`${css.logo} navbar-brand ms-3`} href="/">
                     Ex
                     <GiBrain />
                     mplify
                  </span>
               ) : (
                  <div className={`${css.logo_container} ms-3`}>
                     <img className={css.logo_image} src={setImgSrc(content.logo)} alt="logo" />
                  </div>
               )}

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
                     {/* <li className="nav-item me-2">
                        <a className="nav-link active" aria-current="page" href="/">
                           Home
                        </a>
                     </li> */}
                     <li className="nav-item me-3">
                        <a
                           className={`${css.nav_button} btn btn-primary nav-link`}
                           onClick={goToLogin}>
                           Sign In
                        </a>
                     </li>
                     <li className="nav-item me-2">
                        <a
                           className={`${css.nav_button_outline} btn btn-outline-primary nav-link`}
                           onClick={goToRegister}>
                           Sign Up
                        </a>
                     </li>
                     {/* <li className="nav-item me-2">
                        <a className={`${css.link} nav-link`} onClick={goToRegister}>
                           Register
                        </a>
                     </li> */}
                  </ul>
               </div>
            </div>
         </motion.nav>
      </>
   );
}
