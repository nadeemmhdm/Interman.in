import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { Users, Compass, BookOpen, Building2, Presentation, GraduationCap, Globe, Shield, Award, Heart, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

const ICON_MAP: Record<string, any> = {
  Users, Compass, BookOpen, Building2, Presentation, GraduationCap, Globe, Shield, Award, Heart
};

const defaultServices = [
  {
    icon: 'Users',
    title: "ADMISSION GUIDANCE",
    description:
      "We lead the students to the right course and right institution and help them achieve their academic ambitions. Our educational counseling offers the students the honest information on the various academic courses and institutions according to their merits.",
  },
  {
    icon: 'Compass',
    title: "CAREER COUNSELLING",
    description:
      "We offer the best counseling according to the student's academics, for the right selection of academic courses and institution.",
  },
  {
    icon: 'BookOpen',
    title: "COURSES INFORMATION",
    description:
      "We offer more than 1000's of courses for you. Our educational consultants offer outstanding information on the diverse courses that suit the career objectives, academic brilliance and financial capacity of the candidates.",
  },
  {
    icon: 'Building2',
    title: "COLLEGE INFORMATION",
    description:
      "We represent recognized and reputable educational institutions, universities and colleges across india.",
  },
  {
    icon: 'Presentation',
    title: "CONDUCTING EDUCATIONAL EXPO",
    description:
      "We conduct brilliant educational exhibitions, like Talent Turn, led by the intellect, Dr.G.S Pradeep to benefit the plus two students.",
  },
  {
    icon: 'GraduationCap',
    title: "TRAINING PROGRAMME",
    description:
      "We conduct different types of training programmes for the students to achieve their goals.",
  },
];

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = ref(db, 'services_list');
    const unsubscribe = onValue(servicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setServices(list);
      } else {
        setServices(defaultServices); // Fallback
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Services | Interman"
        description="Explore our wide range of educational services including admission guidance, career counseling, course information, and more."
      />
      <Navbar />
      <main>
        <PageHeader title="SERVICES" breadcrumb="Services" />

        <section className="py-24 bg-background relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10" />
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="section-title">
                OUR SERVICES
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = ICON_MAP[service.icon] || Users;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group p-8 glass-card rounded-2xl border border-white/20 hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110" />

                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${service.imageUrl ? 'p-0 overflow-hidden' : 'bg-gradient-to-br from-primary to-secondary'}`}>
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-110"
                        />
                      ) : (
                        <Icon className="w-8 h-8 text-white transition-colors" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold font-display text-foreground mb-4 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="absolute -left-20 top-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
                    Why Our Services Stand Out
                  </h3>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>

                <ul className="grid gap-4">
                  {[
                    "Free counselling for all students",
                    "Expert guidance from experienced consultants",
                    "Access to 1000+ courses and institutions",
                    "Scholarship assistance and bank loan support",
                    "Regular follow-up with students and institutions",
                    "21+ years of trusted service",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 glass-card rounded-xl hover:bg-card/80 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-secondary/20 rounded-3xl transform rotate-3" />
                <div className="bg-gradient-to-br from-primary to-primary/90 p-10 rounded-3xl text-primary-foreground shadow-2xl relative z-10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                  <h4 className="text-2xl font-bold mb-4 font-display">Get Started Today</h4>
                  <p className="mb-8 opacity-90 text-lg leading-relaxed">
                    Take the first step towards your academic future. Contact us for a
                    free consultation and let our experts guide you to success.
                  </p>
                  <a
                    href="tel:+919747442222"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
                  >
                    Call: +91 9747 44 22 22
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
