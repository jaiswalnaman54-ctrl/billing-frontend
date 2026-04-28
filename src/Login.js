import { useState } from "react";
import axios from "axios";

const API = "https://billing-backend-lfu8.onrender.com";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    // ✅ Basic validation
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIXED axios call
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);

      alert("Login Successful ✅");

    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        alert("Invalid credentials ❌");
      } else {
        alert("Server error ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px", margin: "auto" }}>
      <h2>🔐 Login</h2>

      <input
        style={input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={button} onClick={login} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

// 🎨 Styles
const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const button = {
  width: "100%",
  padding: "10px",
  background: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Login;