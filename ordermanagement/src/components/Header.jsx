import { useAuth } from "../auth/AuthContext";
import "../styles/header.css";

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <div className="header">

      <div className="header-left">
        <h3>Welcome, {user?.username || "User"} 👋</h3>
      </div>

      <div className="header-right">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Header;