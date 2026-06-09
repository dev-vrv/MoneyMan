"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: number;
  margin?: string;
  blur?: number;
  scale?: number;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  distance = 28,
  once = true,
  amount = 0.01,
  margin = "0px 0px 12% 0px",
  blur = 10,
  scale = 0.985,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once,
    amount,
    margin,
  });

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: distance,
        scale,
        filter: `blur(${blur}px)`,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }
          : {
              opacity: 0,
              y: distance,
              scale,
              filter: `blur(${blur}px)`,
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
