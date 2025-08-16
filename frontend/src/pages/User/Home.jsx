import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to{" "}
          <span className="text-blue-600">Neo Health Card</span>
        </h1>
        <p className="text-gray-600">
          Your one-stop solution for healthcare management
        </p>
        <div className="mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg">
            Get Started
          </button>
          <button className="ml-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
