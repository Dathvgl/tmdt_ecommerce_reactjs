import * as types from "../ActionsType";

export const setExtensions = ({ extensions }) => ({
  type: types.SET_EXTENSIONS,
  extensions: { ...extensions },
});

export const setFireStore = ({ extensions, fireStore }) => ({
  type: types.SET_FIRESTORE,
  extensions: { ...extensions, fireStore: fireStore },
});

export const setRealTime = ({ extensions, realTime }) => ({
  type: types.SET_REALTIME,
  extensions: { ...extensions, fireStore: realTime },
});
