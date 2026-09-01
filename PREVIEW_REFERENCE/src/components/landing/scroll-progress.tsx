"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 origin-left z-[60] pointer-events-none"
    >
      <div className="h-full w-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-bright)] to-[var(--gold)]" />
    </motion.div>
  );
}
