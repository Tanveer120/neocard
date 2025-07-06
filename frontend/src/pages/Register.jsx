import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import auth context

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from context

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        form
      );

      // ✅ If your backend returns a token like login
      if (res.data.token) {
        login(res.data.token);        // set token in context and localStorage
        alert("Registered and logged in!");
        navigate("/");                // redirect to dashboard (App.jsx handles it)
      } else {
        alert("Registered! Now please login manually.");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Neo Health Card
        </Link>
      </nav>
      <div className="flex-1 bg-pink-200 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
            >
              Register
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
