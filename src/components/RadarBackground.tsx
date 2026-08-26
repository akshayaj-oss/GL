import { motion } from 'motion/react';

export const RadarBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-20 mix-blend-screen z-0">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
      className="absolute w-[800px] h-[800px] border border-brand-lavender/20 rounded-full border-dashed" 
    />
    <motion.div 
      animate={{ rotate: -360 }} 
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }} 
      className="absolute w-[600px] h-[600px] border border-brand-lavender/10 rounded-full border-dashed" 
    />
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }} 
      className="absolute w-[400px] h-[400px] border border-white/5 rounded-full" 
    />
    <div className="absolute w-[2px] h-[100vh] bg-gradient-to-b from-transparent via-brand-lavender/5 to-transparent" />
    <div className="absolute w-[100vw] h-[2px] bg-gradient-to-r from-transparent via-brand-lavender/5 to-transparent" />
    
    {/* Blinking center dot */}
    <motion.div 
      animate={{ opacity: [0.2, 0.8, 0.2] }} 
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-2 h-2 bg-brand-lavender/40 rounded-full blur-[2px]"
    />
  </div>
);
