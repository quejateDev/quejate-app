"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { EmailNotVerifiedModal } from "@/components/modals/email-not-verified-modal";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { login, user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard/pqr");
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();

        // Store user data in Zustand
        login(
          {
            id: userData.user.id,
            email: userData.user.email,
            name: userData.user.name,
            role: userData.user.role,
          },
          userData.token
        );

        // Optional: Show success message
        toast({
          title: "Inicio de sesión exitoso",
          description: "Bienvenido de nuevo!",
          variant: "default",
        });
      } else if (response.status === 403) {
        // Show verification modal if email is not verified
        setShowVerificationModal(true);
      } else {
        // Handle other errors
        toast({
          title: "Error",
          description: "Credenciales inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast({
        title: "Error",
        description: "Error al iniciar sesión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="flex grow bg-white"
      style={{ minHeight: "calc(100vh - 65px)" }}
    >
      <img
        className="w-1/2 border-none my-auto hidden md:block"
        src="/login-banner.svg"
      ></img>
      <div className="w-full md:w-1/2 rounded min-h-full flex items-center grow px-6">
        <Card className="rounded-none w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">
              Iniciar sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm md:text-base">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    className="pl-10 h-12 text-sm md:text-base"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm md:text-base">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 text-sm md:text-base"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center mb-4">
                Al iniciar sesión, aceptas nuestros{" "}
                <Link
                  href="/terms"
                  className="text-blue-500 hover:text-blue-600 hover:underline underline-offset-4"
                >
                  términos y condiciones
                </Link>
              </div>

              <Button
                variant="success"
                type="submit"
                className="w-full h-12 text-sm md:text-base"
                onClick={handleSubmit}
                disabled={isLoading}
                isLoading={isLoading}
              >
                <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión
              </Button>
            </form>

            <div className="flex flex-col space-y-4 mt-4">
              <div className="text-center text-xs md:text-sm text-muted-foreground">
                <Link
                  href="/reset-password/request"
                  className="underline-offset-4 hover:underline text-blue-500 font-bold hover:text-blue-600"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="text-center text-xs md:text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/signup"
                  className="underline-offset-4 hover:underline text-blue-500 font-bold hover:text-blue-600"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <EmailNotVerifiedModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        email={formData.email}
      />
    </main>
  );
}
