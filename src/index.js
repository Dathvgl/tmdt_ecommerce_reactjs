import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { PersistGate } from "redux-persist/lib/integration/react";
import Home from "./Home";
import { persistor, store } from "./React/Store/Store";
import "./index.css";

// "homepage": "https://Dathvgl.github.io/tmdt_ecommerce_reactjs/",
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router basename={`/${process.env.PUBLIC_URL}`}>
        <div style={{ position: "relative" }}>
          <Home />
        </div>
      </Router>
    </PersistGate>
  </Provider>
);
