import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  // Watch location for route changes and re-check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-pink-600">
        Neo Health Card
      </Link>

      {loggedIn ? (
        <div className="space-x-3 flex items-center">
          <Link
            to="/profile"
            className="px-4 py-2 text-pink-600 border border-pink-500 rounded-full hover:bg-pink-100 transition duration-200"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-500 text-red-600 rounded-full hover:bg-red-100 transition duration-200"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-pink-500 text-pink-600 rounded-full hover:bg-pink-100 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/register/initiate"
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition duration-200"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
