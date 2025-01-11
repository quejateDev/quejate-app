'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle } from 'lucide-react'

export default function VerifyEmail() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')
        if (!token) {
          setStatus('error')
          setMessage('Token no proporcionado')
          return
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error)
        }

        setStatus('success')
        setMessage('Email verificado correctamente')
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Error al verificar el email')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">
            Verificación de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-center text-green-600">{message}</p>
              <Button onClick={() => router.push('/login')}>
                Ir a iniciar sesión
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center text-red-600">{message}</p>
              <Button onClick={() => router.push('/signup')}>
                Volver al registro
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
