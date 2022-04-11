import React from "react";
import ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

ReactDOM.render(<App />, document.getElementById("root"));

// OLD CODE
// console error: Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead.
// ReactDOM.render(<App />, document.getElementById("root"));

//NOT WORKING AS OF 4/6/22
// SOLUTION:
// const root = createRoot(document.getElementById("root"));
// root.render(<App />);
