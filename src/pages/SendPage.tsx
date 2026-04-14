import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { sendEth, sendToken, checkEstimateGas } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Loader2, Fuel } from "lucide-react";
import { toast } from "sonner";

export default function SendPage() {
  const { config, isConfigured } = useConfig();
  const [loading, setLoading] = useState(false);
  const [gasLoading, setGasLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [gasResult, setGasResult] = useState<any>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [gasLimit, setGasLimit] = useState("");

  const handleSendEth = async () => {
    if (!isConfigured) { toast.error("Настройте подключение"); return; }
    setLoading(true);
    try {
      const res = await sendEth(config, {
        from_address: from, to_address: to, amount_value: amount,
        private_key: privateKey, gas_limit: gasLimit ? parseInt(gasLimit) : undefined,
      });
      if (res.status) { setResult(res.data); toast.success("Транзакция отправлена!"); }
      else toast.error(res.message);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const handleSendToken = async () => {
    if (!isConfigured) { toast.error("Настройте подключение"); return; }
    setLoading(true);
    try {
      const res = await sendToken(config, {
        from_address: from, to_address: to, amount_value: amount,
        private_key: privateKey, contract_address: contractAddress,
        gas_limit: gasLimit ? parseInt(gasLimit) : undefined,
      });
      if (res.status) { setResult(res.data); toast.success("Токены отправлены!"); }
      else toast.error(res.message);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const handleEstimateGas = async () => {
    if (!isConfigured) { toast.error("Настройте подключение"); return; }
    setGasLoading(true);
    try {
      const res = await checkEstimateGas(config, {
        from_address: from, to_address: to, amount_value: amount,
        contract_address: contractAddress || undefined,
        gas_limit: gasLimit ? parseInt(gasLimit) : undefined,
      });
      if (res.status) { setGasResult(res.data); toast.success("Газ рассчитан"); }
      else toast.error(res.message);
    } catch (e: any) { toast.error(e.message); }
    finally { setGasLoading(false); }
  };

  const commonFields = (
    <div className="space-y-4">
      <div className="space-y-2"><Label>Адрес отправителя</Label><Input value={from} onChange={e => setFrom(e.target.value)} placeholder="0x..." /></div>
      <div className="space-y-2"><Label>Адрес получателя</Label><Input value={to} onChange={e => setTo(e.target.value)} placeholder="0x..." /></div>
      <div className="space-y-2"><Label>Сумма</Label><Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.01" type="number" step="any" /></div>
      <div className="space-y-2"><Label>Приватный ключ</Label><Input value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="0x..." type="password" /></div>
      <div className="space-y-2"><Label>Gas Limit (необязательно)</Label><Input value={gasLimit} onChange={e => setGasLimit(e.target.value)} placeholder="21000" /></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10">
          <Send className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Отправить</h1>
          <p className="text-muted-foreground text-sm">Отправка монет и токенов</p>
        </div>
      </div>

      <Tabs defaultValue="eth" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="eth">Нативная монета</TabsTrigger>
          <TabsTrigger value="token">Токен</TabsTrigger>
        </TabsList>

        <TabsContent value="eth" className="glass rounded-xl p-6 space-y-5 mt-4">
          {commonFields}
          <div className="flex gap-3">
            <Button onClick={handleEstimateGas} variant="secondary" disabled={gasLoading} className="flex-1">
              {gasLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fuel className="mr-2 h-4 w-4" />} Газ
            </Button>
            <Button onClick={handleSendEth} disabled={loading} className="flex-1 glow-accent bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Отправить
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="token" className="glass rounded-xl p-6 space-y-5 mt-4">
          {commonFields}
          <div className="space-y-2"><Label>Адрес контракта</Label><Input value={contractAddress} onChange={e => setContractAddress(e.target.value)} placeholder="0x..." /></div>
          <div className="flex gap-3">
            <Button onClick={handleEstimateGas} variant="secondary" disabled={gasLoading} className="flex-1">
              {gasLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fuel className="mr-2 h-4 w-4" />} Газ
            </Button>
            <Button onClick={handleSendToken} disabled={loading} className="flex-1 glow-accent bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Отправить
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {gasResult && (
        <div className="glass rounded-xl p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Расчёт газа</p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-muted/50 rounded-lg p-3"><p className="text-muted-foreground">Gas Price</p><p className="font-bold mt-1">{gasResult.gasPrice}</p></div>
            <div className="bg-muted/50 rounded-lg p-3"><p className="text-muted-foreground">Gas Limit</p><p className="font-bold mt-1">{gasResult.gasLimit}</p></div>
            <div className="bg-muted/50 rounded-lg p-3"><p className="text-muted-foreground">Fee</p><p className="font-bold mt-1">{gasResult.estimateGasFees}</p></div>
          </div>
        </div>
      )}

      {result && (
        <div className="glass rounded-xl p-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">Результат</p>
          <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-auto max-h-48 break-all">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
