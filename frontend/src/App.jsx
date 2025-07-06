import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const { token } = useAuth(); // ✅ reactive token
  console.log("App.jsx token:", token);


  return (
    <div className="font-poppins">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Dashboard /> : <Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={token ? <Profile /> : <Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
