import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Main/Login";
import Register from "./components/Main/Register";
import Landing from "./components/Main/Landing";
import Main from "./components/Main/Main";
import PageNotFound404 from "./components/Main/PageNotFound404";
import ExamDetails from "./components/Faculty/ExamDetails";
import QuestionBankDetails from "./components/Faculty/QuestionBankDetails";
import AddExamQuestion from "./components/Faculty/AddExamQuestion";
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
               <Route
                  path="/edit-exam/:exam_id"
                  element={<CreateExam />}
               />{" "}
               {/* editing and creating exams have the same UI, the reason why the
               same component is used */}
               <Route
                  path="/question-bank/:bank_id"
                  element={<QuestionBankDetails />}
               />
               <Route path="/create-exam" element={<CreateExam />} />
               <Route path="/add-question" element={<AddExamQuestion />} />
               {/* /f url has no match, display 404 page*/}
               <Route path="*" element={<PageNotFound404 />} />
            </Routes>
         </Router>
      </UserContext.Provider>
   );
}
