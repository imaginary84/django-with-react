import "./App.scss";
import React, { useState, useReducer, createContext, useContext } from "react";

const ValueContext = createContext();

const reducer = (prevState, action) => {
  const { type, payload = 1 } = action;
  if (type === "INCREMENT") {
    return { ...prevState, value: prevState.value + payload };
  } else if (type === "DECREMENT") {
    return { ...prevState, value: prevState.value - payload };
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, { value: 0 });

  // const onClick = () => setValue((prevState) => prevState + 1);

  return (
    <div>
      <ValueContext.Provider value={{ state, dispatch }}>
        <Game></Game>
      </ValueContext.Provider>
    </div>
  );
}

const Game = () => {
  const { state, dispatch } = useContext(ValueContext);

  const INCREMENT = () => dispatch({ type: "INCREMENT", payload: 10 });
  const DECREMENT = () => dispatch({ type: "DECREMENT", payload: 7 });

  return (
    <div>
      Hello World {state.value}
      <button onClick={INCREMENT}>INCREMENT</button>
      <button onClick={DECREMENT}>DECREMENT</button>
    </div>
  );
};

export default App;
