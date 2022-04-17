import React from "react";
import css from "./css/Footer.module.css";

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
               <section className="mb-4">
                  <a
                     className="btn-floating m-1 text-black text-decoration-none"
                     href="#!"
                     role="button">
                     Features
                  </a>
                  <span className="text-black">|</span>
                  <a
                     className="btn-floating m-1 text-black text-decoration-none"
                     href="#!"
                     role="button">
                     About
                  </a>
                  <span className="text-black">|</span>
                  <a
                     className="btn-floating m-1 text-black text-decoration-none"
                     href="#!"
                     role="button">
                     Start
                  </a>
               </section>

               <section className="my-5">
                  <p className="text-black m-0">Bulacan State University</p>
                  <p className="text-black">Website's Name</p>
               </section>
            </div>
         </footer>
      </>
   );
}
