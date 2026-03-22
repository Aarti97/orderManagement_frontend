import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      // ✅ save auth data in context + localStorage
      login(res.data);

      // ✅ role based navigation
      const role = res?.data?.user?.role;

      if (role === "admin") navigate("/admin");
      else navigate("/orders");

    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
  <div className="login-card">
    <form onSubmit={handleLogin} className="login-box">
      <h2>Login</h2>

      {error && <p className="error-box">{error}</p>}

      <div className="input-group">
        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />
      </div>

      <button className="login-btn" type="submit">Login</button>
    </form>
  </div>
</div>
  );
};

export default Login;