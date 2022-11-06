import React, { createContext, useContext } from "react";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";
import { axiosInstance } from "utils/useFetch";

import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";

const reducer = (prev, action) => {
  // TODO:
  const { type, payload } = action;
  const { refresh, username, fnName, fn } = payload;

  if (type === SET_TOKEN) {
    const newState = {
      ...prev,
      refresh,
      username,
      isAuthenticated: true,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      refresh && setStorageItem("refresh", refresh);
      username && setStorageItem("username", username);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = {
      ...prev,
      refresh: "",
      username: "",
      isAuthenticated: false,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("refresh", "");
      setStorageItem("username", "");
    });
  }
  return prev;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  //로컬저장소에 있으면 가져오고 없으면 두번째 인자를 세팅.
  const refresh = getStorageItem("refresh", "");
  const username = getStorageItem("username", "");

  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    refresh,
    username,
    isAuthenticated: refresh.length > 0 ? true : false,
  });

  return (
    <AppContext.Provider value={{ store, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

//Actions
const SET_TOKEN = "APP/SET_TOKEN";
const DELETE_TOKEN = "APP/DELETE_TOKEN";
const ADD_FUNC = "APP/ADD_FUNC";

// Action Creators
export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const deleteToken = () => ({ type: DELETE_TOKEN, payload: {} });
export const addFunc = (name, fn) => ({
  type: ADD_FUNC,
  payload: { name, fn },
});
