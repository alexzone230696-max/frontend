import React, { createContext, useContext, useState, useEffect } from "react";
import type { ApiConfig } from "@/lib/api";

interface ConfigContextType {
  config: ApiConfig;
  setConfig: (config: ApiConfig) => void;
  isConfigured: boolean;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

const NETWORKS: Record<string, { chainLink: string; networkType: string }> = {
  "Ethereum Mainnet": { chainLink: "https://mainnet.infura.io/v3/YOUR_KEY", networkType: "4" },
  "Ethereum Goerli": { chainLink: "https://goerli.infura.io/v3/YOUR_KEY", networkType: "4" },
  "BSC Mainnet": { chainLink: "https://bsc-dataseed.binance.org/", networkType: "5" },
  "BSC Testnet": { chainLink: "https://data-seed-prebsc-1-s1.binance.org:8545/", networkType: "5" },
  "Polygon Mainnet": { chainLink: "https://polygon-rpc.com/", networkType: "44" },
  "Tron Mainnet": { chainLink: "https://api.trongrid.io", networkType: "6" },
  "Tron Testnet (Nile)": { chainLink: "https://nile.trongrid.io", networkType: "6" },
};

export { NETWORKS };

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfigState] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem("wallet_config");
    if (saved) return JSON.parse(saved);
    return { apiKey: "", chainLink: "", networkType: "4" };
  });

  const setConfig = (newConfig: ApiConfig) => {
    setConfigState(newConfig);
    localStorage.setItem("wallet_config", JSON.stringify(newConfig));
  };

  const isConfigured = !!(config.apiKey && config.chainLink);

  return (
    <ConfigContext.Provider value={{ config, setConfig, isConfigured }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
