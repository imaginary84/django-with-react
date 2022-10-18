import React, { createContext, useContext } from "react";
import { getStorageItem, setStorageItem } from "utils/useLocalStorage";

import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  // Update,
} from "use-reducer-with-side-effects";

const reducer = (prev, action) => {
  // TODO:
  const { type, payload: jwtToken } = action;
  if (type === SET_TOKEN) {
    const newState = { ...prev, jwtToken };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", jwtToken);
    });
  } else if (type === DELETE_TOKEN) {
    const newState = { ...prev, jwtToken: "" };
    return UpdateWithSideEffect(newState, (state, dispatch) => {
      setStorageItem("jwtToken", "");
    });
  }
  return prev;
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [store, dispatch] = useReducerWithSideEffects(reducer, {
    jwtToken: getStorageItem("jwtToken", ""),
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

// Action Creators
export const setToken = (token) => ({ type: SET_TOKEN, payload: token });
export const deleteToken = () => ({ type: DELETE_TOKEN });
