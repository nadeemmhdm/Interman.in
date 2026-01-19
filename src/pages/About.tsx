import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { Eye, Target, Compass } from "lucide-react";
import aboutImage from "@/assets/about-consulting.jpg";
import chairmanImage from "@/assets/chairman.jpg";

const stats = [
  "28 years of dedicated services",
  "More than 1000's of courses",
  "Series of educational expo",
  "Students support",
  "ISO 9001:2008 certified educational services",
  "More than 1000's of colleges and universities",
  "Global educational network",
  "Expert career counseling"
];

const About = () => {
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

  const [dynamicChairmanImage, setDynamicChairmanImage] = React.useState('');

  React.useEffect(() => {
    // Dynamically import to avoid build issues if db not init
    import('@/lib/firebase').then(({ db }) => {
      import('firebase/database').then(({ ref, onValue }) => {
        const aboutRef = ref(db, 'settings/about');
        onValue(aboutRef, (snapshot) => {
          const data = snapshot.val();
          if (data?.chairmanImage) {
            setDynamicChairmanImage(data.chairmanImage);
          }
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="About Us | Interman"
        description="Learn about Interman's 28+ years of excellence in educational consulting, our vision, mission, and the chairman's message."
      />
      <Navbar />
      <main>
        <PageHeader title="ABOUT US" breadcrumb="About Us" />

        {/* About Content */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10" />

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image & Stats */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8 relative"
              >
                <div className="relative z-10">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl transform rotate-3 -z-10" />
                  <img
                    src={aboutImage}
                    alt="About Interman"
                    className="w-full rounded-2xl shadow-2xl border-4 border-white/50"
                  />
                  <div className="absolute -bottom-10 -right-6 glass-card p-8 rounded-2xl border-t-4 border-primary shadow-xl flex flex-col items-center justify-center animate-float">
                    <span className="text-5xl font-bold font-display text-primary">28+</span>
                    <span className="text-sm font-bold tracking-widest uppercase text-foreground">Years of Service</span>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 bg-card/50 p-6 rounded-2xl border border-primary/10"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex items-start gap-3 text-sm font-medium text-foreground/80"
                    >
                      <div className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                      {stat}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-2">
                    Interman Educational Services
                  </h2>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>

                <div className="space-y-6 text-muted-foreground leading-relaxed text-lg font-light">
                  <p>
                    <strong className="text-foreground font-semibold">Interman Educational Services</strong>, established in 1998 by Mohamed Ali N.K, is a premier educational consultancy headquartered
                    in Valanchery, Kerala. We specialize in illuminating new academic pathways for aspiring students, guiding them towards
                    their ultimate professional goals.
                  </p>
                  <p>
                    Over nearly three decades, we have dedicated ourselves to providing free, high-quality counseling for higher education,
                    focusing on opportunities with substantial career prospects. Our improved network spans across India and abroad,
                    representing prestigious universities and institutions.
                  </p>
                  <p>
                    Our mission goes beyond admission; we act as architects of carriers. By analyzing a student's aptitude, academic brilliance,
                    and financial background, we identify courses that perfectly align with their ambitions, ensuring a future defined by success.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Chairman Message */}
        <section className="py-24 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="section-title">
                MESSAGE FROM THE CHAIRMAN
              </h2>
            </motion.div>

            <div className="glass-card p-8 md:p-12 rounded-3xl shadow-xl border border-white/40 bg-white/60 dark:bg-black/20">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-secondary/20 rounded-2xl transform -rotate-2 scale-105" />
                  <img
                    src={dynamicChairmanImage || chairmanImage}
                    alt="Chairman - Mohamed Ali N.K"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-lg relative z-10"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="space-y-2">
                    <p className="text-2xl font-display font-medium text-foreground italic">
                      "Dear students and well wishers,"
                    </p>
                  </div>

                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <p>
                      Welcome to Interman Educational Services. As we navigate the rapidly transforming global education landscape,
                      it is imperative that we adapt and seize the best opportunities for personal and societal advancement.
                    </p>
                    <p>
                      We believe quality education is the bedrock of a successful life, instilling not just knowledge but values
                      that help one persevere through life's challenges. Our goal is to shape personalities that inspire.
                    </p>
                    <p>
                      At Interman, we foster self-confidence through personalized interactions with our experienced counselors.
                      We are committed to finding the perfect academic fit for every student, considering their unique talents
                      and circumstances.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-primary/20">
                    <p className="text-foreground font-medium text-lg">With sincere regards,</p>
                    <div className="mt-2">
                      <p className="text-2xl font-display font-bold text-primary">Mohamed Ali N.K</p>
                      <p className="text-secondary font-medium tracking-wide text-sm uppercase">
                        Chairman & Managing Director
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision, Mission, Aim */}
        <section className="py-24 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Eye,
                  title: "Our Vision",
                  description:
                    "To provide honest, transparent counsel on academic courses and institutions, ensuring every student finds their rightful place based on merit and ambition. We strive to be the leading regional consultant offering unparalleled student support.",
                },
                {
                  icon: Target,
                  title: "Our Mission",
                  description:
                    "To empower students with the best educational services and provide professional support to our partners. We aim to build enduring relationships with our candidates and institutions, fostering a network of excellence.",
                },
                {
                  icon: Compass,
                  title: "Our Aim",
                  description:
                    "To guide students precisely to their dream courses and institutions. We act as the bridge to renowned global opportunities, ensuring that every candidate's academic ambition translates into career success.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="p-8 glass-card rounded-2xl border-t-4 border-t-primary/0 hover:border-t-primary transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-foreground mb-4 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
