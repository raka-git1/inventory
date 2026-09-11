import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <span className="text-lg font-bold">SI</span>
          </div>
          <h1 className="text-2xl font-bold">Smart Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Management System</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
