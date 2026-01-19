import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ChevronRight } from "lucide-react";
import logo from "@/assets/logo.png";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Services", path: "/services" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact Us", path: "/contact" },
];

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-muted pt-16 pb-6">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* About */}
          <motion.div variants={itemVariants} className="space-y-4">
            <img src={logo} alt="Interman" className="h-16 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Interman Educational Services, the leading educational consultants is established in 1998, by Mohamed Ali N.K, with the headquarters at Valanchery, in Malappuram district of Kerala, India.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-2 border-2 border-foreground text-foreground text-sm font-medium rounded-lg hover:bg-foreground hover:text-background transition-colors"
            >
              READ MORE
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group"
                  >
                    <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">CORPORATE OFFICE</p>
                  <p>Valanchery Dhana Tower, Opp.Bus Stand, Malappuram Dt. Kerala, India, Pin : 676552</p>
                </div>
              </div>
              <a
                href="tel:+919747442222"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="text-primary flex-shrink-0" size={18} />
                +91 9747 44 22 22
              </a>
              <a
                href="mailto:info@interman.in"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="text-primary flex-shrink-0" size={18} />
                info@interman.in
              </a>
            </div>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Connect With Us</h3>
            <p className="text-sm text-muted-foreground">Follow us on social media for updates and news.</p>
            <div className="flex gap-3 mb-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            <h4 className="text-md font-medium">Subscribe Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
                id="sub-email"
              />
              <button
                onClick={async () => {
                  const emailInput = document.getElementById('sub-email') as HTMLInputElement;
                  const email = emailInput.value;
                  if (email) {
                    try {
                      const { ref, push, set } = await import("firebase/database");
                      const { db } = await import("@/lib/firebase");
                      const { toast } = await import("sonner");

                      const subRef = push(ref(db, 'subscribers'));
                      await set(subRef, {
                        email,
                        timestamp: Date.now()
                      });
                      toast.success("Subscribed successfully!");
                      emailInput.value = '';
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
                className="bg-primary text-white px-4 py-2 text-sm rounded-r hover:bg-primary/90"
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Copyright © 2026 All Rights Reserved | Interman Educational Services
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
