import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { FrameMotionWrapper } from "@/components/framer-motion";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MobileAnalytics = () => {
  const navigate = useNavigate();
  const grants = useSelector((state: RootState) => state.grants.grants);

  const portfolioData = useMemo(() => {
    const total = grants.reduce(
      (acc, g: any) => acc + (g.vestedShares ?? 0) * (g.currentPrice ?? 0),
      0
    );
    return months.map((month, idx) => ({
      month,
      value: Math.round(total * (0.85 + idx * 0.02)),
    }));
  }, [grants]);

  const stockPerformanceData = useMemo(() => {
    return grants.map((g) => {
      const growth =
        g.currentPrice && g.grantPrice
          ? ((g.currentPrice - g.grantPrice) / g.grantPrice) * 100
          : 0;
      return {
        name: g.symbol,
        value: Number(growth.toFixed(2)),
      };
    });
  }, [grants]);

  const riskAnalysisData = useMemo(() => {
    return grants.map((g) => ({
      name: g.symbol,
      value: Math.floor(Math.random() * 20) - 10,
    }));
  }, [grants]);

  const totalValue = useMemo(
    () =>
      grants.reduce(
        (acc, g: any) => acc + (g.vestedShares ?? 0) * (g.currentPrice ?? 0),
        0
      ),
    [grants]
  );

  return (
    <FrameMotionWrapper key="analytics">
      <div className="mobile-container">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Analytics & Insights</h1>
          <div className="w-9" />
        </div>

        <Card className="">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <p className=" text-sm">Portfolio Value</p>
                <p className=" text-xs">Last 12 Months</p>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">
                  ${totalValue.toLocaleString()}
                </span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    +
                    {(
                      ((portfolioData.at(-1)?.value ?? 0) /
                        (portfolioData[0]?.value ?? 1)) *
                        100 -
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioData}>
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-medium ">Stock Performance</h3>
          <Card className="">
            <CardContent className="p-4">
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockPerformanceData}>
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="">
          <CardContent className="p-4">
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskAnalysisData}>
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hold vs. Sell</h3>
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <Badge className="bg-yellow-500 text-black font-medium mb-3">
                  HOLD
                </Badge>
                <p className=" text-sm leading-relaxed">
                  Based on current market trends and your portfolio's
                  diversification, we recommend holding your shares for
                  potential long-term growth.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FrameMotionWrapper>
  );
};

export default MobileAnalytics;
