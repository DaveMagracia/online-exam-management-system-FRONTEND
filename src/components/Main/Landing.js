import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import css from "./css/Landing.module.css";
import Footer from "./Footer";

export default function Landing() {
   const navigate = useNavigate();

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) navigate("/dashboard");
   }, []);

   return (
      <>
         <Navbar />
         <div
            className={`${css.landing_root} d-flex flex-column align-items-center justify-content-center`}>
            <div>
               <h1 className="display-1">Landing Page</h1>
               <h1 className="lead text-center">Hero section goes here ...</h1>
            </div>
         </div>
         <main className="text-center text-black">
            <div className="container p-4">
               {/* Features */}

               <section className="feature_section pt-80" data-scroll-index="1">
                  <div className="container">
                     <div className="row justify-content-center mb-5">
                        <div className="col-xl-6 col-lg-7">
                           <div className="section_title text-center mb-30">
                              <h1 className="mb-25  wow fadeInUp" data-wow-delay=".2s">
                                 Awsome <span> Features</span>
                              </h1>
                              <p className="wow fadeInUp" data-wow-delay=".4s">
                                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
                                 error enim perspiciatis iste dignissimos tempore?
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="row justify-content-center my-5">
                        <div className="col-lg-4 p-5">
                           <div
                              className="single_feature wow fadeInUp"
                              data-wow-duration="3s"
                              data-wow-delay="0.2s">
                              <div className="icon color-1">
                                 <i className="fas fa-hand-pointer"></i>
                              </div>
                              <div className="content">
                                 <h3>Easy To Use</h3>
                                 <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus
                                    sequi pariatur qui ut dolore excepturi!
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="col-lg-4 p-5">
                           <div
                              className={`${css.single_feature}  wow fadeInUp data-wow-duration=3s data-wow-delay=0.4s`}>
                              <div className="icon color-2">
                                 <i className="fas fa-hand-holding-usd"></i>
                              </div>
                              <div className="content">
                                 <h3>Save Your Mony</h3>
                                 <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus
                                    sequi pariatur qui ut dolore excepturi!
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className="col-lg-4 p-5">
                           <div
                              className="single-feature wow fadeInUp"
                              data-wow-duration="3s"
                              data-wow-delay="0.6s">
                              <div className="icon color-3">
                                 <i className="fas fa-stethoscope"></i>
                              </div>
                              <div className="content">
                                 <h3>Fully Responsive</h3>
                                 <p>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus
                                    sequi pariatur qui ut dolore excepturi!
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               {/*LEARN MORE ABOUT WEBSITE*/}
               <section>
                  <h1 className="display-4 mb-4">Learn More About Website</h1>
                  <div className="container">
                     <div className="row d-flex justify-content-center">
                        <div className="col-lg-6 p-4">
                           <div className="img-fluid">
                              <img alt="" height="300px" width="300px" />
                           </div>
                           <button
                              type="button"
                              className="btn btn-outline-primary title-sm mt-3 mb-3">
                              Continue as Student
                           </button>
                        </div>
                        <div className="col-lg-6 p-4">
                           <div className="img-fluid animated">
                              <img alt="" height="300px" width="300px" />
                           </div>
                           <button
                              type="button"
                              className="btn btn-outline-primary justify-content-center title-sm mt-3 mb-3">
                              Continue as Teacher
                           </button>
                        </div>
                        <div className="mt-4">
                           <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam
                              velit
                           </p>
                           <p>vulputate eu pharetra nec, mattis ac neque</p>
                        </div>
                     </div>
                  </div>
               </section>

               <section className="mb-4"></section>
            </div>
         </main>
         <div>
            <Footer />
         </div>
      </>
   );
}
