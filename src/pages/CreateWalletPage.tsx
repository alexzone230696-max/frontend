import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { createWallet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateWalletPage() {
  const { config, isConfigured } = useConfig();
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  const handleCreate = async () => {
    if (!isConfigured) {
      toast.error("Сначала настройте подключение в Настройках");
      return;
    }
    setLoading(true);
    try {
      const res = await createWallet(config);
      if (res.status) {
        setWallet(res.data);
        toast.success("Кошелёк создан!");
      } else {
        toast.error(res.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопирован`);
  };

  return (
    <div className="space-y-8 max-w-lg">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-accent/10">
          <Wallet className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Создать кошелёк</h1>
          <p className="text-muted-foreground text-sm">Генерация нового адреса</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-5">
        <Button onClick={handleCreate} disabled={loading} className="w-full glow-accent bg-accent text-accent-foreground hover:bg-accent/90">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
          Создать новый кошелёк
        </Button>

        {wallet && (
          <div className="space-y-4 pt-4 border-t border-border">
            <WalletField label="Адрес" value={wallet.address} onCopy={copy} />
            <WalletField label="Приватный ключ" value={wallet.privateKey} onCopy={copy} secret />
          </div>
        )}
      </div>
    </div>
  );
}

function WalletField({ label, value, onCopy, secret }: {
  label: string; value: string; onCopy: (v: string, l: string) => void; secret?: boolean;
}) {
  const [shown, setShown] = useState(!secret);
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <code
          className="flex-1 text-xs bg-muted/50 rounded-lg px-3 py-2.5 break-all font-mono cursor-pointer"
          onClick={() => secret && setShown(!shown)}
        >
          {shown ? value : "••••••••••••••••"}
        </code>
        <Button size="icon" variant="ghost" onClick={() => onCopy(value, label)} className="shrink-0">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
