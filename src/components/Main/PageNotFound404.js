import React from "react";
import css from "./css/PageNotFound404.module.css";

export default function PageNotFound404() {
   return (
      <>
         <div
            className={`${css.root_404} d-flex align-items-center justify-content-center flex-column`}>
            <h1 className="display-4">Error 404:</h1>
            <h1 className="lead">Page not found.</h1>
         </div>
      </>
   );
}
