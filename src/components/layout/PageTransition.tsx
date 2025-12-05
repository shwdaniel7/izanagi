import { motion } from 'framer-motion';
import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Começa invisível e um pouco para baixo
      animate={{ opacity: 1, y: 0 }}  // Sobe e aparece
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }} // Suave e elegante
      className="w-full"
    >
      {children}
    </motion.div>
  );
}