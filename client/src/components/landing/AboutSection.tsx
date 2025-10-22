import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import aboutImage from '/images/about.png';

export default function AboutSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      id="about"
      className="bg-gradient-to-r from-white to-green-50"
    >
      <div
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch"
      >
        <img
          src={aboutImage}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover"
          alt="About NutriHeal"
          data-aos="fade-right"
        />
        <div data-aos="fade-left" className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Tentang NutriHeal
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            NutriHeal adalah platform digital berbasis AI yang membantu
            masyarakat memahami dan memperbaiki pola gizi mereka dengan cepat.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dengan menggabungkan teknologi dan pengetahuan medis, kami hadir
            untuk menciptakan pengalaman pemulihan gizi yang cerdas dan
            terpersonalisasi.
          </p>
        </div>
      </div>
    </section>
  );
}
