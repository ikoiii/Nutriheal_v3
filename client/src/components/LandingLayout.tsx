import Footer from "./Footer";
import Navbar from "./Navbar"; // Menggunakan Navbar yang baru

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar /> {/* Menggunakan Navbar */}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
