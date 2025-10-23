import FeaturesSection from "@/components/landing/FeaturesSection";

// This component simply wraps the existing FeaturesSection for consistent routing
const FeaturesPage = () => {
  return (
    <div className="container mx-auto py-8">
      <FeaturesSection />
    </div>
  );
};

export default FeaturesPage;
