import { useState } from "react";

// Given a particular key, use local storage to track data with that key, or use preexisting data
// Based on https://usehooks.com/useLocalStorage/
export default function useLocalStorage(key, defaultValue) {
  // Initial value should pull from local storage if there's data
  function getLocalStorage() {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const unparsedValue = window.localStorage.getItem(key);
      // If there is no unparsedValue, use the defaultValue
      return unparsedValue ? JSON.parse(unparsedValue) : defaultValue;
    } catch (e) {
      console.error(e);
      return defaultValue;
    }
  }
  const [valueInMemory, setValueInMemory] = useState(getLocalStorage);

  // Before setting the value in memory, update LocalStorage
  function setStateWithLocalStorageUpdates(newValue) {
    try {
      // SetState can accept a function or a new value; this normalizes across those cases
      const value =
        newValue instanceof Function ? newValue(valueInMemory) : newValue;
      // Save state
      setValueInMemory(value);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error(e);
      // Should we do something if we encounter
    }
  }

  return [valueInMemory, setStateWithLocalStorageUpdates];
}
