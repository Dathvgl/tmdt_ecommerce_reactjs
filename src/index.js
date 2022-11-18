// import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import Home from "./Home";
import { persistor, store } from "./React/Store/Store";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        backgroundColor: "#d9d9d9",
      }}
    />
    <PersistGate persistor={persistor}>
      <Router>
        <div style={{ position: "relative" }}>
          <Home />
        </div>
      </Router>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
