
import { motion } from "framer-motion";
import { Star, Award } from "lucide-react";

const highlights = [
  "Linking them with diverse educational fields of study",
  "Providing educational solutions for the skilled consultants",
  "Supporting for scholarship facility for the eligible students",
  "Linking them with highly reputable academic institutions",
  "Keeping a regular contact with them and their institutions",
  "Conducting educational exhibitions like Talent Turn",
  "Opening before them high career opportunities",
  "Assisting bank loan facility and clearance",
];

const HighlightsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold tracking-wider uppercase text-sm mb-2 block">Why We Stand Out</span>
          <h2 className="section-title">
            OUR HIGHLIGHTS
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Highlights List */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ x: 10, scale: 1.01 }}
                className="flex items-start gap-4 group p-4 rounded-xl hover:bg-white/50 border border-transparent hover:border-border transition-all duration-300"
              >
                <div className="p-2 bg-gradient-to-br from-secondary/10 to-primary/5 rounded-lg group-hover:from-secondary group-hover:to-primary transition-all duration-300 shadow-sm">
                  <Star className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                </div>
                <span className="text-foreground pt-1.5 font-medium">{highlight}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Certification Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8"
          >
            <motion.div
              whileHover={{ y: -10, rotate: 2 }}
              className="flex flex-col items-center gap-4 p-8 glass-card rounded-2xl w-48 text-center"
            >
              <Award className="w-16 h-16 text-secondary drop-shadow-md" />
              <span className="text-sm font-bold text-foreground leading-tight">
                ISO 9001:2008
                <br />
                <span className="text-muted-foreground font-normal">Certified</span>
              </span>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, rotate: -2 }}
              className="flex flex-col items-center gap-4 p-8 glass-card rounded-2xl w-48 text-center bg-gradient-to-br from-card/80 to-primary/5"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-pulse-slow">
                <span className="text-white font-bold text-xl font-display">21+</span>
              </div>
              <span className="text-sm font-bold text-foreground leading-tight">
                Years of
                <br />
                <span className="text-muted-foreground font-normal">Excellence</span>
              </span>
            </motion.div>
            <motion.div
              whileHover={{ y: -10, rotate: 2 }}
              className="flex flex-col items-center gap-4 p-8 glass-card rounded-2xl w-48 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl font-display">1000+</span>
              </div>
              <span className="text-sm font-bold text-foreground leading-tight">
                Colleges &
                <br />
                <span className="text-muted-foreground font-normal">Universities</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
