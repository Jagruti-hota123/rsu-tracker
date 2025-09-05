import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface StocksState {
  prices: { [symbol: string]: StockPrice };
  loading: boolean;
  error: string | null;
}

const getInitialStocks = (): StocksState => {
  try {
    const local = localStorage.getItem("stocks");
    if (local) {
      return JSON.parse(local) as StocksState;
    }
  } catch (err) {
    console.warn(
      "Failed to parse stocks from localStorage, using default state.",
      err
    );
  }

  return {
    prices: {},
    loading: false,
    error: null,
  };
};

const initialState: StocksState = getInitialStocks();

const stocksSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStockPrices: (state, action: PayloadAction<StockPrice[]>) => {
      action.payload.forEach((price) => {
        state.prices[price.symbol] = price;
      });
      localStorage.setItem("stocks", JSON.stringify(state));
    },
  },
});

export const { setStockPrices } = stocksSlice.actions;

export default stocksSlice.reducer;
