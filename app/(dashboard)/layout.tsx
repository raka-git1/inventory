import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSessionToken, verifySessionToken } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getSessionToken();
  const authenticated = await verifySessionToken(token);

  if (!authenticated) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
