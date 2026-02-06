import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import logo from "../../assets/react.svg";
import {  ArrowLeft } from "lucide-react";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  useEffect(() => {
    if (!user) return;
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      if (user.role === "TEACHER") navigate("/teacher", { replace: true });
      if (user.role === "STUDENT") navigate("/student", { replace: true });
      if (user.role === "PARENT") navigate("/parent", { replace: true });
    
  }, [user, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 transition-all duration-500"
      style={{
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-500
                   hover:shadow-2xl hover:-translate-y-1"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Logo + Title */}
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-400 mx-2 hover:bg-gray-300 rounded"
          >
            <ArrowLeft size={18} /> Back
          </button> <img
            src={logo}
            className="h-16 w-16 mx-auto mb-3 drop-shadow-lg transition-all duration-300 hover:scale-110"
            alt="School Logo"
          />

          <h1 className="text-3xl font-bold">Green Valley High School</h1>
          <p className="text-sm opacity-70 mt-1">School Management System</p>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">Login</h2>

        {/* Username */}
        <div
          className="flex items-center gap-3 border rounded-xl px-4 py-2 mb-4 transition-all duration-300
                     focus-within:border-blue-500"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <FaUser className="opacity-70" />
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div
          className="flex items-center gap-3 border rounded-xl px-4 py-2 mb-6 transition-all duration-300
                     focus-within:border-blue-500"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <FaLock className="opacity-70" />
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300
                     hover:scale-105 hover:shadow-xl"
          style={{
            background: "var(--text)",
            color: "var(--bg)",
          }}
        >
          Login
        </button>

        {/* Sample Demo Accounts */}
        <p className="text-sm mt-5 text-center opacity-70">
          GVA2018011 | GVS2024001 | GVS2018011 | GVP2018011  
          <br /> Default Password: <strong>ChangeMe@123</strong>
        </p>
      </form>
    </div>
  );
};

export default Login;
