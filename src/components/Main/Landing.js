import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import css from "./css/Landing.module.css";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { FaArrowRight, FaHandPointUp } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { IoCalendar } from "react-icons/io5";
import { CDBAnimation } from "cdbreact";

export default function Landing() {
   const navigate = useNavigate();
   const [navbarOpened, setNavbarOpened] = React.useState(false);
   const [triggerFeaturesAnim, setTriggerFeaturesAnim] = React.useState(false);

   function login() {
      navigate("/login-register");
   }

   function handleScrollEvent(event) {
      const { scrollTop } = event.target;

      if (scrollTop >= 0 && scrollTop <= 40) {
         setNavbarOpened(false);
      } else if (scrollTop > 0) {
         setNavbarOpened(true);
      }

      if (scrollTop >= 580) {
         setTriggerFeaturesAnim(true);
      }
   }

   React.useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) navigate("/dashboard");
   }, []);

   return (
      <>
         <div className={`${css.landing_root}`} id="home" onScroll={handleScrollEvent}>
            <Navbar navbarOpened={navbarOpened} />
            {/* HERO */}
            <div
               className={css.hero_section}
               style={{ backgroundImage: `url('/images/res/hero-bg.jpg')` }}>
               <div className="container h-100 d-flex align-items-center justify-content-center">
                  {/* hero content */}
                  <div className="d-flex flex-column-reverse flex-lg-row justify-content-between h-auto w-100">
                     {/* text-left */}
                     <div className="d-flex flex-column justify-content-center text-center text-lg-start">
                        <motion.div
                           initial={{ transform: "translateY(-60px)", opacity: 0 }}
                           animate={{ transform: "translateY(0px)", opacity: 1 }}
                           transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                           className="d-flex flex-column align-items-center align-items-lg-start">
                           <h1 className={`text-center text-lg-start ${css.hero_big_text}`}>
                              We provide cutting-edge <br />
                              solutions for expanding <br />
                              your academic experience.
                           </h1>
                           <h5 className={`${css.hero_small_text} mb-5 text-center text-lg-start`}>
                              A web-based online examination system
                           </h5>
                           <button className={`${css.nav_button} btn btn-primary`} onClick={login}>
                              Get Started <FaArrowRight size={16} className="ms-1" />
                           </button>
                        </motion.div>
                     </div>
                     {/* image right */}
                     <motion.div
                        initial={{ transform: "translateY(-60px)", opacity: 0 }}
                        animate={{ transform: "translateY(0px)", opacity: 1 }}
                        transition={{ duration: 1.4, ease: "easeOut", delay: 0.6 }}
                        className="mb-5 mb-lg-0">
                        {/* <CDBAnimation type="pulse" infinite> */}
                        <img
                           src="/images/res/blue.png"
                           className={`${css.hero_image} img-fluid`}
                           alt=""
                        />
                        {/* </CDBAnimation> */}
                     </motion.div>
                  </div>
               </div>
            </div>

            {/* MAIN CONTENT */}
            <main className={`text-center`}>
               <div className="container d-flex flex-column justify-content-center align-items-center">
                  {/* Features */}

                  <section className={`${css.features_container} text-white`}>
                     <div className="container">
                        <div className="row justify-content-center mb-5">
                           <div className="col-xl-6 col-lg-7">
                              <div className="text-center d-flex flex-column align-items-center">
                                 <h1 className="mb-25  wow fadeInUp" data-wow-delay=".2s">
                                    Our Features & Services
                                 </h1>
                                 <p className={css.feature_desc}>
                                    Designed to make your online teaching and learning easier.
                                    Examplify simplifies the process of conducting exams online.
                                 </p>
                                 <div className={`${css.divider} mt-3`}></div>
                              </div>
                           </div>
                        </div>
                        <div className="row justify-content-center my-5">
                           <motion.div
                              initial={{ transform: "translateY(-60px)", opacity: 0 }}
                              animate={{
                                 transform: triggerFeaturesAnim
                                    ? "translateY(0px)"
                                    : "translateY(-30px)",
                                 opacity: triggerFeaturesAnim ? 1 : 0,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="col-lg-4 p-5">
                              <div className="d-flex flex-column align-items-center">
                                 <div
                                    className={`${css.icon_container} d-flex justify-content-center align-items-center mb-4`}>
                                    <FaHandPointUp className={css.icon} />
                                 </div>
                                 <div>
                                    <h3 className="mb-3">User Friendly</h3>
                                    <p className={css.feature_desc}>
                                       With our simple user interface you can create, publish,
                                       answer online exams with ease.
                                    </p>
                                 </div>
                              </div>
                           </motion.div>
                           <motion.div
                              initial={{ transform: "translateY(-60px)", opacity: 0 }}
                              animate={{
                                 transform: triggerFeaturesAnim
                                    ? "translateY(0px)"
                                    : "translateY(-30px)",
                                 opacity: triggerFeaturesAnim ? 1 : 0,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                              className="col-lg-4 p-5">
                              <div className="d-flex flex-column align-items-center">
                                 <div
                                    className={`${css.icon_container} d-flex justify-content-center align-items-center mb-4`}>
                                    <GiReceiveMoney className={css.icon} />
                                 </div>
                                 <div>
                                    <h3 className="mb-3">Save Your Money</h3>
                                    <p className={css.feature_desc}>
                                       It's totally free! Just create an Examplify account and you
                                       can start managing your examinations immediately.
                                    </p>
                                 </div>
                              </div>
                           </motion.div>
                           <motion.div
                              initial={{ transform: "translateY(-60px)", opacity: 0 }}
                              animate={{
                                 transform: triggerFeaturesAnim
                                    ? "translateY(0px)"
                                    : "translateY(-30px)",
                                 opacity: triggerFeaturesAnim ? 1 : 0,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                              className="col-lg-4 p-5">
                              <div className="d-flex flex-column align-items-center">
                                 <div
                                    className={`${css.icon_container} d-flex justify-content-center align-items-center mb-4`}>
                                    <IoCalendar className={css.icon} />
                                 </div>
                                 <div className="content">
                                    <h3 className="mb-3">Manage your Schedule</h3>
                                    <p className={css.feature_desc}>
                                       Schedule your exams whenever you want. Managing your schedule
                                       has never been easier.
                                    </p>
                                 </div>
                              </div>
                           </motion.div>
                        </div>
                     </div>
                  </section>

                  {/*LEARN MORE ABOUT WEBSITE*/}
                  <section className={`${css.learn_more_container}`}>
                     <h4 className="display-5 mb-2">About Us</h4>
                     <div className="container">
                        <div className="row d-flex justify-content-center">
                           {/* <div className="col-lg-6 p-4">
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
                           </div> */}
                           <div className="m-0 d-flex flex-column align-items-center">
                              <p className={`${css.about_us_p1} ${css.feature_desc} m-0`}>
                                 Sed fermentum, felis ut cursus varius, purus velit placerat tortor,
                                 at faucibus elit purus posuere velit. Integer sit amet felis
                                 ligula.
                              </p>
                              <p
                                 className={`${css.about_us_p2} ${css.feature_desc} mt-5 text-start`}>
                                 Sed varius vel ligula non luctus. Donec sagittis rhoncus purus ut
                                 fermentum. Donec volutpat purus quam, tincidunt venenatis risus
                                 tincidunt sed. Curabitur quis risus lorem. Proin consequat mauris
                                 fermentum massa dictum, id molestie turpis pharetra. Suspendisse at
                                 tempus lacus.
                                 <br />
                                 <br />
                                 Sed quis nulla accumsan, cursus diam suscipit, congue sem. Proin
                                 semper augue id ligula convallis, in tincidunt ipsum maximus. Morbi
                                 semper ante in justo feugiat faucibus. Curabitur sollicitudin
                                 tincidunt metus et ullamcorper. Maecenas cursus eleifend dui, id
                                 sagittis erat blandit eu. Morbi sit amet sapien commodo, imperdiet
                                 sapien a, convallis sem. Pellentesque sollicitudin commodo lacinia.
                                 <br />
                                 <br />
                                 Proin aliquam ligula vel ligula pulvinar tincidunt. Suspendisse
                                 potenti. Cras sit amet rutrum erat. Aliquam ultrices blandit
                                 sapien, vitae pulvinar sem tincidunt vitae. Nam ultrices fermentum
                                 nunc et porta. Quisque ullamcorper sapien congue lorem porttitor
                                 volutpat. Donec id felis vitae arcu accumsan consequat. Praesent
                                 nibh urna, viverra vel volutpat vel, mollis eu magna. Praesent
                                 libero magna, volutpat vel ultrices malesuada, rutrum vel elit. In
                                 luctus mi id magna tincidunt aliquet. Sed eu tortor nisl, eu
                                 viverra mauris. Cras pellentesque ultricies volutpat. Sed
                                 fermentum, felis ut cursus varius, purus velit placerat tortor, at
                                 faucibus elit purus posuere velit. Integer sit amet felis ligula.
                              </p>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className={`${css.learn_more_container}`}>
                     <h4 className="display-5 mb-2">Our Team</h4>
                     <div className="container">
                        <div className="row d-flex justify-content-center">
                           {/* <div className="col-lg-6 p-4">
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
                           </div> */}
                           <div className="m-0 d-flex flex-column align-items-center">
                              <p className={`${css.about_us_p1} ${css.feature_desc} m-0`}>
                                 Meet the team behind Examplify
                              </p>
                              <div class="container mt-5">
                                 <div class="row p-3">
                                    <div class={`${css.team_image} col p-0`}>
                                       <div className={css.img_container}></div>
                                       <div className="text-center mt-4 mb-3 p-3">
                                          <h5>Team member 1</h5>
                                          <p className={css.member_role}>Role</p>
                                          <p>
                                             Lorem ipsum dolor sit amet, consectetur adipiscing
                                             elit. Maecenas ac ligula eu justo convallis fringilla.
                                          </p>
                                       </div>
                                    </div>
                                    <div class={`${css.team_image} col p-0`}>
                                       <div className={css.img_container}></div>
                                       <div className="text-center mt-4 mb-3 p-3">
                                          <h5>Team member 2</h5>
                                          <p className={css.member_role}>Role</p>
                                          <p>
                                             Lorem ipsum dolor sit amet, consectetur adipiscing
                                             elit. Maecenas ac ligula eu justo convallis fringilla.
                                          </p>
                                       </div>
                                    </div>
                                    <div class={`${css.team_image} col p-0`}>
                                       <div className={css.img_container}></div>
                                       <div className="text-center mt-4 mb-3 p-3">
                                          <h5>Team member 3</h5>
                                          <p className={css.member_role}>Role</p>
                                          <p>
                                             Lorem ipsum dolor sit amet, consectetur adipiscing
                                             elit. Maecenas ac ligula eu justo convallis fringilla.
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </section>
               </div>
            </main>
            <Footer />
         </div>
      </>
   );
}
