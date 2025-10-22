import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import homeImage from '/images/home.png';

export default function HeroSection() {
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
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 pt-32 md:pt-20"
    >
      <div className="max-w-xl" data-aos="fade-right">
        <h1
          className="text-5xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight"
        >
          Pulih lebih cepat dengan
          <span className="text-green-600"> nutrisi tepat</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Dapatkan analisis gizi berbasis AI yang membantu mempercepat proses
          pemulihan kesehatanmu. Personalisasi, akurat, dan terpercaya.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105 shadow-md"
        >
          Coba Gratis Sekarang
        </button>
      </div>
      <div data-aos="fade-left">
        <img
          src={homeImage}
          alt="Healthy Food"
          className="rounded-3xl shadow-xl mt-10 md:mt-0 border-4 border-green-100 max-w-md lg:max-w-lg h-auto"
        />
      </div>
    </section>
  );
}
