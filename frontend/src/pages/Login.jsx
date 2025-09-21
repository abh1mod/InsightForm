// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect } from "react";


const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    login("Bearer " + token); // save token
    window.history.replaceState({}, document.title, "/dashboard"); // clean query + redirect
  }
}, []);


  // handle normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username: email, // Passport local expects username
        password,
      });
      if (res.data.token) {
        login(res.data.token); // Save token in context + localStorage
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed!");
    }
  };

  // handle Google login
  const handleGoogleLogin = () => {
    // open backend Google OAuth flow
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className="flex h-[80vh] items-center justify-center ">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
