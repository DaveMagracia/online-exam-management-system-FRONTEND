import React from "react";
import css from "./css/AdminDashboard.module.css";
// import StudentNavbar from "./StudentNavbar";
import Sidebar from "../Both/Sidebar";
import SubjectList from "../Both/SubjectList";
import { GiBrain } from "react-icons/gi";
import DashboardFooter from "../Both/DashboardFooter";
import axios from "axios";
import FileBase64 from "react-file-base64";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function AdminDashboard(props) {
   const [formData, setFormData] = React.useState({
      image: "",
      title: "",
      announcements: "",
      vision: "",
      mission: "",
      isVisionEnabled: true,
      isMissionEnabled: true,
      isGoEnabled: true,
      go: "",
   });

   const [emptyErrors, setEmptyErrors] = React.useState({
      image: false,
      announcements: false,
      title: false,
      vision: false,
      mission: false,
      go: false,
   });

   const [errors, setErrors] = React.useState({
      image: { hasError: false, msg: "Invalid Image" },
      title: { hasError: false, msg: "Invalid Title" },
      announcements: { hasError: false, msg: "Invalid Announcement" },
      vision: { hasError: false, msg: "Invalid Vision" },
      mission: { hasError: false, msg: "Invalid Mission" },
      go: { hasError: false, msg: "Invalid Goals and Objectives" },
   });

   const [loading, setLoading] = React.useState(false);
   const [isShownSuccess, setIsShownSuccess] = React.useState(false);
   const [isShownError, setIsShownError] = React.useState(false);
   const [logoImage, setLogoImage] = React.useState("");
   const [editorStateVision, setEditorStateVision] = React.useState(EditorState.createEmpty());
   const [editorStateAnnouncement, setEditorStateAnnouncement] = React.useState(
      EditorState.createEmpty()
   );
   const [editorStateMission, setEditorStateMission] = React.useState(EditorState.createEmpty());
   const [editorStateGo, setEditorStateGo] = React.useState(EditorState.createEmpty());

   function handleOnChange(event) {
      const { name, value } = event.target;
      //remove error to the field that was changed
      setEmptyErrors((prevValue) => ({
         ...prevValue,
         [name]: false,
      }));

      //set the new value to the formData
      setFormData((prevFormData) => {
         return {
            ...prevFormData,
            [name]: value,
         };
      });
   }

   function validateForm() {
      let tempErrors = { ...emptyErrors };

      console.log(formData);
      // tempErrors.question = formData.question ? false : true;
      tempErrors.title = formData.title ? false : true;
      tempErrors.announcements = formData.announcements ? false : true;
      tempErrors.vision = formData.vision === `<p></p>\n` ? true : false;
      tempErrors.mission = formData.mission === `<p></p>\n` ? true : false;
      tempErrors.go = formData.go === `<p></p>\n` ? true : false;

      let hasError_ = Object.keys(tempErrors).some((k) => tempErrors[k] === true);

      setEmptyErrors(tempErrors);
      // setHasError(hasError_);

      if (hasError_) {
         let element = "";
         for (let key in emptyErrors) {
            console.log(tempErrors[key]);
            if (tempErrors[key]) {
               console.log("key", key);
               element = key;
               break;
            }
         }

         let firstError = document.getElementsByName(element)[0];

         if (firstError) {
            firstError.scrollIntoView({
               behavior: "smooth",
               block: "center",
               inline: "start",
            });
         }
      }

      if (hasError_) {
         return false;
      }

      return true;
   }

   async function getWebsiteContents() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/admin/content`,
         data: formData,
      })
         .then((res) => {
            document.title = `Admin Dashboard | ${res.data.contents.title}`;

            setFormData((prevVal) => ({
               ...prevVal,
               title: res.data.contents.title,
               vision: res.data.contents.vision,
               announcements: res.data.contents.announcements,
               mission: res.data.contents.mission,
               go: res.data.contents.go,
               image: res.data.contents.logo,
               isVisionEnabled: res.data.contents.isVisionEnabled,
               isMissionEnabled: res.data.contents.isMissionEnabled,
               isGoEnabled: res.data.contents.isGoEnabled,
            }));

            setLogoImage(
               !!res.data.contents.logo && `/images/profilePictures/${res.data.contents.logo}`
            );

            setEditorStateAnnouncement(
               EditorState.createWithContent(
                  ContentState.createFromBlockArray(
                     convertFromHTML(res.data.contents.announcements)
                  )
               )
            );

            setEditorStateVision(
               EditorState.createWithContent(
                  ContentState.createFromBlockArray(convertFromHTML(res.data.contents.vision))
               )
            );

            setEditorStateMission(
               EditorState.createWithContent(
                  ContentState.createFromBlockArray(convertFromHTML(res.data.contents.mission))
               )
            );

            setEditorStateGo(
               EditorState.createWithContent(
                  ContentState.createFromBlockArray(convertFromHTML(res.data.contents.go))
               )
            );
         })
         .catch((err) => {
            console.log(err);
         });
   }

   function setDefault(type) {
      var formFile = document.getElementById("formFile");
      formFile.value = null;

      setFormData((prevVal) => ({
         ...prevVal,
         image: "ExamplifyLogo.png",
      }));

      setLogoImage(`/images/profilePictures/ExamplifyLogo.png`);
   }

   async function submitForm(event) {
      event.preventDefault();

      if (validateForm()) {
         setLoading(true);

         const formData_ = new FormData();
         formData_.append("title", formData.title);
         formData_.append("announcements", formData.announcements);
         formData_.append("vision", formData.vision);
         formData_.append("mission", formData.mission);
         formData_.append("go", formData.go);
         formData_.append("image", formData.image);
         formData_.append("isVisionEnabled", formData.isVisionEnabled);
         formData_.append("isMissionEnabled", formData.isMissionEnabled);
         formData_.append("isGoEnabled", formData.isGoEnabled);
         console.log(formData);

         await axios({
            method: "PUT",
            headers: {
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            baseURL: `http://localhost:5000/admin/update-content`,
            data: formData_,
         })
            .then((data) => {
               setTimeout(() => {
                  setLoading(false);
                  setIsShownSuccess(true);
                  window.scrollTo({
                     top: 0,
                     left: 0,
                     behavior: "smooth",
                  });
               }, 2000);
               window.location.reload();
            })
            .catch((err) => {
               // console.log("ERROR: ", err);
               setTimeout(() => {
                  setLoading(false);
                  setIsShownError(true);
               }, 2000);
            });
      }
   }

   function handleOnChangePhoto(event) {
      setFormData((prevVal) => ({
         ...prevVal,
         image: event.target.files[0],
      }));

      //preview chosen image NOT UPLOAD
      setLogoImage(URL.createObjectURL(event.target.files[0]));
   }

   function handleRichTextChangeVision(newValue) {
      setEmptyErrors((prevVal) => ({
         ...prevVal,
         vision: false,
      }));

      setFormData((prevVal) => ({
         ...prevVal,
         vision: newValue,
      }));
   }

   function handleRichTextChangeAnnouncement(newValue) {
      setEmptyErrors((prevVal) => ({
         ...prevVal,
         announcements: false,
      }));

      setFormData((prevVal) => ({
         ...prevVal,
         announcements: newValue,
      }));
   }

   function handleRichTextChangeMission(newValue) {
      setEmptyErrors((prevVal) => ({
         ...prevVal,
         mission: false,
      }));

      setFormData((prevVal) => ({
         ...prevVal,
         mission: newValue,
      }));
   }

   function handleRichTextChangeGo(newValue) {
      setEmptyErrors((prevVal) => ({
         ...prevVal,
         go: false,
      }));

      setFormData((prevVal) => ({
         ...prevVal,
         go: newValue,
      }));
   }

   function onCheckChange(type) {
      setFormData((prevVal) => ({
         ...prevVal,
         [type]: !prevVal[type],
      }));
   }

   React.useEffect(() => {
      handleRichTextChangeAnnouncement(
         draftToHtml(convertToRaw(editorStateAnnouncement.getCurrentContent()))
      );
   }, [editorStateAnnouncement]);

   React.useEffect(() => {
      handleRichTextChangeVision(draftToHtml(convertToRaw(editorStateVision.getCurrentContent())));
   }, [editorStateVision]);

   React.useEffect(() => {
      handleRichTextChangeMission(
         draftToHtml(convertToRaw(editorStateMission.getCurrentContent()))
      );
   }, [editorStateMission]);

   React.useEffect(() => {
      handleRichTextChangeGo(draftToHtml(convertToRaw(editorStateGo.getCurrentContent())));
   }, [editorStateGo]);

   React.useEffect(() => {
      getWebsiteContents();
   }, []);

   // React.useEffect(() => {
   //    console.log(formData);
   // });

   return (
      <>
         <Sidebar>
            <div
               className={`${css.stud_dashboard_root} d-flex flex-column justify-content-between ps-md-4 py-4 pe-4`}>
               <div>
                  <div className="d-flex flex-column bg-white card">
                     <h5 className={`${css.dashboard_title} m-0 p-3 ps-4 text-light`}>
                        Current Website Contents
                     </h5>
                     {/* <hr className="m-0" /> */}
                  </div>
                  <form
                     className={`${css.updateProfile_form_root} d-flex flex-column p-4 px-5 mt-4 bg-white border`}
                     onSubmit={submitForm}
                     encType="multipart/form-data">
                     <div className="d-flex flex-column mt-3">
                        {isShownSuccess && (
                           <div
                              className="alert alert-success alert-dismissible fade show"
                              role="alert">
                              Website content updated.
                              <button
                                 type="button"
                                 className="btn-close"
                                 onClick={() => setIsShownSuccess(false)}
                                 data-bs-dismiss="alert"
                                 aria-label="Close"></button>
                           </div>
                        )}

                        <h3>Logo</h3>
                        <div className={css.logo_container}>
                           <img
                              className={`${css.logo_image}`}
                              src={!!logoImage ? logoImage : `/images/res/logo.png`}
                              alt="..."
                           />
                        </div>
                        <div
                           className={`${css.file_input} mb-5 mt-3 d-flex justify-content-between align-items-center`}>
                           <input
                              className="form-control form-control-sm w-50"
                              accept=".png, .jpg, .jpeg"
                              type="file"
                              name="image"
                              filename="image"
                              id="formFile"
                              onChange={handleOnChangePhoto}
                           />
                           {/* <FileBase64
                              // className="form-control form-control-sm"
                              // accept=".png, .jpg, .jpeg"
                              // type="file"
                              multiple={false}
                              onDone={({ base64 }) =>
                                 setFormData({
                                    ...formData,
                                    image: base64,
                                 })
                              }
                           /> */}

                           <span
                              className={`${css.setdefault_text} link-primary`}
                              onClick={() => {
                                 setDefault("image");
                              }}>
                              Set Default Logo
                           </span>
                        </div>

                        <h3>Website Title</h3>
                        <div className="w-100 my-1">
                           {/* <label htmlFor="subject" className="me-3 mb-1">
                           Subject:
                        </label> */}
                           <div className="input-group">
                              <input
                                 id="title"
                                 type="text"
                                 name="title"
                                 value={formData.title}
                                 className={`form-control ${
                                    errors.title.hasError || emptyErrors.title
                                       ? "border border-danger"
                                       : "mb-5"
                                 }`}
                                 placeholder="Website Title"
                                 onChange={handleOnChange}
                              />
                           </div>
                        </div>
                        {errors.title.hasError && (
                           <p className="text-danger mb-5 small">{errors.title.msg}</p>
                        )}
                        {emptyErrors.title && (
                           <p className="text-danger mb-5 small">This field is required</p>
                        )}

                        <div className="d-flex justify-content-between">
                           <h3>Announcements</h3>
                        </div>
                        <div
                           className={`form-control w-100 ${
                              errors.announcements.hasError || emptyErrors.announcements
                                 ? "border border-danger"
                                 : "mb-5"
                           }`}
                           name="announcements">
                           {/* <label htmlFor="subject" className="me-3 mb-1">
                           Subject:
                        </label> */}
                           {/* ORIGINAL */}
                           {/* <div className="input-group">
                              <input
                                 id="vision"
                                 type="text"
                                 name="vision"
                                 value={formData.vision}
                                 className={`form-control ${
                                    errors.vision.hasError || emptyErrors.vision
                                       ? "border border-danger"
                                       : "mb-5"
                                 }`}
                                 placeholder="Vision"
                                 onChange={handleOnChange}
                              />
                           </div> */}

                           <Editor
                              editorState={editorStateAnnouncement}
                              wrapperClassName={`${css.wrapper} ${props.isError && css.error}`}
                              toolbarClassName={css.toolbarWrapper}
                              editorClassName={css.editorWrapper}
                              onEditorStateChange={setEditorStateAnnouncement}
                              // toolbar={{
                              //    //specify which toolbar buttons are included
                              //    options: [
                              //       "inline",
                              //       "blockType",
                              //       "fontSize",
                              //       "list",
                              //       "textAlign",
                              //       "link",
                              //       "image",
                              //    ],
                              // }}
                           />
                        </div>

                        {errors.announcements.hasError && (
                           <p className="text-danger mb-5 small">{errors.announcements.msg}</p>
                        )}
                        {emptyErrors.announcements && (
                           <p className="text-danger mb-5 small">This field is required</p>
                        )}

                        <div className="d-flex justify-content-between">
                           <h3>Vision</h3>
                           <div>
                              <label className={`${css.switch} ms-5`}>
                                 <input
                                    type="checkbox"
                                    onChange={() => onCheckChange("isVisionEnabled")}
                                    checked={formData.isVisionEnabled}
                                 />
                                 <span className={`${css.slider} ${css.round}`}></span>
                              </label>
                              <span
                                 className={`${css.toggle_results_label} ms-2`}
                                 onClick={() => onCheckChange("isVisionEnabled")}>
                                 Show on landing page
                              </span>
                           </div>
                        </div>
                        <div
                           className={`form-control w-100 ${
                              errors.vision.hasError || emptyErrors.vision
                                 ? "border border-danger"
                                 : "mb-5"
                           }`}
                           name="vision">
                           {/* <label htmlFor="subject" className="me-3 mb-1">
                           Subject:
                        </label> */}
                           {/* ORIGINAL */}
                           {/* <div className="input-group">
                              <input
                                 id="vision"
                                 type="text"
                                 name="vision"
                                 value={formData.vision}
                                 className={`form-control ${
                                    errors.vision.hasError || emptyErrors.vision
                                       ? "border border-danger"
                                       : "mb-5"
                                 }`}
                                 placeholder="Vision"
                                 onChange={handleOnChange}
                              />
                           </div> */}

                           <Editor
                              editorState={editorStateVision}
                              wrapperClassName={`${css.wrapper} ${props.isError && css.error}`}
                              toolbarClassName={css.toolbarWrapper}
                              editorClassName={css.editorWrapper}
                              onEditorStateChange={setEditorStateVision}
                              // toolbar={{
                              //    //specify which toolbar buttons are included
                              //    options: [
                              //       "inline",
                              //       "blockType",
                              //       "fontSize",
                              //       "list",
                              //       "textAlign",
                              //       "link",
                              //       "image",
                              //    ],
                              // }}
                           />
                        </div>

                        {errors.vision.hasError && (
                           <p className="text-danger mb-5 small">{errors.vision.msg}</p>
                        )}
                        {emptyErrors.vision && (
                           <p className="text-danger mb-5 small">This field is required</p>
                        )}

                        <div className="d-flex justify-content-between">
                           <h3>Mission</h3>
                           <div>
                              <label className={`${css.switch} ms-5`}>
                                 <input
                                    type="checkbox"
                                    onChange={() => onCheckChange("isMissionEnabled")}
                                    checked={formData.isMissionEnabled}
                                 />
                                 <span className={`${css.slider} ${css.round}`}></span>
                              </label>
                              <span
                                 className={`${css.toggle_results_label} ms-2`}
                                 onClick={() => onCheckChange("isMissionEnabled")}>
                                 Show on landing page
                              </span>
                           </div>
                        </div>

                        <div
                           className={`form-control w-100 ${
                              errors.mission.hasError || emptyErrors.mission
                                 ? "border border-danger"
                                 : "mb-5"
                           }`}
                           name="mission">
                           {/* <label htmlFor="subject" className="me-3 mb-1">
                           Subject:
                        </label> */}
                           {/* <div className="input-group">
                              <input
                                 id="mission"
                                 type="text"
                                 name="mission"
                                 value={formData.mission}
                                 className={`form-control ${
                                    errors.mission.hasError || emptyErrors.mission
                                       ? "border border-danger"
                                       : "mb-5"
                                 }`}
                                 placeholder="Mission"
                                 onChange={handleOnChange}
                              />
                           </div> */}

                           <Editor
                              editorState={editorStateMission}
                              wrapperClassName={`${css.wrapper} ${props.isError && css.error}`}
                              toolbarClassName={css.toolbarWrapper}
                              editorClassName={css.editorWrapper}
                              onEditorStateChange={setEditorStateMission}
                              // toolbar={{
                              //    //specify which toolbar buttons are included
                              //    options: [
                              //       "inline",
                              //       "blockType",
                              //       "fontSize",
                              //       "list",
                              //       "textAlign",
                              //       "link",
                              //       "image",
                              //    ],
                              // }}
                           />
                        </div>
                        {errors.mission.hasError && (
                           <p className="text-danger mb-5 small">{errors.mission.msg}</p>
                        )}
                        {emptyErrors.mission && (
                           <p className="text-danger mb-5 small">This field is required</p>
                        )}

                        <div className="d-flex justify-content-between">
                           <h3>Goals and Objectives</h3>
                           <div>
                              <label className={`${css.switch} ms-5`}>
                                 <input
                                    type="checkbox"
                                    onChange={() => onCheckChange("isGoEnabled")}
                                    checked={formData.isGoEnabled}
                                 />
                                 <span className={`${css.slider} ${css.round}`}></span>
                              </label>
                              <span
                                 className={`${css.toggle_results_label} ms-2`}
                                 onClick={() => onCheckChange("isGoEnabled")}>
                                 Show on landing page
                              </span>
                           </div>
                        </div>
                        <div
                           className={`form-control w-100 ${
                              errors.go.hasError || emptyErrors.go ? "border border-danger" : "mb-5"
                           }`}
                           name="go">
                           {/* <label htmlFor="subject" className="me-3 mb-1">
                           Subject:
                        </label> */}
                           {/* <div className="input-group">
                              <input
                                 id="go"
                                 type="text"
                                 name="go"
                                 value={formData.go}
                                 className={`form-control ${
                                    errors.go.hasError || emptyErrors.go
                                       ? "border border-danger"
                                       : "mb-5"
                                 }`}
                                 placeholder="Goals and Objectives"
                                 onChange={handleOnChange}
                              />
                           </div> */}

                           <Editor
                              editorState={editorStateGo}
                              wrapperClassName={`${css.wrapper} ${props.isError && css.error}`}
                              toolbarClassName={css.toolbarWrapper}
                              editorClassName={css.editorWrapper}
                              onEditorStateChange={setEditorStateGo}
                              // toolbar={{
                              //    //specify which toolbar buttons are included
                              //    options: [
                              //       "inline",
                              //       "blockType",
                              //       "fontSize",
                              //       "list",
                              //       "textAlign",
                              //       "link",
                              //       "image",
                              //    ],
                              // }}
                           />
                        </div>
                        {errors.go.hasError && (
                           <p className="text-danger mb-5 small">{errors.go.msg}</p>
                        )}
                        {emptyErrors.go && (
                           <p className="text-danger mb-5 small">This field is required</p>
                        )}

                        <button
                           type="submit"
                           className={`${css.submit_btn} btn btn-primary float-end mb-4`}
                           disabled={loading}>
                           {loading ? (
                              <>
                                 <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"></span>
                                 Updating...
                              </>
                           ) : (
                              <>Submit</>
                           )}
                        </button>
                     </div>
                  </form>
               </div>
               <DashboardFooter />
               {/* <footer className={`${css.footer_root} text-center text-white`}>
                  <div className="container p-4">
                     <div className="mt-5">
                        <span className={`${css.logo} navbar-brand`} href="/">
                           Ex
                           <GiBrain />
                           mplify
                        </span>
                     </div>
                  </div>
               </footer> */}
            </div>
         </Sidebar>
      </>
   );
}
