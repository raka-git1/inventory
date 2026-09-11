"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Package, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("hidden shrink-0 border-r bg-card transition-[width] duration-200 md:flex md:flex-col", collapsed ? "w-[76px]" : "w-64")}>
      <div className={cn("flex h-16 items-center border-b", collapsed ? "justify-center px-3" : "gap-3 px-5")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Package className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Smart Inventory</p>
            <p className="truncate text-xs text-muted-foreground">Management System</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center rounded-lg py-2.5 text-sm transition-colors",
                collapsed ? "justify-center px-2" : "gap-3 px-3",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
