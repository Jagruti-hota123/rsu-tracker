import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnimatedCounter } from "./animated-counter";

export const PortfolioSummary = () => {
  const grants = useSelector((state: RootState) => state.grants.grants);

  const overallGainLoss = grants.reduce((total, g) => {
    if (g.currentPrice) {
      return total + (g.currentPrice - g.grantPrice) * g.numberOfShares;
    }
    return total;
  }, 0);

  const dailyChange = grants.reduce((total, g) => {
    if (g.currentPrice) {
      return total + (g.currentPrice - g.grantPrice) * 0.01 * g.numberOfShares;
    }
    return total;
  }, 0);

  const overallPercent = grants.length
    ? (overallGainLoss /
        grants.reduce(
          (total, g) => total + g.grantPrice * g.numberOfShares,
          0
        )) *
      100
    : 0;

  const dailyPercent = grants.length
    ? (dailyChange /
        grants.reduce(
          (total, g) => total + g.grantPrice * g.numberOfShares,
          0
        )) *
      100
    : 0;

  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-sm">Overall Gains/Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedCounter
              value={Math.abs(overallGainLoss)}
              prefix={overallGainLoss >= 0 ? "+$" : "-$"}
              className={`text-lg font-bold ${
                overallGainLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
              duration={2}
              decimals={2}
            />
            <motion.p
              className={`${
                overallGainLoss >= 0 ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <AnimatedCounter
                value={Math.abs(overallPercent)}
                prefix={overallGainLoss >= 0 ? "+" : "-"}
                suffix="%"
                duration={2}
                decimals={2}
              />
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-sm">Daily Change</CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatedCounter
              value={Math.abs(dailyChange)}
              prefix={dailyChange >= 0 ? "+$" : "-$"}
              className={`text-lg font-bold ${
                dailyChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
              duration={2}
              decimals={2}
            />
            <motion.p
              className={`${
                dailyChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <AnimatedCounter
                value={Math.abs(dailyPercent)}
                prefix={dailyChange >= 0 ? "+" : "-"}
                suffix="%"
                duration={2}
                decimals={2}
              />
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
