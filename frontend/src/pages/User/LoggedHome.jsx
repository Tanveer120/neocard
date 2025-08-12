import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoggedNav from "../../components/LoggedNav";

function LoggedHome() {
  const [user, setUser] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout(); // clear context and localStorage
        navigate("/");
      }
    };

    fetchUser();
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 flex flex-col">
    <LoggedNav />
    <main className="flex-grow flex items-center justify-center text-center px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, <span className="text-blue-600">{user ? `${user.firstName} ${user.lastName || ""}` : "Loading..."}</span>
          </h2>
          <p className="text-gray-600 text-lg mb-6">This is your personalized dashboard.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="text-blue-600 text-2xl mb-2">👤</div>
              <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
              <p className="text-gray-600 text-sm">Manage your health profile and personal information</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="text-green-600 text-2xl mb-2">👨‍⚕️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Doctor Application</h3>
              <p className="text-gray-600 text-sm">Apply to become a verified healthcare provider</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <div className="text-purple-600 text-2xl mb-2">💊</div>
              <h3 className="font-semibold text-gray-900 mb-2">Pharmacy Application</h3>
              <p className="text-gray-600 text-sm">Apply to become a verified pharmacy partner</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}

export default LoggedHome;
