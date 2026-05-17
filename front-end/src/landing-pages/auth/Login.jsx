import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../landing-pages/ThemeToggle";
import { ArrowLeft, User, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
//import schoolLogo from "../../assets/images/school-logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim()) {
      toast.error("Please enter username", {
        style: { background: 'var(--card)', color: 'var(--text)' }
      });
      return;
    }
    
    if (!password.trim()) {
      toast.error("Please enter password", {
        style: { background: 'var(--card)', color: 'var(--text)' }
      });
      return;
    }
    
    // Call login from context
    const success = await login(username, password);
    
    // Clear form on success (navigation will happen in useEffect)
    if (success) {
      setUsername("");
      setPassword("");
    }
  };

  // Navigate when user is set
  useEffect(() => {
    if (!user) return;
    
    // Show role-specific welcome message
    const roleMessages = {
      ADMIN: "Welcome Administrator! 🚀",
      TEACHER: "Welcome Teacher! 📚",
      STUDENT: "Welcome Student! 🎓",
      PARENT: "Welcome Parent! 👨‍👩‍👧"
    };
    
    const message = roleMessages[user.role] || `Welcome ${user.name || user.role}!`;
    
    toast.success(message, {
      duration: 3000,
      icon: '✅',
      style: {
        background: 'var(--card)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
      },
    });
    
    // Navigate based on role
    if (user.role === "ADMIN") navigate("/admin", { replace: true });
    else if (user.role === "TEACHER") navigate("/teacher", { replace: true });
    else if (user.role === "STUDENT") navigate("/student", { replace: true });
    else if (user.role === "PARENT") navigate("/parent", { replace: true });
    else navigate("/dashboard", { replace: true });
    
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 mx-auto hover:bg-blue-600 rounded-lg text-white transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          <div className="mt-4">
            <img
              src=""
              className="h-20 w-20 mx-auto mb-3 drop-shadow-lg transition-all duration-300 hover:scale-110 object-contain"
              alt="School Logo"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80x80?text=School";
              }}
            />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Green Valley High School
          </h1>
          <p className="text-sm opacity-70 mt-1">School Management System</p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>

        {/* Username */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4 transition-all duration-300
                     focus-within:ring-2 focus-within:ring-blue-500"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <User className="opacity-70" size={20} />
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        {/* Password with show/hide */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 transition-all duration-300
                     focus-within:ring-2 focus-within:ring-blue-500"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <Lock className="opacity-70" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full bg-transparent outline-none"
            style={{ color: "var(--text)" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="opacity-70 hover:opacity-100 transition-opacity duration-200 focus:outline-none"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300
                     hover:scale-105 hover:shadow-xl relative overflow-hidden group
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
          }}
        >
          <span className="relative z-10">
            {loading ? "Logging in..." : "Login"}
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>

        {/* Sample Demo Accounts */}
        <div className="mt-6 p-4 rounded-lg text-center text-sm"
             style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p className="opacity-80 font-mono text-xs">
            Usernames: GVA2018011 | GVA2018012 | GVA2018013 | GVP2018014
          </p>
          <p className="opacity-80 font-mono text-xs mt-1">
            Parent Samples: GVP2024001 | GVP2024002 | GVP2024003
          </p>
          <p className="opacity-80 mt-1">
            Default Password: <strong className="text-blue-500">ChangeMe@123</strong>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
