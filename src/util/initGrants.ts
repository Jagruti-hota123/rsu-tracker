// store/initGrants.ts
import { sampleData } from "@/data/sample";
import { setGrants } from "@/store/grantSlice";
import type { Store } from "@reduxjs/toolkit";

export const loadInitialGrants = (store: Store) => {
  const saved = localStorage.getItem("grants");

  if (saved) {
    store.dispatch(setGrants(JSON.parse(saved)));
  } else {
    localStorage.setItem("grants", JSON.stringify(sampleData));
    store.dispatch(setGrants(sampleData));
  }
};
