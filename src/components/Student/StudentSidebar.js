import React, { useContext } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import css from "./css/StudentSidebar.module.css";
import { FaHome, FaBars, FaThLarge, FaRegCalendarAlt, FaUserAlt, FaHistory } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import StudentDashboard from "./StudentDashboard";
import { UserContext } from "../../UserContext";
import jwt_decode from "jwt-decode";

const routes = [
   {
      path: "/",
      name: "Dashboard",
      icon: <FaThLarge />,
   },
   {
      path: "/update-profile",
      name: "Profile",
      icon: <FaUserAlt />,
   },

   {
      path: "/update-profile",
      name: "History",
      icon: <FaHistory />,
   },

   {
      path: "/StudentCalendar",
      name: "Calendar",
      icon: <FaRegCalendarAlt />,
   },
];

export default function StudentSidebar({ children }) {
   const [isOpen, setIsOpen] = useState(false);
   const { user, setUser } = useContext(UserContext);
   const [formData, setFormData] = React.useState({
      email: "",

      username: "",
   });

   const toggle = () => setIsOpen(!isOpen);

   function getNavbar() {
      // identifies what type of navbar to be displayed
      if (user) {
         if (user.userType === "student") {
            return <StudentNavbar username={user.username} />;
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
         <div className={`${css.main_Container}`}>
            <motion.div animate={{ width: isOpen ? "200px" : "50px" }} className={`${css.sidebar}`}>
               <div className={`${css.top_Section}`}>
                  {isOpen && <h1 className={`${css.logo}`}></h1>}
                  <div className={`${css.bars}`}>
                     <FaBars onClick={toggle} />
                  </div>
               </div>
               <section className={`${css.routes}`}>
                  {routes.map((route) => (
                     <NavLink to={route.path} key={route.name} className={`${css.link}`}>
                        <div className={`${css.icon}`}>{route.icon}</div>
                        <div className={`${css.link_text}`}>{route.name}</div>
                     </NavLink>
                  ))}
               </section>
            </motion.div>
            <main className={`${css.main}`}>{children}</main>
         </div>
      </>
   );
}
