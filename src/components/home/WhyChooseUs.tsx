import { motion } from "framer-motion";
import { Search, Users, Building2, Presentation } from "lucide-react";

const reasons = [
  {
    icon: Search,
    title: "Admission guidance",
    description: "We lead the students to the right course and right institution and help them achieve their academic ambitions.",
    side: "left",
  },
  {
    icon: Users,
    title: "Career counseling",
    description: "We offer the best counseling according to the student's academics, for the right selection of academic courses and institutions.",
    side: "right",
  },
  {
    icon: Building2,
    title: "College information",
    description: "We represent recognized and reputable educational institutions, universities and colleges across india.",
    side: "left",
  },
  {
    icon: Presentation,
    title: "Conducting educational expo",
    description: "We conduct brilliant educational exhibitions, like Talent Turn, led by the intellect, Dr.G.S Pradeep to benefit the plus two students.",
    side: "right",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            WHY CHOOSE US ?
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block" />

          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: reason.side === "left" ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative flex items-center mb-12 last:mb-0 ${
                reason.side === "left" ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Content Card */}
              <div className={`flex-1 ${reason.side === "left" ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                <h3 className="text-xl md:text-2xl font-semibold text-primary mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground">
                  {reason.description}
                </p>
              </div>

              {/* Timeline Dot */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="hidden md:flex w-12 h-12 rounded-full bg-primary text-primary-foreground items-center justify-center z-10 shadow-primary"
              >
                <reason.icon size={20} />
              </motion.div>

              {/* Empty Space for Alignment */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}

          {/* Top Circle */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="absolute left-1/2 -top-4 w-4 h-4 rounded-full bg-primary -translate-x-1/2 hidden md:block"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
