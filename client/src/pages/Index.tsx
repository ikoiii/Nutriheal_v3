import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import homeImage from '/images/home.png'; // Impor gambar untuk bagian home/hero
import aboutImage from '/images/about.png'; // Impor gambar untuk bagian about

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fungsi untuk menangani klik tombol, mengarahkan pengguna berdasarkan status login
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/upload"); // Jika sudah login, arahkan ke halaman upload
    } else {
      navigate("/login"); // Jika belum, arahkan ke halaman login
    }
  };

  // Inisialisasi Animate On Scroll (AOS)
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
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
            alt="Healthy Food" // Menambahkan max-width untuk kontrol ukuran
            className="rounded-3xl shadow-xl mt-10 md:mt-0 border-4 border-green-100 max-w-md lg:max-w-lg h-auto"
          />
        </div>
      </section>

      {/* Features Section */}
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

      {/* About Section */}
      <section
        id="about"
        className="bg-gradient-to-r from-white to-green-50"
      >
        <div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch"
        >
          <img
            src={aboutImage}
            className="w-full md:w-1/2 h-64 md:h-auto object-cover" // Menghapus border dan sudut membulat
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

      {/* Contact Section */}
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
    </div>
  );
}
