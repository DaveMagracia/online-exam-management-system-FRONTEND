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

   async function logout() {
      //remove data from local storage
      await localStorage.removeItem("token");
      await localStorage.removeItem("isLoaded");
      // await localStorage.removeItem("userData");
      navigate("/", { replace: true }); //dont store the current page in history
   }

   return (
      <>
         <nav className={`${css.fact_navbar_root} navbar navbar-expand-lg navbar-light`}>
            <div className="container">
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
                     <li className="nav-item me-2">
                        <a className="nav-link" aria-current="page" href="/dashboard">
                           Dashboard
                        </a>
                     </li>
                     <li className="nav-item me-2">
                        <a className="nav-link" href="/">
                           History
                        </a>
                     </li>
                     {/* my profile dropdown */}
                     <li className="nav-item dropdown">
                        <a
                           className="nav-link dropdown-toggle"
                           href="/"
                           id="navbarDarkDropdownMenuLink"
                           role="button"
                           data-bs-toggle="dropdown"
                           aria-expanded="false">
                           {props.username}
                           &nbsp;
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
                           <li className={`${css.nav_link} dropdown-item`} onClick={UpdateProfile}>
                              My Profile
                           </li>
                           <li className={`${css.nav_link} dropdown-item`} onClick={ChangePassword}>
                              Change Password
                           </li>
                           <li className="cursor-pointer" onClick={openLogoutModal}>
                              <p className={`${css.nav_link} dropdown-item m-0`}>Logout</p>
                           </li>
                        </ul>
                     </li>
                  </ul>
               </div>
            </div>

            <Modal show={isShownLogoutModal} onHide={handleLogoutModalClose}>
               <Modal.Header closeButton>
                  <Modal.Title>Logout</Modal.Title>
               </Modal.Header>
               <Modal.Body>Are you sure you want to logout?</Modal.Body>
               <Modal.Footer>
                  <Button variant="secondary" onClick={handleLogoutModalClose}>
                     Cancel
                  </Button>
                  <Button variant="primary" onClick={logout}>
                     Continue
                  </Button>
               </Modal.Footer>
            </Modal>

            <div
               className="modal fade"
               id="exampleModal"
               tabIndex="-1"
               aria-labelledby="exampleModalLabel"
               aria-hidden="true">
               <div className="modal-dialog">
                  <div className="modal-content">
                     <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                           Modal title
                        </h5>
                        <button
                           type="button"
                           className="btn-close"
                           data-bs-dismiss="modal"
                           aria-label="Close"></button>
                     </div>
                     <div className="modal-body">...</div>
                     <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                           Close
                        </button>
                        <button type="button" className="btn btn-primary" onClick={logout}>
                           Save changes
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </nav>
      </>
   );
}
