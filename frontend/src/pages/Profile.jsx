import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    aadharNumber: "",
    abhaHealthId: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    preferredLanguage: "",
    occupation: "",
    classification: "",
    emergencyContact: "",
    address: {
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({
          ...prev,
          ...res.data.user,
          address: {
            ...prev.address,
            ...(res.data.user.address || {}),
          },
        }));
      } catch (err) {
        logout();
        navigate("/login");
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-pink-200">
      {/* ✅ Navbar from Dashboard */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-pink-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Neo Health Card
        </h1>
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center focus:outline-none">
            <UserCircleIcon className="h-8 w-8 text-pink-600 hover:text-pink-700" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${
                      active ? "bg-pink-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Profile
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? "bg-pink-100" : ""
                    } w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </nav>

      {/* Profile Form */}
      <div className="py-3 px-4">
        <div className=" max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
            Your Profile
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="input"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="input"
            />
            <input
              name="email"
              value={form.email}
              disabled
              className="input bg-gray-100"
            />
            <input
              name="mobile"
              value={form.mobile || ""}
              onChange={handleChange}
              placeholder="Mobile"
              className="input"
            />
            <input
              name="aadharNumber"
              value={form.aadharNumber || ""}
              onChange={handleChange}
              placeholder="Aadhar Number"
              className="input"
            />
            <input
              name="abhaHealthId"
              value={form.abhaHealthId || ""}
              onChange={handleChange}
              placeholder="ABHA Health ID"
              className="input"
            />
            <input
              name="dob"
              type="date"
              value={form.dob || ""}
              onChange={handleChange}
              className="input"
            />
            {/* <input name="gender" value={form.gender || ""} onChange={handleChange} placeholder="Gender" className="input" /> */}
            <input
              name="nationality"
              value={form.nationality || ""}
              onChange={handleChange}
              placeholder="Nationality"
              className="input"
            />
            <input
              name="preferredLanguage"
              value={form.preferredLanguage || ""}
              onChange={handleChange}
              placeholder="Preferred Language"
              className="input"
            />
            {/* <input name="maritalStatus" value={form.maritalStatus || ""} onChange={handleChange} placeholder="Marital Status" className="input" /> */}
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>

            <select
              name="classification"
              value={form.classification}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Area Type</option>
              <option value="Rural">Rural</option>
              <option value="Urban">Urban</option>
            </select>

            <select
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>

            <select
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select State</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
            </select>

            <select
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Bangalore">Bangalore</option>
            </select>

            <input
              name="occupation"
              value={form.occupation || ""}
              onChange={handleChange}
              placeholder="Occupation"
              className="input"
            />
            {/* <input name="classification" value={form.classification || ""} onChange={handleChange} placeholder="Rural/Urban" className="input" /> */}
            <input
              name="emergencyContact"
              value={form.emergencyContact || ""}
              onChange={handleChange}
              placeholder="Emergency Contact Number"
              className="input"
            />
            {/* <input name="address.city" value={form.address.city || ""} onChange={handleChange} placeholder="City" className="input" />
            <input name="address.state" value={form.address.state || ""} onChange={handleChange} placeholder="State" className="input" />
            <input name="address.country" value={form.address.country || ""} onChange={handleChange} placeholder="Country" className="input" /> */}
            <button
              type="submit"
              className="col-span-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
