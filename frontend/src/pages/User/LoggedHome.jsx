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
  <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
    <LoggedNav />
    <main className="flex-grow flex items-center justify-center text-center px-4">
      <div>
        <h2 className="text-4xl font-semibold text-pink-700 mb-3">
          Welcome, {user ? `${user.firstName} ${user.lastName || ""}` : "Loading..."}
        </h2>
        <p className="text-gray-700 text-lg">This is your personalized dashboard.</p>
      </div>
    </main>
  </div>
);
}

export default LoggedHome;
