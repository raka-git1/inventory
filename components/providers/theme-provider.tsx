"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
    setReady(true);
  }, []);

  useEffect(() => {
    const apply = () => {
      const saved = localStorage.getItem("theme");
      if (!saved) return;
      document.documentElement.classList.toggle("dark", saved === "dark");
    };
    window.addEventListener("storage", apply);
    return () => window.removeEventListener("storage", apply);
  }, []);

  return <>{children}</>;
}

export function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return { dark, toggle };
}
