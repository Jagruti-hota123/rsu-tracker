import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.5,
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  decimals?: number;
}) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest: any) =>
    latest.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );

  useEffect(() => {
    const controls = animate(motionValue, value, { duration });
    return controls.stop;
  }, [motionValue, value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};
