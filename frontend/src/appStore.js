import React, { createContext, useContext } from "react";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";

import Axios from "axios";

const reducer = (prev, action) => {
  // TODO:
  const { type, payload } = action;
  const { access, refresh, username, fnName, fn } = payload;
  if (type === SET_TOKEN) {
    const newState = {
      ...prev,
      access,
      refresh,
      username,
      isAuthenticated: true,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      access && setStorageItem("access", access);
      refresh && setStorageItem("refresh", refresh);
      username && setStorageItem("username", username);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = {
      ...prev,
      access: "",
      refresh: "",
      username: "",
      isAuthenticated: false,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("access", "");
      setStorageItem("refresh", "");
      setStorageItem("username", "");
    });
  }
  return prev;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const access = getStorageItem("access", ""); //로컬저장소에 있으면 가져오고 없으면 두번째 인자를 세팅.
  const refresh = getStorageItem("refresh", "");
  const username = getStorageItem("username", "");

  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    access,
    refresh,
    username,
    isAuthenticated: access.length > 0 && refresh.length > 0 ? true : false,
    funcList: { profileFetch },
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

const profileFetch = async (access) => {
  const headers = { Authorization: `Bearer ${access}` };
  try {
    const response = await Axios({
      method: "GET",
      url: `http://localhost:8000/accounts/profile/my/`,
      headers,
    });
    return response.data;
  } catch (error) {}
};
