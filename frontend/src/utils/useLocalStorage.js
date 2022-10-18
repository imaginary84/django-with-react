// https://usehooks.com/useLocalStorage
import { useState } from "react";

export const getStorageItem = (key, initialValue) => {
  if (typeof window === "undefined") {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};

export const setStorageItem = (key, valueToStore) => {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  } catch (error) {
    console.log(error);
  }
};

// Hook
// export default function useLocalStorage(key, initialValue) {
//   const [storedValue, setStoredValue] = useState(() => {
//     return getStorageItem(key, initialValue);
//   });

//   const setValue = (value) => {
//     const valueToStore = value instanceof Function ? value(storedValue) : value;
//     setStoredValue(valueToStore);
//     setStorageItem(key, valueToStore);
//   };
//   return [storedValue, setValue];
// }
