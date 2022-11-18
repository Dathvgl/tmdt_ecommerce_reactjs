import * as types from "../Actions/ActionsType";

const initUser = {
  loading: false,
  role: null,
  currentUser: null,
  currentInfo: null,
  error: null,
};

export const userReducer = (state = initUser, action) => {
  switch (action?.type) {
    case types.SIGNUP_START:
    case types.SIGNIN_START:
    case types.SIGNOUT_START:
      return { ...state, loading: true };
    case types.SET_USER:
    case types.SIGNUP_SUCCESS:
    case types.SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action?.payload,
        currentInfo: action?.info,
      };
    case types.SIGNOUT_SUCCESS:
      return { ...state, currentUser: null, currentInfo: null };
    case types.SIGNUP_FAIL:
    case types.SIGNIN_FAIL:
    case types.SIGNOUT_FAIL:
      return { ...state, loading: false, error: action?.payload };
    default:
      return state;
  }
};

const initFireBase = {
  loading: false,
  extensions: {
    fireStore: {},
    realTime: {},
  },
  error: null,
};

export const fireBaseReducer = (state = initFireBase, action) => {
  switch (action?.type) {
    case types.SET_EXTENSIONS:
    case types.SET_FIRESTORE:
    case types.SET_REALTIME:
      return {
        ...state,
        extensions: action?.extensions,
      };
    default:
      return state;
  }
};
