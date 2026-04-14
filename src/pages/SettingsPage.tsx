import { useState } from "react";
import { useConfig, NETWORKS } from "@/contexts/ConfigContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Check } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { config, setConfig } = useConfig();
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [customChainLink, setCustomChainLink] = useState(config.chainLink);
  const [networkType, setNetworkType] = useState(config.networkType);

  const handleNetworkChange = (name: string) => {
    setSelectedNetwork(name);
    if (name === "custom") return;
    const net = NETWORKS[name];
    if (net) {
      setCustomChainLink(net.chainLink);
      setNetworkType(net.networkType);
    }
  };

  const handleSave = () => {
    if (!apiKey || !customChainLink) {
      toast.error("API Key и Chain Link обязательны");
      return;
    }
    setConfig({ apiKey, chainLink: customChainLink, networkType });
    toast.success("Настройки сохранены");
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Настройки</h1>
          <p className="text-muted-foreground text-sm">Подключение к бэкенду</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <Label>API Key (headerkeys)</Label>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Введите API ключ..."
            type="password"
          />
        </div>

        <div className="space-y-2">
          <Label>Сеть</Label>
          <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите сеть или Custom" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(NETWORKS).map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
              <SelectItem value="custom">Custom RPC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Chain Link (RPC URL)</Label>
          <Input
            value={customChainLink}
            onChange={(e) => setCustomChainLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label>Network Type</Label>
          <Select value={networkType} onValueChange={setNetworkType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">ERC20 (4)</SelectItem>
              <SelectItem value="5">BEP20 (5)</SelectItem>
              <SelectItem value="6">TRC20 / TRX (6)</SelectItem>
              <SelectItem value="44">MATIC (44)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="w-full glow-primary">
          <Check className="mr-2 h-4 w-4" /> Сохранить
        </Button>
      </div>
    </div>
  );
}
