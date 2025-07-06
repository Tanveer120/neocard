import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-pink-200 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Neo Health Card
        </Link>
        <div className="space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 border border-pink-500 text-pink-600 rounded-full hover:bg-pink-100 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-200"
          >
            Register
          </Link>
        </div>
      </nav>

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
