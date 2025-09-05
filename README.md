# Dynamic Portfolio Grants Dashboard

A **frontend-only dashboard** to visualize stock grants and portfolio insights.

## Features
- Total Portfolio Value, Overall Gains/Losses, Daily Change.
- Dynamic Company Breakdown Pie Chart.
- Calculates **vested shares** for:
  - Standard vesting (25% per year)
  - Custom vesting schedules
- Handles **API rate limits** using sample data.
- Dark mode support.

## Sample Data
```ts
export const sampleData = [
  { id: "1", company: "Apple Inc.", symbol: "AAPL", grantDate: "2023-01-15", numberOfShares: 100, grantPrice: 150.25, vestingSchedule: "standard", vestedShares: 25, currentPrice: 400.25 },
  { id: "2", company: "Alphabet Inc.", symbol: "GOOGL", grantDate: "2023-02-01", numberOfShares: 50, grantPrice: 120.8, vestingSchedule: "standard", vestedShares: 12, currentPrice: 400.8 },
  { id: "3", company: "Microsoft Corporation", symbol: "MSFT", grantDate: "2023-03-10", numberOfShares: 75, grantPrice: 380.15, vestingSchedule: "custom", customVesting: [{ vestingDate: "2024-03-10", percentageVested: 25 }, { vestingDate: "2025-03-10", percentageVested: 50 }, { vestingDate: "2026-03-10", percentageVested: 100 }], vestedShares: 18, currentPrice: 400.15 },
  { id: "4", company: "Tesla Inc.", symbol: "TSLA", grantDate: "2023-04-20", numberOfShares: 200, grantPrice: 220.9, vestingSchedule: "standard", vestedShares: 50, currentPrice: 400.9 },
  { id: "5", company: "Amazon.com Inc.", symbol: "AMZN", grantDate: "2023-05-15", numberOfShares: 80, grantPrice: 125.6, vestingSchedule: "standard", vestedShares: 20, currentPrice: 400.6 },
];
Tech & Dependencies
React, TypeScript, TailwindCSS, shadcn/ui, Radix UI, Recharts

React Router, React Query, dayjs, uuid, clsx

How It Works
Uses Alpha Vantage API for current prices (with rate-limit handling via sample data).

Computes vested shares dynamically:

Uses standard or custom vesting schedules.

Skips API call if currentPrice exists.

Run Locally
bash
Copy code
git clone <repo-url>
cd <project-folder>
npm install
npm run dev
Open http://localhost:5173