import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "../Reducers/RootReducer";

const middleware = [thunk];

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["user"],
};

if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // reducer: rootReducer,
  reducer: persistedReducer,
  middleware: [thunk /* , logger */],
});

export const persistor = persistStore(store);
