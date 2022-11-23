import axios from "axios";
import * as types from "../ActionsType";

const node = process.env?.REACT_APP_NODE;

const signupStart = () => ({
  type: types.SIGNUP_START,
});

const signupSuccess = (user, info) => ({
  type: types.SIGNUP_SUCCESS,
  payload: user,
  info: info,
});

const signupFail = (error) => ({
  type: types.SIGNUP_FAIL,
  payload: error,
});

export const signupInitiate = (
  email,
  password,
  displayName,
  role = "client"
) => {
  return async (dispatch) => {
    dispatch(signupStart);

    await axios
      .post(`${node}/user/signup`, {
        email: email,
        password: password,
        displayName: displayName,
        role: role,
      })
      .then((res) => {
        const { user, item } = res.data;
        dispatch(signupSuccess(user, item));
      })
      .catch((error) => {
        console.error(error);
        dispatch(signupFail(error?.message));
      });
  };
};

const signinStart = () => ({
  type: types.SIGNIN_START,
});

const signinSuccess = (user, info) => ({
  type: types.SIGNIN_SUCCESS,
  payload: user,
  info: info,
});

const signinFail = (error) => ({
  type: types.SIGNIN_FAIL,
  payload: error,
});

export const signinInitiate = (email, password) => {
  return async (dispatch) => {
    dispatch(signinStart);

    const res = await axios
      .post(`${node}/user/signin`, { email: email, password: password })
      .then((res) => {
        const { user, item } = res.data;
        dispatch(signinSuccess(user, item));
        return res;
      })
      .catch((error) => {
        console.error(error);
        dispatch(signinFail(error?.message));
        return error;
      });
    return res?.response?.status;
  };
};

const signoutStart = () => ({
  type: types.SIGNOUT_START,
});

const signoutSuccess = () => ({
  type: types.SIGNOUT_SUCCESS,
});

const signoutFail = (error) => ({
  type: types.SIGNOUT_FAIL,
  payload: error,
});

export const signoutInitiate = () => {
  return async (dispatch) => {
    dispatch(signoutStart);

    await axios
      .post(`${node}/user/signout`)
      .then((_) => dispatch(signoutSuccess()))
      .catch((error) => {
        console.error(error);
        dispatch(signoutFail(error?.message));
      });
  };
};

export const setUser = (user) => {
  return async (dispatch) => {
    if (user === null || user === undefined) {
      dispatch({
        type: types.SET_USER,
        payload: null,
        info: null,
      });
      return;
    }

    const res = await axios.get(`${node}/user/${user?.uid}`);
    dispatch({
      type: types.SET_USER,
      payload: user,
      info: res.data,
    });
  };
};
