import type { RootState } from "@/store/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Label, Pie, PieChart } from "recharts";

export const RSUPieDonut = () => {
  const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

  const grants = useSelector((state: RootState) => state.grants.grants);

  const rsuData = useMemo(() => {
    const map = new Map<string, number>();

    grants.forEach((g: any) => {
      const value = (g?.vestedShares ?? 0) * (g.currentPrice ?? 0);
      map.set(g.company, (map.get(g.company) ?? 0) + value);
    });

    return Array.from(map.entries()).map(([company, value]) => ({
      company,
      value,
      fill: randomColor(),
    }));
  }, [grants]);

  const totalValue = useMemo(
    () => rsuData.reduce((acc, curr) => acc + curr.value, 0),
    [rsuData]
  );

  return (
    <motion.div
      className="flex flex-col rounded-2xl border shadow-md p-4"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-lg font-bold">RSU Portfolio</h2>
        <p className="text-sm text-muted-foreground">
          Based on vested shares × current price
        </p>
      </motion.div>

      <motion.div
        className="flex-1 flex justify-center px-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.8,
          type: "spring",
          stiffness: 100,
        }}
      >
        <PieChart width={320} height={280}>
          <Pie
            data={rsuData}
            dataKey="value"
            nameKey="company"
            cx={160}
            cy={140}
            innerRadius={60}
            outerRadius={90}
            strokeWidth={5}
            labelLine={false}
            label={({ name, percent }: any) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-lg font-bold fill-foreground"
                      >
                        ${totalValue.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 18}
                        className="text-sm fill-muted-foreground"
                      >
                        Total Value
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </motion.div>
    </motion.div>
  );
};
