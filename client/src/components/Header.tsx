import { useEffect } from "react";

const Header = () => {
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
      });
    }
  }, []);

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-gradient-to-r from-green-100 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-black">nutri</span>
          <span className="text-green-600">heal.</span>
        </h1>
        <ul className="hidden md:flex space-x-8 font-semibold">
          <li>
            <a href="#hero" className="hover:text-green-600">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-green-600">
              About
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-green-600">
              Features
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-green-600">
              Contact
            </a>
          </li>
        </ul>
        <a
          href="/login"
          className="bg-green-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105"
        >
          Mulai
        </a>
      </div>
    </nav>
  );
};

export default Header;
