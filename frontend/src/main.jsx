import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ContextProvider } from "./context/ContextAPI.jsx";
import "./index.css";
import {ToastContainer} from "react-toastify"


ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored"/>  
  </ContextProvider>
);
