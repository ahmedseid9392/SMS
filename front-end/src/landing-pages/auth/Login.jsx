import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  useEffect(() => {
    if (user ) {
      if (user.role === "ADMIN") navigate("/admin", { replace: true });
      else if (user.role === "TEACHER") navigate("/teacher", { replace: true });
      else if (user.role === "STUDENT") navigate("/student", { replace: true });
      else if (user.role === "PARENT") navigate("/parent", { replace: true });
    }
  }, [user, navigate]);

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="password"
          className="w-full border p-2 mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm mt-4 text-gray-600 text-center">
          GVA2018011 | GVT2018011 | GVS2018011 | GVP2018011 |ChangeMe@123
        </p>
      </form>
    </div>
    
  );
};

export default Login;
