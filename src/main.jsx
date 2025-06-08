import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./components/redux/store";
import { Toaster } from "sonner";
import { NavProvider } from "./components/context/NavContext";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavProvider>
          <App />
        </NavProvider>
        <Toaster richColors />
      </PersistGate>
    </Provider>
  </StrictMode>
);
