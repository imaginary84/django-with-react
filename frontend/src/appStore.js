import React, { createContext, useContext } from "react";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
} from "use-reducer-with-side-effects";

const reducer = (prev, action) => {
  // TODO:
  const { type, payload } = action;
  const { access, refresh, name, fn } = payload;
  if (type === SET_TOKEN) {
    const newState = {
      ...prev,
      access,
      refresh,
      isAuthenticated: true,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      access && setStorageItem("access", access);
      refresh && setStorageItem("refresh", refresh);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = {
      ...prev,
      access: "",
      refresh: "",
      isAuthenticated: false,
    };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("access", "");
      setStorageItem("refresh", "");
    });
  } else if (type === ADD_FUNC) {
    const newState = {
      ...prev,
      funcList: { ...prev.funcList, [name]: fn },
    };
    return Update(newState);
  }
  return prev;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const access = getStorageItem("access", ""); //로컬저장소에 있으면 가져오고 없으면 두번째 인자를 세팅.
  const refresh = getStorageItem("refresh", "");

  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    access,
    refresh,
    isAuthenticated: access.length > 0 && refresh.length > 0 ? true : false,
    funcList: {},
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
