import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function FeaturesSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-green-50 via-white to-green-100"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">
          Fitur Unggulan NutriHeal
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
            data-aos="zoom-in"
          >
            <i className="fas fa-brain text-green-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Analisis Gizi Otomatis</h3>
            <p className="text-gray-600">
              Unggah rekam medis, dan sistem AI kami akan memberikan analisis
              cepat dan akurat.
            </p>
          </div>
          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <i className="fas fa-leaf text-green-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Rekomendasi Menu Sehat</h3>
            <p className="text-gray-600">
              Dapatkan saran menu harian yang disesuaikan dengan kebutuhan
              kalorimu.
            </p>
          </div>
          <div
            className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-2"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <i className="fas fa-chart-line text-green-600 text-4xl mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Pelacakan Harian</h3>
            <p className="text-gray-600">
              Pantau progres dan pola makanmu secara visual dengan grafik
              interaktif.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
