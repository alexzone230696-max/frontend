import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { getTransactionData, getContractDetails, getAddressByPk, getNetworkId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileSearch, Loader2, Key, Globe, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ToolsPage() {
  const { config, isConfigured } = useConfig();

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <FileSearch className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Инструменты</h1>
          <p className="text-muted-foreground text-sm">Утилиты и просмотр данных</p>
        </div>
      </div>

      <Tabs defaultValue="tx" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tx" className="text-xs">TX Hash</TabsTrigger>
          <TabsTrigger value="contract" className="text-xs">Контракт</TabsTrigger>
          <TabsTrigger value="pk" className="text-xs">PK → Addr</TabsTrigger>
          <TabsTrigger value="network" className="text-xs">Сеть</TabsTrigger>
        </TabsList>

        <TabsContent value="tx"><ToolCard config={config} isConfigured={isConfigured} tool="tx" /></TabsContent>
        <TabsContent value="contract"><ToolCard config={config} isConfigured={isConfigured} tool="contract" /></TabsContent>
        <TabsContent value="pk"><ToolCard config={config} isConfigured={isConfigured} tool="pk" /></TabsContent>
        <TabsContent value="network"><ToolCard config={config} isConfigured={isConfigured} tool="network" /></TabsContent>
      </Tabs>
    </div>
  );
}

function ToolCard({ config, isConfigured, tool }: { config: any; isConfigured: boolean; tool: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const labels: Record<string, { title: string; placeholder: string; icon: any }> = {
    tx: { title: "Данные транзакции", placeholder: "Transaction hash...", icon: FileText },
    contract: { title: "Детали контракта", placeholder: "Contract address...", icon: FileSearch },
    pk: { title: "Адрес из приватного ключа", placeholder: "Private key...", icon: Key },
    network: { title: "ID сети", placeholder: "", icon: Globe },
  };

  const handleAction = async () => {
    if (!isConfigured) { toast.error("Настройте подключение"); return; }
    setLoading(true);
    try {
      let res;
      if (tool === "tx") res = await getTransactionData(config, input);
      else if (tool === "contract") res = await getContractDetails(config, input);
      else if (tool === "pk") res = await getAddressByPk(config, input);
      else res = await getNetworkId(config);

      if (res.status) setResult(res.data);
      else toast.error(res.message);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const l = labels[tool];
  const Icon = l.icon;

  return (
    <div className="glass rounded-xl p-6 space-y-5 mt-4">
      <p className="font-medium flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {l.title}</p>
      {tool !== "network" && (
        <div className="space-y-2">
          <Label>Ввод</Label>
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder={l.placeholder} type={tool === "pk" ? "password" : "text"} />
        </div>
      )}
      <Button onClick={handleAction} disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon className="mr-2 h-4 w-4" />}
        Выполнить
      </Button>
      {result && (
        <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-auto max-h-64 break-all">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
