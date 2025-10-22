import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
    { href: "/service", label: "Service" }, // Tambahkan tautan Service
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-gradient-to-r from-green-100 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold tracking-tight">
          <span className="text-black">nutri</span>
          <span className="text-green-600">heal.</span>
        </a>
        {/* Navigasi Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8 font-semibold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-green-600">{link.label}</a>
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
      {/* Menu Mobile */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden bg-white shadow-md`}>
        {navLinks.map((link) => (
           <a key={link.href} href={link.href} className="block py-3 px-6 text-sm hover:bg-green-50" onClick={() => setIsMenuOpen(false)}>{link.label}</a>
        ))}
        <button
          onClick={() => { handleGetStarted(); setIsMenuOpen(false); }}
          className="block w-full text-left py-3 px-6 text-sm font-bold text-green-600 hover:bg-green-50"
        >
          Mulai Sekarang
        </button>
      </div>
    </nav>
  );
}