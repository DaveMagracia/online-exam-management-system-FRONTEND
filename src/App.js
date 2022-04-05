import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Main/Login";
import Register from "./components/Main/Register";
import Landing from "./components/Main/Landing";
import Main from "./components/Main/Main";
import ExamDetails from "./components/Faculty/ExamDetails";
import { UserContext } from "./UserContext";

import "./App.css";

export default function App() {
   const [user, setUser] = React.useState({});

   return (
      <UserContext.Provider value={{ user, setUser }}>
         <Router>
            <Routes>
               <Route path="/" element={<Landing />} />
               <Route path="/login" element={<Login />} />
               <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Main />} />
               <Route path="/exam-details/:exam_id" element={<ExamDetails />} />
            </Routes>
         </Router>
      </UserContext.Provider>
   );
}
