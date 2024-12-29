import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "../components/App";
import { AuthContextProvider } from "../context/authContext";

createRoot(document.getElementById("root")).render(
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  
);
