"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [isHover, setIsHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsHover(
        !!e.target.closest?.(
          "a, button, [role='button'], input, select, textarea, label",
        ),
      );
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[300] h-3 w-3 rounded-full"
      style={{
        x: sx,
        y: sy,
        marginLeft: -6,
        marginTop: -6,
        backgroundColor: "var(--ph-coral)",
      }}
      animate={{ scale: isHover ? 3 : 1, opacity: isHover ? 0.35 : 0.9 }}
      transition={{ duration: 0.15 }}
    />
  );
};

export default CustomCursor;
