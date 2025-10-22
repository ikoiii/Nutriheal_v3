import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export default function ContactSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-green-50 via-white to-green-50 relative"
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-900">Hubungi Kami</h2>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-700"
          data-aos="fade-up"
        >
          <div
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <i className="fas fa-map-marker-alt text-green-600 text-3xl mb-3"></i>
            <p className="font-semibold text-gray-800 mb-1">Alamat</p>
            <p className="text-sm">Jl. Sehat No.123, Pamulang</p>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <i className="fas fa-clock text-green-600 text-3xl mb-3"></i>
            <p className="font-semibold text-gray-800 mb-1">Jadwal</p>
            <p className="text-sm">Senin - Jumat | 08.00 - 17.00 WIB</p>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <i className="fas fa-phone text-green-600 text-3xl mb-3"></i>
            <p className="font-semibold text-gray-800 mb-1">Telepon</p>
            <p className="text-sm">+62 812 3456 7890</p>
          </div>

          <div
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <i className="fas fa-share-alt text-green-600 text-3xl mb-3"></i>
            <p className="font-semibold text-gray-800 mb-1">Media Sosial</p>
            <div className="flex justify-center space-x-5 mt-2">
              <a href="#" className="text-gray-600 hover:text-green-600 transition text-xl"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition text-xl"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition text-xl"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
