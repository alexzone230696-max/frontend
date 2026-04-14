import { NavLink, Outlet } from "react-router-dom";
import { Wallet, Settings, Send, Coins, FileSearch, Menu, X } from "lucide-react";
import { useState } from "react";
import { useConfig } from "@/contexts/ConfigContext";

const navItems = [
  { to: "/", icon: Wallet, label: "Кошелёк" },
  { to: "/balance", icon: Coins, label: "Баланс" },
  { to: "/send", icon: Send, label: "Отправить" },
  { to: "/tools", icon: FileSearch, label: "Инструменты" },
  { to: "/settings", icon: Settings, label: "Настройки" },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isConfigured } = useConfig();

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/40 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-lg">NodeWallet</span>
        </div>
        <Nav close={() => {}} />
        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${isConfigured ? "bg-success animate-pulse-glow" : "bg-destructive"}`} />
            {isConfigured ? "Подключено" : "Не настроено"}
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold">NodeWallet</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-xl p-6">
          <Nav close={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

function Nav({ close }: { close: () => void }) {
  return (
    <nav className="space-y-1.5">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={close}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
