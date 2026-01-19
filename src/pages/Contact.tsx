import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/layout/PageHeader";
import SEO from "@/components/SEO";
import { MapPin, Phone, Mail, Send, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = {
  corporate: {
    title: "CORPORATE OFFICE",
    address:
      "Valanchery, Dhana Tower, Opp.Bus Stand, Malappuram Dt. Kerala, India, Pin: 676552",
    phones: ["+91 99 46 211 243", "+91 9747 44 22 22"],
  },
  branches: [
    {
      title: "BRANCHES",
      address:
        "Malappuram, Peekey Arcade, Opposite Muncipal Bus Stand, Down Hill, Malappuram Dt., Kerala, India Pin: 676504",
      phones: ["+91 974 52 5 13 40", "+91 96 56 477 477"],
    },
    {
      title: "BRANCH OFFICE",
      address:
        "Opposite Rajah's Higher Secondary School, NH Parambilangadi, Kottakkal, Malappuram Dt, Kerala Pin: 676503",
      phones: [
        "+91 95 44 412 500",
        "+91 95 44 412 700",
        "+91 80 86 444 944",
        "+91 95 44 402 700",
      ],
    },
  ],
  email: "info@interman.in",
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { ref, push, set } = await import("firebase/database");
      const { db } = await import("@/lib/firebase");

      const submissionsRef = ref(db, 'contact_submissions');
      const newSubmissionRef = push(submissionsRef);
      await set(newSubmissionRef, {
        ...formData,
        timestamp: Date.now()
      });

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

      setFormData({ name: "", mobile: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contact Us | Interman"
        description="Get in touch with Interman Educational Services. Visit our corporate office or branches in Malappuram, Kerala. Call us for expert educational counseling."
      />
      <Navbar />
      <main>
        <PageHeader title="CONTACT US" breadcrumb="Contact Us" />

        {/* Map Section - Premium Frame */}
        <section className="w-full relative px-4 mt-8">
          <div className="container mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-card h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7835.973871981823!2d76.07255100000002!3d10.888597!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7b63260831c3b%3A0x918f2927828db137!2sInterman%20Educational%20Service!5e0!3m2!1sen!2sus!4v1767696654492!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Interman Location"
            />
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-3xl shadow-lg border-t-4 border-primary"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold font-display text-foreground mb-2">
                    SEND US A MESSAGE
                  </h2>
                  <p className="text-muted-foreground">We'd love to hear from you. Fill out the form below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-card transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Mobile Number"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-card transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-card transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <MessageSquare
                      className="absolute left-4 top-6 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      rows={5}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-card transition-all resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold tracking-wide shadow-lg hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send size={18} />
                        SEND MESSAGE
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold font-display text-foreground mb-4">
                    CONTACT INFORMATION
                  </h2>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>

                <div className="space-y-6">
                  {/* Corporate Office */}
                  <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary hover:bg-card/80 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground mb-1">
                          {contactInfo.corporate.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {contactInfo.corporate.address}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {contactInfo.corporate.phones.map((phone, idx) => (
                            <a
                              key={idx}
                              href={`tel:${phone.replace(/\s/g, "")}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
                            >
                              <Phone size={14} />
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branches */}
                  {contactInfo.branches.map((branch, index) => (
                    <div key={index} className="glass-card p-6 rounded-2xl border-l-4 border-l-secondary hover:bg-card/80 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                          <MapPin size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-foreground mb-1">
                            {branch.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                            {branch.address}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {branch.phones.map((phone, idx) => (
                              <a
                                key={idx}
                                href={`tel:${phone.replace(/\s/g, "")}`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-secondary transition-colors"
                              >
                                <Phone size={14} />
                                {phone}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Email */}
                  <div className="glass-card p-6 rounded-2xl border border-white/20 hover:bg-card/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white shadow-md">
                        <Mail size={24} />
                      </div>
                      <div>
                        <span className="block text-sm text-muted-foreground">Email us anytime</span>
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
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

export default Contact;
