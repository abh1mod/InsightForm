import { createContext, useContext, useEffect, useMemo, useState } from "react";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    console.log(token);
  }, [theme]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({ token, login, logout, isLoggedIn: !!token, theme, toggleTheme }),
    [token, theme]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAppContext = () => useContext(Context);


