import { configureStore } from "@reduxjs/toolkit";
import grantsReducer from "./grantSlice";
import stocksReducer from "./stocksSlice";

export const store = configureStore({
  reducer: {
    grants: grantsReducer,
    stocks: stocksReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("grants", JSON.stringify(state.grants.grants));
  localStorage.setItem("stocks", JSON.stringify(state.stocks.prices));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
