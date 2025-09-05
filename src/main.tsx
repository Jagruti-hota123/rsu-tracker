import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";        
import { store } from "./store/store";             
import { loadInitialGrants } from "./util/initGrants.ts";

const queryClient = new QueryClient();

loadInitialGrants(store);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>  
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
