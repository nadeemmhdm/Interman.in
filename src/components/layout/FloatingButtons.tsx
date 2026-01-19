import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

const FloatingButtons = () => {
  return (
    <div className="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
      <motion.a
        href="tel:+919747442222"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg relative"
      >
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-30" />
        <Phone size={22} />
      </motion.a>
      
      <motion.a
        href="https://wa.me/919747442222"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 rounded-full bg-green-500 text-primary-foreground flex items-center justify-center shadow-lg"
      >
        <MessageCircle size={22} />
      </motion.a>
    </div>
  );
};

export default FloatingButtons;
