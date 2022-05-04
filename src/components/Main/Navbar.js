import React from "react";
import css from "./css/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GiBrain } from "react-icons/gi";

export default function Navbar(props) {
   const navigate = useNavigate();

   function goToLogin() {
      navigate("/login-register", { state: { name: "login" } });
   }

   function goToRegister() {
      navigate("/login-register", { state: { name: "register" } });
   }

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
               <span className={`${css.logo} navbar-brand ms-3`} href="/">
                  Ex
                  <GiBrain />
                  mplify
               </span>

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
                     <li className="nav-item me-2">
                        <a
                           className={`${css.nav_button} btn btn-primary nav-link`}
                           onClick={goToLogin}>
                           Get Started
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
