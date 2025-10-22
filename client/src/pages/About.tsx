import about from "/images/about.png";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-r from-white to-green-50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2" data-aos="fade-right">
          <img
            src={about}
            className="rounded-2xl shadow-lg w-full"
            alt="About NutriHeal"
          />
        </div>
        <div className="md:w-1/2" data-aos="fade-left">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Tentang NutriHeal</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            NutriHeal adalah platform digital berbasis AI yang membantu masyarakat
            memahami dan memperbaiki pola gizi mereka dengan cepat.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dengan menggabungkan teknologi dan pengetahuan medis, kami hadir untuk
            menciptakan pengalaman pemulihan gizi yang cerdas dan terpersonalisasi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;