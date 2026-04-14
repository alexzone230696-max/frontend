import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConfigProvider } from "@/contexts/ConfigContext";
import Layout from "@/components/Layout";
import CreateWalletPage from "@/pages/CreateWalletPage";
import BalancePage from "@/pages/BalancePage";
import SendPage from "@/pages/SendPage";
import ToolsPage from "@/pages/ToolsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ConfigProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<CreateWalletPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/send" element={<SendPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
