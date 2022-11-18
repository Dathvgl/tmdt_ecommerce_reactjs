import { combineReducers } from "redux";
import { fireBaseReducer, userReducer } from "./Reducer";

const rootReducer = combineReducers({
  user: userReducer,
  fireBase: fireBaseReducer,
});

export default rootReducer;
