import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./components/redux/store";
import { Toaster } from "sonner";
import { NavProvider } from "./components/context/NavContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <NavProvider>
        <App />
      </NavProvider>
    </Provider>
    <Toaster />
  </StrictMode>
);
