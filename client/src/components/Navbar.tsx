import { useState, useEffect, FC } from "react";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Home, Info, Star, Mail, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // This effect is for scrolling to hash links on the landing page.
  // We keep it in case some parts of the app still use it, but the main nav now uses page routes.
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/about", label: "About", icon: Info },
    { to: "/features", label: "Features", icon: Star },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  if (isAuthenticated) {
    navLinks.push({ to: "/service", label: "Service", icon: Stethoscope });
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-green-100 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-black">nutri</span>
          <span className="text-green-600">heal.</span>
        </Link>
        {/* Navigasi Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8 font-semibold">
            {navLinks.map((link) => (
              <li key={link.to}>
                {/* For desktop, we can use simple Links or NavLinks if active style is needed */}
                <Link to={link.to} className="hover:text-green-600">{link.label}</Link>
              </li>
            ))}
          </ul>
          <button
            onClick={handleGetStarted}
            className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105"
          >
            Mulai
          </button>
        </div>
        {/* Tombol Hamburger untuk Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 hover:text-green-600 focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Menu Mobile - REFACTORED */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white shadow-lg border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon as FC<{ className?: string }>;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center text-lg py-3 px-4 rounded-md transition-colors duration-200",
                    isActive
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <Icon className="h-6 w-6 mr-3" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
        <div className="px-4 pb-4 pt-2 border-t">
          <button
            onClick={() => { handleGetStarted(); setIsMenuOpen(false); }}
            className="w-full bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105 shadow-md"
          >
            {isAuthenticated ? "Mulai Analisis" : "Coba Gratis Sekarang"}
          </button>
        </div>
      </div>
    </nav>
  );
}