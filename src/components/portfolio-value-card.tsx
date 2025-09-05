import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { calculateVestedShares } from "./GrantCard";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnimatedCounter } from "./animated-counter";

export const TotalPortfolioValueCard = () => {
  const grants = useSelector((state: RootState) => state.grants.grants);

  const totalValue = grants.reduce((sum, g) => {
    if (g.currentPrice) {
      const vestedShares = calculateVestedShares(g) || 0;
      return sum + g.currentPrice * vestedShares;
    }
    return sum;
  }, 0);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Total Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatedCounter
            value={totalValue}
            prefix="$"
            className="text-3xl font-bold text-foreground"
            duration={2.5}
            decimals={2}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
