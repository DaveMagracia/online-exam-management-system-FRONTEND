import React from "react";
import css from "./css/StudentHistory.module.css";
import Sidebar from "../Both/Sidebar";

export default function StudentHistory() {
   return (
      <>
         <Sidebar>
            <div className={`${css.history_root} p-3`}>
               <div className="d-flex flex-column px-5 py-3">
                  <h1>History Page</h1>
               </div>
            </div>
         </Sidebar>
      </>
   );
}
