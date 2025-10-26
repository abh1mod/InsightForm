import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import { socket } from "../socket.js";
import axios from "axios";
const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [unread, setUnread] = useState(0);
  const [lastChecked, setLastChecked] = useState(null);
  const [notificationList, setNotificationList] = useState([]);
  const [tabSeen, setTabSeen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const tabSeenRef = useRef(tabSeen);

  // ✅ 2. Keep this ref updated whenever 'tabSeen' changes
  useEffect(() => {
    tabSeenRef.current = tabSeen;
  }, [tabSeen]);

  useEffect(()=>{
    const fetchNotifications = async () => {
      try{
        setLoadingNotifications(true);
        const response = await axios.get("http://localhost:3000/api/notification/get-notifications", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.data.success){
          setNotificationList(response.data.notifications);
          setUnread(response.data.unReadCount);
          setLastChecked(response.data.lastchecked);
        }
      }
      catch(error){
        console.error("Error fetching notifications:", error);
      }
      finally{
        setLoadingNotifications(false);
      }
    }
    if(socketConnected){
      fetchNotifications();
    }
  }, [socketConnected, token]);


  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      socket.auth = { token }; // Set auth data *before* connecting
      socket.connect();
    } else {
      localStorage.removeItem("token");
    }
    return () => {
      socket.disconnect();
    }
  }, [token]);

  useEffect(() => {
    
    // 1. If there is no token, do nothing.
    // (This also ensures the cleanup from a previous run fires on logout)
    if (!token) {
      return; 
    }

    // --- All listener functions remain the same ---
    function onConnect() {
      console.log('Socket connected! (via App.js)');
      setSocketConnected(true);
    }

    function onDisconnect() {
      console.log('Socket disconnected. (via App.js)');
      setSocketConnected(false);
    }

    function onNewNotification(data) {
      console.log('New notification received in App.js:', data);
      if (!tabSeenRef.current) {
        setUnread((prev) => prev + 1);
      }
      setNotificationList((prev) => [data, ...prev]);
    }
    
    function onConnectError(err) {
      console.error('Socket connection error:', err.message);
      setSocketConnected(false);
      // You can add your session expiry toast here too
    }

    // 2. Register listeners ONLY if there is a token.
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_notification', onNewNotification);
    socket.on('connect_error', onConnectError);

    // 3. The cleanup function
    return () => {
      console.log("Cleaning up App.js listeners...");
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_notification', onNewNotification);
      socket.off('connect_error', onConnectError);
    };

  // 4. Add 'token' (and the setters) to the dependency array.
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => {
    toast.info("Logged out successfully");
    setToken(null);
  }

  const value = useMemo(
    () => ({ token, login, logout, isLoggedIn: !!token, socketConnected, setSocketConnected, unread, setUnread, notificationList, setNotificationList, lastChecked, setLastChecked, tabSeen, setTabSeen, tabSeenRef, loadingNotifications, setLoadingNotifications }),
    [token, socketConnected, unread, notificationList, lastChecked, tabSeen, loadingNotifications]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAppContext = () => useContext(Context);


