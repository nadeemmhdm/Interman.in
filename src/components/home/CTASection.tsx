import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/90 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Let us guide you towards your academic dreams. Contact us today for a free consultation and take the first step towards a brighter future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                Get Free Consultation
                <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/courses">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/30 rounded-full font-semibold hover:bg-primary-foreground/20 transition-colors"
              >
                Explore Courses
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
