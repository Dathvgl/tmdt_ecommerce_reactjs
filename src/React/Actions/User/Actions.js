import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../../Firebase/config";
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

export const signupInitiate = (email, password, role = "client") => {
  return async (dispatch) => {
    dispatch(signupStart);

    const res = await createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const response = await axios.post(`${node}/user/new`, {
          user,
          role,
        });
        const { item } = response.data;
        dispatch(signupSuccess(user, item));
      })
      .catch((error) => dispatch(signupFail(error?.message)));
    console.log(res);
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

export const signinInitiate = (email, password, callback) => {
  return async (dispatch) => {
    dispatch(signinStart);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const response = await axios.post(`${node}/user/old`, { user });
        const { item } = response.data;

        const token = await user.getIdToken(true);
        await axios
          .post(
            `${node}/user/token`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => dispatch(signinSuccess(user, item)))
          .catch((error) => {
            callback(error?.message);
            dispatch(signinFail(error));
          });
      })
      .catch((error) => callback(error?.message));
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
    signOut(auth)
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
    } else {
      const res = await axios.get(`${node}/user/old`, { user });
      const { item } = res.data;
      const token = user.getIdToken(true);
      await axios
        .post(
          `${node}/user/token`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((_) => {
          dispatch({ type: types.SET_USER, payload: user, info: item });
        })
        .catch((_) => {
          dispatch({
            type: types.SET_USER,
            payload: null,
            info: null,
          });
        });
    }
  };
};
