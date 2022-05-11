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
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export default function Landing() {
   const navigate = useNavigate();
   const [navbarOpened, setNavbarOpened] = React.useState(false);
   const [triggerFeaturesAnim, setTriggerFeaturesAnim] = React.useState(false);

   function goToLogin() {
      navigate("/login-register", { state: { name: "login" } });
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
                           <button
                              className={`${css.nav_button} btn btn-primary`}
                              onClick={goToLogin}>
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
                  <section
                     className={`${css.learn_more_container} d-flex flex-column justify-content-center pt-5`}>
                     <h4 className="display-5 mb-2">About our website</h4>
                     <div className="container">
                        <div className="row d-flex justify-content-center ">
                           <div
                              className={`${css.about_us_container} m-0 d-flex flex-column align-items-center`}>
                              <p className={`${css.about_us_p1} ${css.feature_desc} m-0`}>
                                 Welcome to Examplify! We make online examinations easier!
                              </p>
                              <p
                                 className={`${css.about_us_p2} ${css.feature_desc} mt-5 text-start`}>
                                 Nowadays, people are more dependent on online products and
                                 services, and even more during and after the pandemic. Since then,
                                 almost every daily activities are conducted online. People have
                                 started adapting technology to their lives even more. That is why
                                 we built a website that provides service for online learning
                                 particulary in conducting online examinations.
                                 <br />
                                 <br />
                                 Students today have adapted to the online learning setup, so we
                                 wanted them at least to make their online learning easier and
                                 enjoyable, especially to those who are not very literate when it
                                 comes to the latest technologies. Same applies to the side of the
                                 teachers. It is has not been very easy for all of us. Teachers need
                                 to work twice as hard only to share their knowledge for their
                                 students and at the same time, they needed to adapt to the new mode
                                 of teaching as online teaching is new almost to every teachers out
                                 there. With this website, we hope that it would make online
                                 learning a lot more enjoyable
                              </p>
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className={`${css.our_team_container}`}>
                     <h4 className="display-5 mb-2">Our Team</h4>
                     <div className="container">
                        <div className="row d-flex justify-content-center">
                           <div className="m-0 d-flex flex-column align-items-center">
                              <p className={`${css.about_us_p1} ${css.feature_desc} m-0`}>
                                 Meet the team behind Examplify
                              </p>
                              <div className="container mt-5">
                                 <CarouselProvider
                                    totalSlides={2}
                                    naturalSlideWidth={100}
                                    naturalSlideHeight={125}
                                    className="d-flex align-items-center">
                                    <ButtonBack
                                       className={`${css.carousel_btn} btn btn-primary me-2`}>
                                       <IoMdArrowDropleft className={css.carousel_btn_icon_left} />
                                    </ButtonBack>

                                    <Slider className={css.slider_container}>
                                       <Slide index={0}>
                                          <div className="d-flex">
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img src="/images/res/Marleigh1.jpg" alt="" />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Mereniza Marleigh Tolentino</h5>
                                                   <p className={css.member_role}>Project Leader</p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img src="/images/res/Alliah1.jpg" alt="" />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Alliah Baluyut</h5>
                                                   <p className={css.member_role}>
                                                      Frontend Developer
                                                   </p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img src="/images/res/Josie1.jpg" alt="" />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Josie De Jesus</h5>
                                                   <p className={css.member_role}>UI/UX Designer</p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                          </div>
                                       </Slide>
                                       <Slide index={1}>
                                          <div className="d-flex">
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img src="/images/res/Jhezmark1.jpg" alt="" />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Jhezmark Hernandez</h5>
                                                   <p className={css.member_role}>
                                                      Lead Programmer
                                                   </p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img src="/images/res/Peter1.jpg" alt="" />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Peter Paul Briones</h5>
                                                   <p className={css.member_role}>
                                                      Backend Developer
                                                   </p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                             <div className={`${css.team_image} col p-0`}>
                                                <div className={css.img_container}>
                                                   <img
                                                      src="/images/res/Dave1.jpg"
                                                      alt=""
                                                      className={css.img_dave}
                                                   />
                                                </div>
                                                <div className={`${css.lower_sec} text-start mb-3`}>
                                                   <h5>Marc David Magracia</h5>
                                                   <p className={css.member_role}>
                                                      Lead Programmer
                                                   </p>
                                                   {/* <p>
                                                      Lorem ipsum dolor sit amet, consectetur
                                                      adipiscing elit. Maecenas ac ligula eu justo
                                                      convallis fringilla.
                                                   </p> */}
                                                </div>
                                             </div>
                                          </div>
                                       </Slide>
                                    </Slider>

                                    <ButtonNext
                                       className={`${css.carousel_btn} btn btn-primary ms-2`}>
                                       <IoMdArrowDropright
                                          className={css.carousel_btn_icon_right}
                                       />
                                    </ButtonNext>
                                 </CarouselProvider>
                                 {/* <div className="row p-3">
                                    <div className={`${css.team_image} col p-0`}>
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
                                    <div className={`${css.team_image} col p-0`}>
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
                                    <div className={`${css.team_image} col p-0`}>
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
                                 </div> */}
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
