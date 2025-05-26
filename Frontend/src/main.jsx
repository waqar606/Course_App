import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";

// Configure axios defaults
axios.defaults.withCredentials = true;

const stripePromise = loadStripe(
  "pk_test_51RBQtmP7VxxtVS3zp8rUsgBKiLNSFUQ3Uq33hXtdpAjTbpJgvG2bl0Fg1wrjTpe71aiuPKsdFGpdSG5rvJbN7IQs00FGXWtq2q"
);

createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <Elements stripe={stripePromise}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Elements>
);
