import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { checkBalance } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2, Coins } from "lucide-react";
import { toast } from "sonner";

export default function BalancePage() {
  const { config, isConfigured } = useConfig();
  const [address, setAddress] = useState("");
  const [type, setType] = useState("1");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<any>(null);

  const handleCheck = async () => {
    if (!isConfigured) { toast.error("Настройте подключение"); return; }
    if (!address) { toast.error("Введите адрес"); return; }
    setLoading(true);
    try {
      const res = await checkBalance(config, address, parseInt(type), contractAddress || undefined);
      if (res.status) {
        setBalance(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Баланс</h1>
          <p className="text-muted-foreground text-sm">Проверка баланса кошелька</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-5">
        <div className="space-y-2">
          <Label>Адрес кошелька</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." />
        </div>

        <div className="space-y-2">
          <Label>Тип баланса</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Нативная монета (ETH/BNB/TRX)</SelectItem>
              <SelectItem value="2">Токен (ERC20/BEP20)</SelectItem>
              <SelectItem value="3">Оба</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(type === "2" || type === "3") && (
          <div className="space-y-2">
            <Label>Адрес контракта</Label>
            <Input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="0x..." />
          </div>
        )}

        <Button onClick={handleCheck} disabled={loading} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Проверить баланс
        </Button>

        {balance && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <BalanceCard label="Нативный баланс" value={balance.net_balance} />
            <BalanceCard label="Токен баланс" value={balance.token_balance} />
          </div>
        )}
      </div>
    </div>
  );
}

function BalanceCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-bold font-heading">{value || "0"}</p>
    </div>
  );
}
