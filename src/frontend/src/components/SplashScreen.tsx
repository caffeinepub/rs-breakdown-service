import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.83 0.175 89 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.83 0.175 89 / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <img
            src="/assets/generated/rs-logo-transparent.dim_400x400.png"
            alt="RS Breakdown Service Logo"
            className="w-40 h-40 object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-foreground leading-tight">
            RS <span className="text-primary">BREAKDOWN</span>
            <br />
            <span className="text-2xl sm:text-3xl tracking-[0.2em]">
              SERVICE
            </span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="text-muted-foreground text-base font-medium"
        >
          Delhi NCR&apos;s #1 Roadside Assistance
        </motion.p>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="inline-flex items-center gap-2 bg-primary/20 border border-primary/50 rounded-full px-5 py-2"
        >
          <span className="text-primary text-sm font-black uppercase tracking-wide">
            ⚡ 24/7 Emergency Service
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-48 h-0.5 bg-border rounded-full overflow-hidden mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 1, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
