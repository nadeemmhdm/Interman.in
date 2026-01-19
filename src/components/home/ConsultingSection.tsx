
import { motion } from "framer-motion";
import { BookOpen, Compass, GraduationCap, Building, Users, Award } from "lucide-react";

const services = [
  {
    icon: BookOpen,
    title: "COURSES",
    description: "Expert guidance on selecting the right academic courses according to your aptitude and aspirations.",
  },
  {
    icon: Compass,
    title: "CAREER GUIDANCE",
    description: "Comprehensive career mapping helping you choose universities aligned with your professional objectives.",
  },
  {
    icon: GraduationCap,
    title: "SCHOLARSHIP ASSISTANCE",
    description: "Dedicated support for meritorious students to secure scholarships and assistance with educational loans.",
  },
  {
    icon: Building,
    title: "EDUCATIONAL EXPO",
    description: "Hosting premier educational exhibitions like Talent Turn, connecting students with top institutions directly.",
  },
  {
    icon: Users,
    title: "TRAINING PROGRAMMES",
    description: "Specialized training modules designed to equip students with necessary skills for global success.",
  },
  {
    icon: Award,
    title: "SPOT ADMISSION",
    description: "Facilitating on-the-spot admissions with partner colleges right at our offices for immediate placement.",
  },
];

const ConsultingSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold tracking-wider uppercase text-sm mb-2 block">Our Expertise</span>
          <h2 className="section-title">
            CONSULTING SERVICES
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -12,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group p-8 glass-card rounded-2xl transition-all duration-300 hover:border-primary/20 hover:bg-card/90"
            >
              <div className="flex flex-col gap-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center group-hover:from-primary group-hover:to-secondary transition-all duration-500 shadow-sm group-hover:shadow-primary"
                >
                  <service.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors font-display tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultingSection;
