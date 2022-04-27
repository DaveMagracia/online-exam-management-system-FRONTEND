import React from "react";
import css from "./css/FacultyNavbar.module.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function FacultyNavbar(props) {
   const navigate = useNavigate();
   const [isShownLogoutModal, setIsShownLogoutModal] = React.useState(false);

   function handleLogoutModalClose() {
      setIsShownLogoutModal(false);
   }

   function openLogoutModal() {
      setIsShownLogoutModal(true);
   }

   function UpdateProfile() {
      navigate("/update-profile");
   }

   function ChangePassword() {
      navigate("/change-password");
   }

   return (
      <>
         <nav className={`${css.fact_navbar_root} navbar navbar-expand-lg navbar-light`}>
            <div className="d-flex align-content-center w-100 ps-5 pe-4">
               <a className="navbar-brand" href="/">
                  Online Exam
               </a>

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
                     {/* my profile dropdown */}
                     <li className={`${css.nav_name} nav-item d-flex`}>
                        <div className={css.profile_pic}></div>
                        <span className="nav-link">Welcome, {props.username}!&nbsp;</span>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>
      </>
   );
}
