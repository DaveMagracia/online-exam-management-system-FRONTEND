import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Main/Login";
import Register from "./components/Main/Register";
import Landing from "./components/Main/Landing";
import Main from "./components/Main/Main";
import PageNotFound404 from "./components/Main/PageNotFound404";
import UpdateProfile from "./components/Main/UpdateProfile";
import ChangePassword from "./components/Main/ChangePassword";
import Subjects from "./components/Faculty/Subjects";

//FACULTY COMPONENTS
import ExamDetails from "./components/Faculty/ExamDetails";
import QuestionBankDetails from "./components/Faculty/QuestionBankDetails";
import CreateQuestionBank from "./components/Faculty/CreateQuestionBank";
import AddQuestion from "./components/Faculty/AddQuestion";
import CreateExam from "./components/Faculty/CreateExam";

import { UserContext } from "./UserContext";

import "./App.css";

export default function App() {
   const [user, setUser] = React.useState();

   return (
      <UserContext.Provider value={{ user, setUser }}>
         <Router>
            <Routes>
               <Route path="/" element={<Landing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Main />} />
               {/* editing and creating exams have the same UI, the reason why the
               same component is used */}
               <Route path="/create-exam" element={<CreateExam />} />
               <Route path="/edit-exam/:exam_id" element={<CreateExam />} />
               <Route path="/subjects/:subject_name" element={<Subjects />} />
               <Route path="/exam-details/:exam_id" element={<ExamDetails />} />
               <Route
                  path="/question-bank/:bank_id"
                  element={<QuestionBankDetails />}
               />
               <Route path="/create-bank" element={<CreateQuestionBank />} />
               <Route
                  path="/edit-question-bank/:bank_id"
                  element={<CreateQuestionBank />}
               />

               <Route path="/update-profile" element={<UpdateProfile />} />
               <Route path="/change-password" element={<ChangePassword />} />

               {/* /f url has no match, display 404 page*/}
               <Route path="*" element={<PageNotFound404 />} />
            </Routes>
         </Router>
      </UserContext.Provider>
   );
}
