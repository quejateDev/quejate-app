// Ejemplo: app/auth/signin/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("resend", {
        email,
        redirect: false, 
      });

      if (result?.error) {
        setMessage("Error: " + result.error);
      } else {
        setMessage("¡Revisa tu correo para el enlace mágico!");
      }
    } catch (error) {
      setMessage("Error al enviar el enlace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Iniciar sesión / Registrarse</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace mágico"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <button onClick={() => signIn("google")}>Iniciar con Google</button>
    </div>
  );
}