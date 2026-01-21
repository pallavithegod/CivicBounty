import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [status, setStatus] = useState("INITIALIZING SYSTEM...");

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 5) + 1; // Random increment
      });
    }, 50);

    const statusInterval = setInterval(() => {
      const statuses = [
        "ESTABLISHING SECURE CONNECTION...",
        "VERIFYING BLOCKCHAIN NODE...",
        "LOADING CIVIC PROTOCOLS...",
        "DECRYPTING BOUNTY DATA...",
        "SYSTEM_READY"
      ];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      setTimeout(onComplete, 800); 
    }
  }, [percent, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center font-mono"
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="w-64">
        {/* Cyber Progress Bar */}
        <div className="flex justify-between text-xs text-primary mb-2 uppercase tracking-widest">
          <span>System Boot</span>
          <span>{Math.min(percent, 100)}%</span>
        </div>
        <div className="h-2 bg-card border border-glass-border relative overflow-hidden">
          <div 
            className="h-full bg-primary absolute top-0 left-0 transition-all duration-75 ease-out"
            style={{ width: `${percent}%` }}
          />
          {/* Scanline overlay on bar */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] w-1/2 h-full skew-x-12 animate-[scanline_2s_infinite]"></div>
        </div>
        
        {/* Status Text with Glitch */}
        <div className="mt-4 text-xs text-muted text-center h-4">
          <span className="animate-pulse">{status}</span>
        </div>
      </div>

      {/* Hexagon/Grid Decoration */}
      <div className="absolute bottom-10 text-[10px] text-glass-border flex gap-4 uppercase tracking-[0.2em]">
        <span>ID: 884-XJ</span>
        <span>Secure: TLS 1.3</span>
        <span>Node: 44.2</span>
      </div>
    </motion.div>
  );
};

export default Preloader;
