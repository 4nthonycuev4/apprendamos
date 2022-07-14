/** @format */

import { useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage("dark-theme");
  let isEnabled = typeof enabledState === "undefined" && enabled;

  useEffect(() => {
    !isEnabled && (isEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches);
    const className = "dark";
    const bodyClass = window.document.body.classList;
    window.document.documentElement.style.colorScheme = isEnabled ? "dark" : "light";

    const x = () => {
      if (isEnabled) {
        bodyClass.add(className);
      } else {
        bodyClass.remove(className);
      }
    };

    x();
  }, [enabled, isEnabled]);

  return [enabled, setEnabled];
};

export default useDarkMode;
