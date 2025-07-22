// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Home from "./pages/User/Home";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import LoggedHome from "./pages/User/LoggedHome";
import Profile from "./pages/User/Profile";
import ApplyDoctor from "./pages/User/DoctorApplication";


function App() {
  const { token,role } = useAuth();

  return (
    <div className="font-poppins">
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={token ? <LoggedHome /> : <Home />} />
          {/* <Route path="/" element={role ==='admin' ? <Dashboard /> : <Home />} /> */}
          <Route path="/register/initiate" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={token ? <Profile /> : <Home />} />
          <Route path="/profile1" element={token ? <Profile /> : <Home />} />
          <Route path="/apply-doctor" element={token ? <ApplyDoctor /> : <Home />} />
          {/* Add more protected routes here like /settings, etc. */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
