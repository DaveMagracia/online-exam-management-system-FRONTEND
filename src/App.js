import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//PUBLIC COMPONENTS
import Login from "./components/Main/Login";
import Register from "./components/Main/Register";
import Landing from "./components/Main/Landing";

//BOTH COMPONENTS
import Main from "./components/Both/Main";
import PageNotFound404 from "./components/Main/PageNotFound404";
import UpdateProfile from "./components/Both/UpdateProfile";
import ChangePassword from "./components/Both/ChangePassword";
import Subjects from "./components/Both/Subjects";
import ExamDetails from "./components/Both/ExamDetails";

//FACULTY COMPONENTS
import QuestionBankDetails from "./components/Faculty/QuestionBankDetails";
import CreateQuestionBank from "./components/Faculty/CreateQuestionBank";
import CreateExam from "./components/Faculty/CreateExam";

//STUDENT COMPONETS
import TakeExam from "./components/Student/TakeExam";
import ExamResults from "./components/Student/ExamResults";

import { UserContext } from "./UserContext";

import "./App.css";

export default function App() {
   const [user, setUser] = React.useState();

   return (
      <UserContext.Provider value={{ user, setUser }}>
         <Router>
            <Routes>
               {/* PUBLIC ROUTES */}
               <Route path="/" element={<Landing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />

               {/* FACULTY ROUTES */}
               <Route path="/create-exam" element={<CreateExam />} />
               <Route path="/edit-exam/:exam_id" element={<CreateExam />} />
               <Route path="/create-bank" element={<CreateQuestionBank />} />
               <Route path="/edit-question-bank/:bank_id" element={<CreateQuestionBank />} />
               <Route path="/question-bank/:bank_id" element={<QuestionBankDetails />} />

               {/* STUDENT ROUTES */}
               <Route path="/take-exam" element={<TakeExam />} />
               <Route path="/take-exam/results" element={<ExamResults />} />

               {/* BOTH ROUTES */}
               <Route path="/dashboard" element={<Main />} />
               <Route path="/update-profile" element={<UpdateProfile />} />
               <Route path="/change-password" element={<ChangePassword />} />
               <Route path="/exam-details/:exam_id" element={<ExamDetails />} />
               <Route path="/subjects/:subject_name" element={<Subjects />} />

               {/* /f url has no match, display 404 page*/}
               <Route path="*" element={<PageNotFound404 />} />
            </Routes>
         </Router>
      </UserContext.Provider>
   );
}
