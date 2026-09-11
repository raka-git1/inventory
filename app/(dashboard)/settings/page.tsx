import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Pengaturan aplikasi akan ditambahkan setelah modul utama selesai.
      </CardContent>
    </Card>
  );
}
