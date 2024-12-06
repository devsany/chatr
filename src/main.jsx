import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./components/context.jsx";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

createRoot(document.getElementById("root")).render(
  <Router>
    <AppProvider>
      <App />
    </AppProvider>
  </Router>
);
