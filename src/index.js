import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import authServices from "./services/auth.services";
import localStorageService from "./services/localStorage.services";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

if (authServices.isExpired()) {
  localStorageService.clear();
  window.location.href = "/logout";
}

window.addEventListener("storage", function () {
  if (authServices.isExpired()) {
    localStorageService.clear();
    return (window.location.href = window.location.origin + "/logout");
  }
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
