import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
  const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  { email, password }
);



      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-card p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
