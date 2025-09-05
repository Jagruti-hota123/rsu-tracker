import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setStockPrices } from "../store/stocksSlice";
import { updateGrantPrices } from "../store/grantSlice";

const API_KEY =
  import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";
const BASE_URL = "https://www.alphavantage.co/query";

let lastCallTime = 0;
const MIN_CALL_INTERVAL = 12_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureRateLimit = async () => {
  const now = Date.now();
  const diff = now - lastCallTime;
  if (diff < MIN_CALL_INTERVAL) {
    await delay(MIN_CALL_INTERVAL - diff);
  }
  lastCallTime = Date.now();
};

export const fetchStockQuote = async (symbol: string) => {
  await ensureRateLimit();

  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );

  if (!response.ok) throw new Error("Failed to fetch stock quote");

  const data = await response.json();

  if (data["Note"]) throw new Error("API call frequency limit reached");
  if (data["Error Message"]) throw new Error("Invalid symbol or API call");

  // TODO IDEALLY WE USE A BACKEND
  // ************* MOCKING IF THERE IS AN ERROR ***********//
  // **** SINCE THERE IS NOT BACKED  WE ARE MOCKING IT
  const quote = data["Global Quote"];
  if (!quote || !quote["05. price"]) {
    return {
      symbol,
      price: Math.random() * 200 + 100,
      change: Math.random() * 10 - 5,
      changePercent: Math.random() * 5 - 2.5,
      lastUpdated: new Date().toISOString(),
    };
  }

  return {
    symbol,
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
    lastUpdated: new Date().toISOString(),
  };
};

export const useBatchStockQuotes = (symbols: string[]) => {
  const dispatch = useDispatch();

  const grants = useSelector((state: any) => state.grants.grants);

  return useQuery({
    queryKey: ["stocks", symbols],
    queryFn: async () => {
      const uniqueSymbols = [...new Set(symbols)];
      const results = [];

      for (const symbol of uniqueSymbols) {
        try {
          const grantWithPrice = grants.find(
            (g: any) => g.symbol === symbol && g.currentPrice != null
          );
          if (grantWithPrice) {
            console.log(
              `Skipping API call for ${symbol}, using grant's currentPrice`
            );
            results.push({
              symbol,
              price: grantWithPrice.currentPrice,
              change: 0,
              changePercent: 0,
              lastUpdated: new Date().toISOString(),
            });
            continue;
          }

          const quote = await fetchStockQuote(symbol);
          results.push(quote);
        } catch (error) {
          console.error(`Failed to fetch ${symbol}:`, error);
          // TODO IDEALLY WE USE A BACKEND
          // ************* MOCKING IF THERE IS AN ERROR ***********//
          // **** SINCE THERE IS NOT BACKED  WE ARE MOCKING IT

          results.push({
            symbol,
            price: Math.random() * 200 + 100,
            change: 0,
            changePercent: 0,
            lastUpdated: new Date().toISOString(),
          });
        }
      }
      console.log(results, "RESULST");

      dispatch(setStockPrices(results));

      const priceMap: Record<string, number> = {};
      results.forEach((q) => {
        priceMap[q.symbol] = q.price;
      });
      dispatch(updateGrantPrices(priceMap));

      return results;
    },
    enabled: symbols.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};
