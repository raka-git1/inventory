"use client";

import { Bell, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const title = titles[pathname] ?? "Smart Inventory";

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(true)} aria-label="Buka menu">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Smart Inventory Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Notifikasi" title="Notifikasi">
            <Bell className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout" title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
