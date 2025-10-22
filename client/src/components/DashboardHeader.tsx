import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <Link to="/">
            <span className="text-black">nutri</span>
            <span className="text-green-600">heal.</span>
          </Link>
        </h1>
        <ul className="hidden md:flex space-x-8 font-semibold">
        <li>
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-green-600">
              About
            </Link>
          </li>
          <li>
            <Link to="/features" className="hover:text-green-600">
              Features
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-green-600">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/service" className="hover:text-green-600">
              Service
            </Link>
          </li>
          <li>
            <Link to="/upload" className="hover:text-green-600">
              Upload
            </Link>
          </li>
          <li>
            <Link to="/results" className="hover:text-green-600">
              Results
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardHeader;
