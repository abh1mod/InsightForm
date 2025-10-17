import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => {
    toast.info("Logged out successfully");
    setToken(null);
  }

  const value = useMemo(
    () => ({ token, login, logout, isLoggedIn: !!token }),
    [token]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAppContext = () => useContext(Context);


