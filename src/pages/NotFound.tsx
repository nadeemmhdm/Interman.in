import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { Home } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      <SEO title="Page Not Found | Interman" description="The page you are looking for does not exist." />

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('@/assets/pattern.png')] opacity-5 -z-10 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 glass-card p-12 rounded-3xl border border-white/20 shadow-2xl max-w-lg w-full relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />

        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <img
              src={logo}
              alt="Interman Logo"
              className="w-24 h-auto"
            />
          </div>
        </motion.div>

        <div>
          <h1 className="text-8xl font-bold font-display text-primary leading-none mb-2">404</h1>
          <p className="text-2xl font-semibold text-foreground">Page Not Found</p>
        </div>

        <p className="text-muted-foreground">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 group"
        >
          <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
