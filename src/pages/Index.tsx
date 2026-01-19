import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ConsultingSection from "@/components/home/ConsultingSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HighlightsSection from "@/components/home/HighlightsSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO />
      <Navbar />
      <main>
        <HeroSection />
        <ConsultingSection />
        <WhyChooseUs />
        <HighlightsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
