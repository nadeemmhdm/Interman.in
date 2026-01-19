import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, Search } from "lucide-react";
import logo from "@/assets/logo.png";
import SearchOverlay from "@/components/search/SearchOverlay";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Gallery", path: "/gallery" },
  { name: "Reviews", path: "/reviews" },
  { name: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+919747442222" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone size={14} />
              <span>+91 9747 44 22 22</span>
            </a>
            <a href="mailto:info@interman.in" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail size={14} />
              <span>info@interman.in</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>ISO 9001:2008 Certified</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-card"
          : "bg-card"
          }`}
      >
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.img
                src={logo}
                alt="Interman Educational Services"
                className="h-14 md:h-16 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                      }`}
                  >
                    {link.name}
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: location.pathname === link.path ? "60%" : 0,
                    }}
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 ml-2 text-gray-600 hover:text-primary transition-colors hover:bg-gray-100 rounded-full"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* CTA Button */}
            <Link
              to="/contact"
              className="hidden lg:block"
            >
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full font-medium text-sm shadow-primary hover:shadow-hover transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-card"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-lg hover:bg-muted transition-colors text-gray-600"
                >
                  <Search size={20} />
                  <span>Search</span>
                </button>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === link.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <Link
                    to="/contact"
                    className="block w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg font-medium text-center"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;
