import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import css from "./css/Sidebar.module.css";
import { FaHome, FaBars, FaThLarge, FaRegCalendarAlt, FaUserAlt, FaHistory } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { IoDocumentText } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import StudentNavbar from "../Student/StudentNavbar";
import FacultyNavbar from "../Faculty/FacultyNavbar";
import StudentDashboard from "../Student/StudentDashboard";
import { UserContext } from "../../UserContext";
import jwt_decode from "jwt-decode";
import { saveSidebarState, getSidebarState } from "./utils/StoreSidebarState";

export default function StudentSidebar({ children }) {
   const navigate = useNavigate();
   const [isOpen, setIsOpen] = useState(getSidebarState);
   const { user, setUser } = useContext(UserContext);
   const [isShownLogoutModal, setIsShownLogoutModal] = React.useState(false);
   const [formData, setFormData] = React.useState({
      email: "",
      username: "",
   });

   function toggle() {
      setIsOpen(!isOpen);
      saveSidebarState(!isOpen);
   }

   function handleLogoutModalClose() {
      setIsShownLogoutModal(false);
   }

   const routes = [
      {
         path: "/dashboard",
         name: "Dashboard",
         icon: <AiFillDashboard />,
      },
      {
         path: "/update-profile",
         subPath3: "/change-password",
         name: "Profile",
         icon: <FaUserAlt />,
      },
      {
         path: "/subjects/All",
         subPath: "/subjects",
         subPath2: "/subjects",
         name: "Exams",
         icon: <IoDocumentText />,
      },

      ...(user && user.userType === "student"
         ? [
              {
                 path: "/history",
                 name: "History",
                 icon: <FaHistory />,
              },
           ]
         : []),

      {
         path: "/calendar",
         name: "Calendar",
         icon: <FaRegCalendarAlt />,
      },
   ];

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

   function setIsLinkActive(route) {
      if (window.location.href === `http://localhost:3000${route.path}`) {
         if (isOpen) return css.active_link;
         return css.active_link_closed;
      }

      if (
         route.hasOwnProperty("subPath3") &&
         window.location.href.startsWith(`http://localhost:3000/change-password`)
      ) {
         if (isOpen) return css.active_link;
         return css.active_link_closed;
      }

      if (
         route.hasOwnProperty("subPath") &&
         window.location.href.startsWith(`http://localhost:3000/subjects/`)
      ) {
         if (isOpen) return css.active_link;
         return css.active_link_closed;
      }

      if (
         route.hasOwnProperty("subPath2") &&
         window.location.href.startsWith(`http://localhost:3000/exam-details/`)
      ) {
         if (isOpen) return css.active_link;
         return css.active_link_closed;
      }
   }

   function openLogoutModal() {
      setIsShownLogoutModal(true);
   }

   async function logout() {
      //remove data from local storage
      await localStorage.removeItem("token");
      await localStorage.removeItem("isLoaded");
      // await localStorage.removeItem("userData");
      navigate("/", { replace: true }); //dont store the current page in history
   }

   React.useEffect(() => {
      //get user details from token to set the initial values of the form
      const token = localStorage.getItem("token");
      const userTokenDecoded = jwt_decode(token);
      setUser(userTokenDecoded);
      setFormData({
         email: userTokenDecoded.email,
         username: userTokenDecoded.username,
      });
   }, []);

   return (
      <>
         {getNavbar()}
         <div className={`${css.main_Container}`}>
            <motion.div
               initial={{ width: isOpen ? "300px" : "50px" }}
               animate={{ width: isOpen ? "300px" : "50px" }}
               className={`${css.sidebar} d-flex flex-column justify-content-between`}>
               <div>
                  <div className={`${css.top_Section}`}>
                     {isOpen && <span className={`${css.logo} ms-3`}></span>}
                     <div className={`${css.bars}`}>
                        <FaBars onClick={toggle} className={css.toggleButton} />
                     </div>
                  </div>
                  <section className={`${css.routes}`}>
                     {routes.map((route) => (
                        <NavLink
                           to={route.path}
                           key={route.name}
                           className={` ${setIsLinkActive(route)} ${css.link}`}>
                           <div className={`${css.icon}`}>{route.icon}</div>
                           <div className={`${css.link_text} ${isOpen ? "d-block" : "d-none"}`}>
                              {route.name}
                           </div>
                        </NavLink>
                     ))}
                  </section>
               </div>

               {/* LOGOUT BUTTON */}
               <div className={`${css.link}`} onClick={openLogoutModal}>
                  <div className={`${css.icon}`}>
                     <MdLogout />
                  </div>
                  <div className={`${css.link_text}`}>Logout</div>
               </div>
            </motion.div>
            <main className={`${css.main}`}>{children}</main>
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
      </>
   );
}
