"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { Button, Input, Label } from "@/components/ui";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error || "Credenciales inválidas. Inténtalo de nuevo.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen flex bg-background text-foreground antialiased">
      <div className="hidden md:flex md:w-1/2 bg-emerald-950 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-emerald-950"></div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            RecySmart <span className="font-light text-emerald-200">Admin</span>
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
            Acceso Interno
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Gestión del ecosistema.
          </h1>
          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Portal administrativo exclusivo. Gestiona puntos de reciclaje, revisa el estado de los ciudadanos y supervisa los beneficios para el impulso de la economía circular.
          </p>
        </div>

        <div className="relative z-10 text-emerald-200/50 text-sm font-medium">
          &copy; 2026 RecySmart. Todos los derechos reservados.
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-900">
        <div className="w-full max-w-md bg-white dark:bg-slate-950 p-8 sm:p-10 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm max-sm:px-6 max-sm:py-8 transition-all duration-300">
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              RecySmart{" "}
              <span className="font-light text-muted-foreground">Admin</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
              Iniciar Sesión
            </h2>
            <p className="text-muted-foreground text-sm">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm font-medium rounded-xl border border-destructive/20 text-center animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-semibold text-sm">
                Correo Electrónico
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-border focus-visible:ring-emerald-500 transition-all text-sm w-full"
                  placeholder="admin@recysmart.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="font-semibold text-sm">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-border focus-visible:ring-emerald-500 transition-all text-sm w-full"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold mt-4 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Acceder
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium">
            <Lock className="w-3.5 h-3.5" />
            <span>Conexión cifrada de extremo a extremo</span>
          </div>
        </div>
      </div>
    </main>
  );
}
