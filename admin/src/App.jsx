import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import DocApplication from "./pages/DocApplication";
import PharmacyApplication from "./pages/PharmacyApplication";


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import AdminChat from "./pages/AdminChat";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 p-8">
              <div className="max-w-7xl mx-auto">
              <Routes>
                
                <Route
                  path="/dashboard"
                  element={<Dashboard token={token} />}
                />
                <Route
                  path="/doctorApplication"
                  element={<DocApplication token={token} />}
                />
                <Route
                  path="/pharmacyApplication"
                  element={<PharmacyApplication token={token} />}
                />
                {/* <Route path="/chatUser" element={<AdminChat token={token} />} /> */}
                
              </Routes>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
