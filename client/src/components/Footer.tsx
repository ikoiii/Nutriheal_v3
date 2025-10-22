import { Facebook, Instagram, Twitter } from "lucide-react"; // Menggunakan ikon dari lucide-react

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white border-t-4 border-green-600">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Kolom 1: Logo dan Tagline */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-bold mb-3">
            <span className="text-white">nutri</span>
            <span className="text-green-500">heal.</span>
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
            Menggabungkan teknologi dan kesehatan untuk kehidupan lebih baik.
          </p>
        </div>

        {/* Kolom 2: Tautan Navigasi */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="#about" className="hover:text-green-500 transition-colors">Tentang Kami</a>
            </li>
            <li>
              <a href="#features" className="hover:text-green-500 transition-colors">Fitur</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-500 transition-colors">Kontak</a>
            </li>
            <li>
              <a href="/service" className="hover:text-green-500 transition-colors">Service</a> {/* Tambahkan tautan Service */}
            </li>
          </ul>
        </div>

        {/* Kolom 3: Media Sosial */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><Facebook className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><Instagram className="h-6 w-6" /></a>
            <a href="#" className="text-gray-400 hover:text-green-500 transition-colors"><Twitter className="h-6 w-6" /></a>
          </div>
        </div>
      </div>

      {/* Hak Cipta */}
      <div className="mt-8 py-6 border-t border-gray-700 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} NutriHeal. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
};

export default Footer;