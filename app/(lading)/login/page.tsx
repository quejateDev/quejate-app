'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Lock, LogIn } from "lucide-react"
import { toast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const login = useAuthStore((state) => state.login)
  const router = useRouter()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const userData = await response.json()
        // Store user data in Zustand
        login({
          id: userData.id,
          email: userData.email,
          name: userData.name,
        })
        
        // Optional: Show success message
        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Bienvenido de nuevo!',
          variant: 'default',
        })
        
        // Redirect to dashboard or home
        router.push('/dashboard')
      } else {
        // Handle error
        toast({
          title: 'Error',
          description: 'Credenciales inválidas',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast({
        title: 'Error',
        description: 'Error al iniciar sesión',
        variant: 'destructive',
      })
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Iniciar sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full"
                onClick={handleSubmit}
            >
              <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            No tienes una cuenta?{' '}
            <Link 
              href="/signup" 
              className="text-primary underline-offset-4 hover:underline"
            >
              Crear cuenta
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 