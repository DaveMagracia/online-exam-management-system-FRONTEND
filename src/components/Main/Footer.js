import React from "react";
import css from "./css/Footer.module.css";
import { GiBrain } from "react-icons/gi";
import axios from "axios";

export default function Footer() {
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
         {/* <footer className="text-center text-black">
            <div className="container p-4">
               <section className="mb-4">
                  <h1 className="display-4">ARE YOU READY?</h1>
               </section>

               <section className="mb-4">
                  <button type="button" className="btn btn-outline-primary">
                     Get Started
                  </button>
               </section>
            </div>
         </footer> */}

         <footer className={`${css.footer_root} text-center text-white`}>
            <div className="container p-4">
               <div className="mt-5 d-flex justify-content-center">
                  {content.logo === "ExamplifyLogo.png" ? (
                     <span className={`${css.logo} navbar-brand`} href="/">
                        Ex
                        <GiBrain />
                        mplify
                     </span>
                  ) : (
                     <div className={`${css.logo_container} ms-3`}>
                        <img className={css.logo_image} src={setImgSrc(content.logo)} alt="logo" />
                     </div>
                  )}

                  {/* <span className={`${css.logo} navbar-brand`} href="/">
                     Ex
                     <GiBrain />
                     mplify
                  </span> */}
               </div>

               <section className="mb-4 mt-4">
                  <a className={`${css.footer_link} mx-3 text-decoration-none`} href="#!">
                     LOGIN
                  </a>
                  <a className={`${css.footer_link} mx-3 text-decoration-none`} href="#!">
                     REGISTER
                  </a>
               </section>

               <section className="my-5">
                  <p className={`${css.footer_message}`}>
                     This website is for school project purposes only
                  </p>
                  <p className={`${css.website_link}`}>Examplify.com</p>
               </section>
            </div>
         </footer>
      </>
   );
}
