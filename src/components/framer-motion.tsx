import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FrameMotionWrapperProps {
  children: ReactNode;
  pageKey?: string;
  className?: string;
}

export const FrameMotionWrapper = ({
  children,
  pageKey = "page",
  className = "",
}: FrameMotionWrapperProps) => {
  return (
    <motion.div
      key={pageKey}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
};
