import React from "react";
import css from "./css/FacultyNavbar.module.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { GiBrain } from "react-icons/gi";
import { motion } from "framer-motion";
import axios from "axios";

export default function FacultyNavbar(props) {
   const navigate = useNavigate();
   const [isShownLogoutModal, setIsShownLogoutModal] = React.useState(false);
   const [content, setContent] = React.useState({
      logo: "",
   });

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
         <nav
            className={`${css.fact_navbar_root} navbar navbar-expand-lg navbar-light border-bottom`}>
            <div className="d-flex align-content-center w-100 ps-5 pe-4">
               <motion.a
                  initial={{
                     opacity: !props.isSidebarOpen ? 1 : 0,
                     transform: !props.isSidebarOpen ? "translateX(0px)" : "translateX(-30px)",
                  }}
                  animate={{
                     opacity: !props.isSidebarOpen ? 1 : 0,
                     transform: !props.isSidebarOpen ? "translateX(0px)" : "translateX(-30px)",
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`${css.logo} navbar-brand`}
                  href="/">
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
               </motion.a>

               {/* <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
               </button> */}

               <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto">
                     {/* my profile dropdown */}
                     <li className={`${css.nav_name} nav-item d-flex`}>
                        <img
                           // if profile picture is not set, set it to the default profile picture
                           src={
                              !!props.photoPath
                                 ? props.photoPath
                                 : `/images/profilePictures/no_profile_picture.png`
                           }
                           className={css.profile_pic}
                           alt="profile pic"
                        />
                        <span className="nav-link">Welcome, {props.username}!&nbsp;</span>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>
      </>
   );
}
