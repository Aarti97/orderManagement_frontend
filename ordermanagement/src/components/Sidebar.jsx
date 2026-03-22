import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import "../styles/sidebar.css";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <FaBars onClick={() => setOpen(true)} />
      
      </div>

      {/* SIDEBAR */}
      <div className={`sidebar ${open ? "show" : ""} ${collapse ? "collapse" : ""}`}>
        
        <button className="collapse-btn" onClick={() => setCollapse(!collapse)}>
          ☰
        </button>

        <nav>
          {user?.role === "admin" && (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className={isActive("/admin") ? "active" : ""}>
                <span>Dashboard</span>
              </Link>

              <Link to="/customers" onClick={() => setOpen(false)} className={isActive("/customers") ? "active" : ""}>
                <span>Customers</span>
              </Link>
                <Link to="/users" onClick={() => setOpen(false)} className={isActive("/users") ? "active" : ""}>
            <span>Users</span>
          </Link> 
            </>
          )}

          <Link to="/orders" onClick={() => setOpen(false)} className={isActive("/orders") ? "active" : ""}>
            <span>Orders</span>
          </Link>
           
        </nav>
      </div>
    </>
  );
};

export default Sidebar;