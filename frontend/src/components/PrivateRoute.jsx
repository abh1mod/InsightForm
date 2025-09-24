import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/ContextAPI";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
