"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={dark ? "Aktifkan light mode" : "Aktifkan dark mode"}>
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
