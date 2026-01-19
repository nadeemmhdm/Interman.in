import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  image: string;
  description: string;
  programs: string[];
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coursesRef = ref(db, 'courses');
    const unsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCourses(list);
      } else {
        setCourses([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Courses | Interman"
        description="Browse through our extensive list of courses and programs. Find the perfect academic path for your future career."
      />
      <Navbar />
      <main>
        <PageHeader title="COURSES" breadcrumb="Courses" />

        <section className="py-24 bg-background relative">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-muted to-transparent -z-10" />

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="section-title">
                POPULAR COURSES
              </h2>
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-muted-foreground/20">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No courses available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group glass-card rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Course+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <h3 className="text-xl font-bold font-display text-white mb-1 group-hover:text-secondary transition-colors">
                          {course.title}
                        </h3>
                        <div className="h-1 w-12 bg-primary group-hover:w-20 transition-all duration-300 rounded-full" />
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col bg-card/40 backdrop-blur-sm">
                      {course.description && (
                        <p className="text-sm text-foreground mb-6 opacity-80 leading-relaxed line-clamp-3">
                          {course.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {course.programs && course.programs.map((prog, idx) => (
                          <span key={idx} className="text-xs font-semibold px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full hover:bg-secondary hover:text-white transition-colors cursor-default">
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 -z-10" />
          <div className="absolute inset-0 bg-[url('@/assets/pattern.png')] opacity-10 mix-blend-overlay -z-10" />

          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6">
                Need Help Choosing the Right Course?
              </h2>
              <p className="text-white/90 mb-10 text-lg leading-relaxed">
                Our expert counselors will guide you through the options to find the perfect course that
                aligns with your interests, skills, and future career goals.
              </p>
              <a
                href="tel:+919747442222"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary rounded-full font-bold text-lg hover:bg-secondary hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Book Free Consultation
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
