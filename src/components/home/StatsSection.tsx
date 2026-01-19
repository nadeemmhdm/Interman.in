import { motion } from "framer-motion";
import { Users, BookOpen, Building, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Students Placed" },
  { icon: BookOpen, value: "1000+", label: "Courses Available" },
  { icon: Building, value: "500+", label: "Partner Institutions" },
  { icon: Award, value: "21+", label: "Years Experience" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-bottom-left scale-110" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group p-6 glass-card rounded-xl hover:bg-white/80 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mb-4 group-hover:from-primary group-hover:to-secondary group-hover:scale-110 transition-all duration-300 shadow-sm">
                <stat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-3xl md:text-5xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
              >
                {stat.value}
              </motion.h3>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
