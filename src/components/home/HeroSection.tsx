import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, Mail } from "lucide-react";
import heroBg1 from "@/assets/hero_bg_1.png";
import heroBg2 from "@/assets/hero_bg_2.png";
import heroBg3 from "@/assets/hero_bg_3.png";

const backgroundImages = [heroBg1, heroBg2, heroBg3];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Slower transition for premium feel
    return () => clearInterval(timer);
  }, []);

  const letterContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };

  const letterAnimation = {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", damping: 12, stiffness: 200 } }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageIndex}
            src={backgroundImages[currentImageIndex]}
            alt="Interman Background"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-hero mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={letterContainer}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-display tracking-wide drop-shadow-lg">
              <span className="text-secondary block mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">COME AND</span>
              <span className="block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">JOIN US</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="relative pl-6 border-l-4 border-secondary mb-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent blur-xl" />
            <p className="text-xl md:text-3xl text-white/90 font-light italic relative drop-shadow-md">
              "The global academic goals are within your reach."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <motion.a
              href="tel:+919747442222"
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-secondary to-yellow-500 hover:from-yellow-400 hover:to-secondary text-black rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] ring-2 ring-white/20 hover:ring-white/50"
            >
              <Phone size={22} className="group-hover:animate-bounce-gentle fill-current" />
              <span>Call +91 9747 44 22 22</span>
            </motion.a>
            <motion.a
              href="mailto:info@interman.in"
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-3 px-8 py-5 glass-effect text-white hover:text-secondary rounded-full font-bold text-lg transition-all shadow-lg hover:bg-white/20 ring-1 ring-white/30 hover:ring-secondary/50"
            >
              <Mail size={22} />
              <span>Mail Us Today</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-white/80 hover:text-secondary transition-colors cursor-pointer"
        >
          <ChevronDown size={40} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
