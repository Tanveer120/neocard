import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../../components/SidebarLayout";
import { toast } from "react-toastify";

// JSON Data
import countries from "../../data/countries.json";
import states from "../../data/states.json";
import cities from "../../data/cities.json";

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

  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user;

      setForm((prev) => ({
        ...prev,
        ...user,
        dob: user.dob ? user.dob.split("T")[0] : "", 
        phoneNumber: user.phoneNumber ? user.phoneNumber.replace(/^\+91/, "") : "",
        address: {
          ...prev.address,
          ...(user.address || {}),
        },
      }));

      // Pre-filter states and cities
      if (user.address?.country) {
        const countryId = countries.find(c => c.name === user.address.country)?.id;
        setFilteredStates(states.filter(s => s.country_id === countryId));
      }

      if (user.address?.state) {
        const stateId = states.find(s => s.name === user.address.state)?.id;
        setFilteredCities(cities.filter(c => c.state_id === stateId));
      }
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

      const updatedAddress = {
        ...form.address,
        [field]: value,
      };

      // Update dependent dropdowns
      if (field === "country") {
        const selectedCountry = countries.find((c) => c.name === value);
        const filtered = states.filter(
          (s) => s.country_id === selectedCountry?.id
        );
        setFilteredStates(filtered);
        setFilteredCities([]);
        updatedAddress.state = "";
        updatedAddress.city = "";
      }

      if (field === "state") {
        const selectedState = states.find((s) => s.name === value);
        const filtered = cities.filter(
          (c) => c.state_id === selectedState?.id
        );
        setFilteredCities(filtered);
        updatedAddress.city = "";
      }

      setForm((prev) => ({
        ...prev,
        address: updatedAddress,
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
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SidebarLayout>
        <div className="flex justify-center items-center w-full h-full p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Profile
              </h2>
              <p className="text-gray-600">Manage your personal and health information</p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="input" />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="input" />
              <input name="email" value={form.email} disabled className="input bg-gray-100" />
              <input name="mobile" value={form.phoneNumber} disabled className="input bg-gray-100" />
              <input name="aadharNumber" value={form.aadharNumber || ""} onChange={handleChange} placeholder="Aadhar Number" className="input" />
              <input name="abhaHealthId" value={form.abhaHealthId || ""} onChange={handleChange} placeholder="ABHA Health ID" className="input" />
              <input name="dob" type="date" value={form.dob || ""} onChange={handleChange} className="input" />
              <input name="nationality" value={form.nationality || ""} onChange={handleChange} placeholder="Nationality" className="input" />
              <input name="preferredLanguage" value={form.preferredLanguage || ""} onChange={handleChange} placeholder="Preferred Language" className="input" />
              <input name="occupation" value={form.occupation || ""} onChange={handleChange} placeholder="Occupation" className="input" />
              <input name="emergencyContact" value={form.emergencyContact || ""} onChange={handleChange} placeholder="Emergency Contact" className="input" />

              <select name="gender" value={form.gender} onChange={handleChange} className="input">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange} className="input">
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>

              <select name="classification" value={form.classification} onChange={handleChange} className="input">
                <option value="">Select Area Type</option>
                <option value="Rural">Rural</option>
                <option value="Urban">Urban</option>
              </select>

              <select name="address.country" value={form.address.country} onChange={handleChange} className="input">
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              <select name="address.state" value={form.address.state} onChange={handleChange} className="input">
                <option value="">Select State</option>
                {filteredStates.map((state) => (
                  <option key={state.id} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>

              <select name="address.city" value={form.address.city} onChange={handleChange} className="input">
                <option value="">Select City</option>
                {filteredCities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}

export default Profile;
