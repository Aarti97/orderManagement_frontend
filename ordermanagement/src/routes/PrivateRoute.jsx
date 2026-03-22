import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (roles && !roles.includes(user.role))
    return <Navigate to="/" />;

  return children;
};

export default PrivateRoute;