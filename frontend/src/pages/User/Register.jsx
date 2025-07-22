import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login, setToken } = useAuth(); // ✅ Correct: grab setToken


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [step, setStep] = useState(1); // 1 = info, 2 = OTP
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const initiateRegistration = async () => {
    const { firstName, email, password, phoneNumber } = form;

    if (!firstName || !email || !password || !phoneNumber) {
      return toast.warning("Please fill all required fields");
    }
    if (password !== form.confirmPassword) {
      return toast.warning("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/register/initiate", {
        firstName,
        email,
        password,
        phoneNumber,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    const { firstName, email, password, phoneNumber, otp } = form;

    if (!otp) return toast.warning("Please enter OTP");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/users/register/complete", {
        firstname: firstName,
        email,
        password,
        phoneNumber,
        otp,
      });

      console.log(res.data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);     // ✅ store in localStorage
        setToken(res.data.token);
        toast.success("Registration successful!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Failed to register");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying OTP or registering");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
            Register
          </h2>

          {step === 1 && (
            <form className="space-y-4">
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                name="email"
                placeholder="Email"
                type="email"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={initiateRegistration}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-4">
              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={completeRegistration}
                disabled={loading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
              >
                {loading ? "Registering..." : "Verify & Register"}
              </button>
            </form>
          )}

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
