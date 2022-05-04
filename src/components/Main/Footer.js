import React from "react";
import css from "./css/Footer.module.css";
import { GiBrain } from "react-icons/gi";
export default function Footer() {
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
               <div className="mt-5">
                  <span className={`${css.logo} navbar-brand`} href="/">
                     Ex
                     <GiBrain />
                     mplify
                  </span>
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
