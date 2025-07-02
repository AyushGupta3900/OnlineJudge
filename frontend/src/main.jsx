import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import {store,persistor} from "./redux/store/store.js";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import PageLoader from "./components/PageLoader.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PageLoader />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);