import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#0f172a",
          borderRadius: "10px",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
          fontWeight: "600",
        },
        success: {
          style: {
            background: "#ffffff",
            color: "#0f172a",
            borderBottom: "4px solid #22c55e",
          },
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },
        error: {
          style: {
            background: "#ffffff",
            color: "#0f172a",
            borderBottom: "4px solid #ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  </StrictMode>
);
