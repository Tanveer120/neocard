import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-4xl font-semibold text-pink-700 mb-4">
            Welcome to Neo Health Card
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Your gateway to a secure digital health identity. Register today and
            manage your health smarter.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Home;
