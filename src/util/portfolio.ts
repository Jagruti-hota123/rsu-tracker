import type { Grant } from "@/store/grantSlice";

export const calculateGrantMetrics = (grant: Grant) => {
  const grantValue = grant.numberOfShares * grant.grantPrice;
  const currentValue = (grant.currentPrice ?? 0) * grant.numberOfShares;

  const vestedValue = currentValue;

  const federalWithholding = vestedValue * 0.22;
  const estimatedTotalTax = vestedValue * 0.35;
  const netProceeds = vestedValue - estimatedTotalTax;

  const gainLoss = currentValue - grantValue;
  const gainLossPercent = grantValue > 0 ? (gainLoss / grantValue) * 100 : 0;

  return {
    grantValue,
    currentValue,
    vestedValue,
    federalWithholding,
    estimatedTotalTax,
    netProceeds,
    gainLoss,
    gainLossPercent,
  };
};

export const calculatePortfolioMetrics = (grants: Grant[]) => {
  const portfolioValue = grants.reduce(
    (sum, g) => sum + (g.currentPrice ?? 0) * g.numberOfShares,
    0
  );
  const totalGrantValue = grants.reduce(
    (sum, g) => sum + g.grantPrice * g.numberOfShares,
    0
  );

  const gainLoss = portfolioValue - totalGrantValue;
  const gainLossPercent =
    totalGrantValue > 0 ? (gainLoss / totalGrantValue) * 100 : 0;

  const companyTotals: Record<string, number> = {};
  grants.forEach((g) => {
    companyTotals[g.company] =
      (companyTotals[g.company] || 0) +
      (g.currentPrice ?? 0) * g.numberOfShares;
  });

  const companyConcentrations = Object.entries(companyTotals).map(
    ([company, value]) => ({
      company,
      value,
      percent: portfolioValue > 0 ? (value / portfolioValue) * 100 : 0,
    })
  );

  const highestConcentration = Math.max(
    ...companyConcentrations.map((c) => c.percent)
  );

  let risk: "Low" | "Medium" | "High" = "Low";
  if (highestConcentration >= 70) risk = "High";
  else if (highestConcentration >= 40) risk = "Medium";

  return {
    portfolioValue,
    totalGrantValue,
    gainLoss,
    gainLossPercent,
    companyConcentrations,
    risk,
  };
};
