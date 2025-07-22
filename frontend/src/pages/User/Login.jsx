import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Set token globally

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);

      if (res.data.token) {
        // ✅ Store token and role in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        login(res.data.token); // ✅ Set in global context

        toast.success("Login successful!");
        // console.log("Data:", res.data);

        // ✅ Navigate based on role
        
          navigate("/"); // User home
      }
        else {
          toast.error(res.data.message || "Login failed");
          navigate("/login");
        }
    }
    catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };
 

  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register/initiate"
              className="text-pink-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
