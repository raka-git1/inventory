"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Boxes },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button className="absolute inset-0 bg-black/40" aria-label="Tutup menu" onClick={onClose} />
      <aside className="relative h-full w-72 border-r bg-card p-4 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-semibold">Smart Inventory</span>
          <button className="rounded-md p-2 hover:bg-accent" onClick={onClose} aria-label="Tutup menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
