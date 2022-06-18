import React from "react";

import css from "./css/DashboardFooter.module.css";
import { GiBrain } from "react-icons/gi";
import axios from "axios";

export default function DashboardFooter() {
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
      <footer className={`${css.footer_root}`}>
         <hr className={css.hr} />
         <div className="d-flex align-items-center justify-content-between">
            <div>
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
            </div>

            <div className={`${css.text_muted}`}>
               This website is for school project purposes only.
            </div>

            <div></div>
         </div>
      </footer>
   );
}
