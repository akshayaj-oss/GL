import { motion } from 'motion/react';

const messages = [
  "Let's see where this goes.",
  "Interesting...",
  "We're getting closer.",
  "Okay. We see it.",
  "We think we've got you."
];

export const TribeMeter = ({ current, total }: { current: number, total: number }) => {
  const progress = (current / total) * 100;
  
  return (
    <div className="w-full max-w-sm mx-auto mb-16 flex flex-col items-center relative z-10">
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-widest text-brand-lavender/70 mb-6 font-mono h-4"
      >
        {messages[current] || messages[messages.length - 1]}
      </motion.div>
      <div className="flex items-center space-x-4 w-full">
        <span className="text-xs font-mono text-brand-lavender/40">01</span>
        <div className="flex-1 h-[1px] bg-white/10 relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-brand-lavender shadow-[0_0_8px_rgba(230,230,250,0.6)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 w-1.5 h-1.5 rounded-full bg-brand-lavender shadow-[0_0_8px_rgba(230,230,250,0.8)]"
            initial={false}
            animate={{ left: `${progress}%`, y: '-50%', x: '-50%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        <span className="text-xs font-mono text-brand-lavender/40">05</span>
      </div>
    </div>
  );
};
