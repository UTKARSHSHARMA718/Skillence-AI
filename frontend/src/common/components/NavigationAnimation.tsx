'use client'

import { motion } from "framer-motion";

const NavigationAnimation: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`${className} flex flex-col flex-1 min-h-0`}
    >
      {children}
    </motion.div>
  );
};

export default NavigationAnimation;
