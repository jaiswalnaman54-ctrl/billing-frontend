import { useState } from "react";
import axios from "axios";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token); // 🔐 SAVE TOKEN
      setToken(res.data.token);

      alert("Login Successful ✅");
    } catch (err) {
      console.error(err);
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;