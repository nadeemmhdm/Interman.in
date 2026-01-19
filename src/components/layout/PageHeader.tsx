import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
}

const PageHeader = ({ title, breadcrumb }: PageHeaderProps) => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/90 py-16 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary-foreground rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-foreground rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <Link to="/" className="hover:text-primary-foreground transition-colors">
              Home
            </Link>
            <span>-</span>
            <span>{breadcrumb}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PageHeader;
