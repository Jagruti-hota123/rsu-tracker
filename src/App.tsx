import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard";
import { ThemeProvider } from "./components/ui/themeProvider";
import MobileAnalytics from "./pages/analytics";
import AllGrantsPage from "./pages/all-grants";
import AddEditGrantPage from "./pages/addEditGrantPage";
import MobileGrantDetails from "./pages/details";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-grants" element={<AllGrantsPage />} />
            <Route path="/addEditGrantPage" element={<AddEditGrantPage />} />
            <Route path="/analytics" element={<MobileAnalytics />} />
            <Route path="/grantDetails/:id" element={<MobileGrantDetails />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}
