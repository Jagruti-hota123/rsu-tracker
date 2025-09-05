import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
export interface Grant {
  id: string;
  company: string;
  symbol: string;
  grantDate: string;
  numberOfShares: number;
  grantPrice: number;
  vestingSchedule: "standard" | "custom";
  customVesting?: Array<{
    vestingDate: string;
    percentageVested: number;
  }>;
  currentPrice?: number;
}

const initialGrants: Grant[] = [];

interface GrantState {
  grants: Grant[];
}

const initialState: GrantState = {
  grants: initialGrants,
};

const grantSlice = createSlice({
  name: "grants",
  initialState,
  reducers: {
    addGrant: (state, action: PayloadAction<Grant>) => {
      state.grants.push(action.payload);
      localStorage.setItem("grants", JSON.stringify(state.grants));
    },
    updateGrant: (state, action: PayloadAction<Grant>) => {
      const index = state.grants.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.grants[index] = action.payload;
      }
      localStorage.setItem("grants", JSON.stringify(state.grants));
    },
    deleteGrant: (state, action: PayloadAction<string>) => {
      state.grants = state.grants.filter((g) => g.id !== action.payload);
      localStorage.setItem("grants", JSON.stringify(state.grants));
    },
    setGrants: (state, action: PayloadAction<Grant[]>) => {
      state.grants = action.payload;
      localStorage.setItem("grants", JSON.stringify(state.grants));
    },
    updateGrantPrices: (
      state,
      action: PayloadAction<Record<string, number>>
    ) => {
      const priceMap = action.payload;
      state.grants.forEach((grant) => {
        if (priceMap[grant.symbol]) {
          grant.currentPrice = priceMap[grant.symbol];
        }
      });
      localStorage.setItem("grants", JSON.stringify(state.grants));
    },
  },
});

export const {
  addGrant,
  updateGrant,
  deleteGrant,
  updateGrantPrices,
  setGrants,
} = grantSlice.actions;

export default grantSlice.reducer;
