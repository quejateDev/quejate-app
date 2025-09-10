'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "next-auth/react";

interface DeleteAccountSectionProps {
  userId: string;
  userEmail: string;
  disabled?: boolean;
}

export function DeleteAccountSection({ 
  userId, 
  userEmail, 
  disabled = false 
}: DeleteAccountSectionProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const expectedConfirmationText = "ELIMINAR";
  const isConfirmationValid = confirmationText === expectedConfirmationText;

  const handleDeleteAccount = async () => {
    if (!isConfirmationValid) {
      toast({
        title: "Error",
        description: `Debes escribir "${expectedConfirmationText}" para confirmar`,
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la cuenta');
      }

      toast({
        title: 'Cuenta eliminada',
        description: 'Tu cuenta ha sido eliminada exitosamente',
      });

      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Error desconocido al eliminar la cuenta',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  const resetDialog = () => {
    setConfirmationText("");
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-red-200 bg-red-50/50">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Eliminar cuenta
        </CardTitle>
        <CardDescription>
          Una vez que elimines tu cuenta, no hay vuelta atrás.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">
              ¿Qué pasará cuando elimines tu cuenta?
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Todos tus PQRSD serán eliminados permanentemente de la plataforma, pero las entidades los tendrán en sus correos.</li>
              <li>• Tu perfil y datos personales serán borrados</li>
              <li>• Perderás acceso a todas las funcionalidades</li>
              <li>• Esta acción no se puede deshacer</li>
            </ul>
          </div>

          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                disabled={disabled}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar mi cuenta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-white'>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  ¿Estás completamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente 
                    tu cuenta <strong>{userEmail}</strong> y todos tus datos de nuestros servidores.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation">
                      Escribe <strong>&quot;{expectedConfirmationText}&quot;</strong> para confirmar:
                    </Label>
                    <Input
                      id="confirmation"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder="Escribe ELIMINAR"
                      className="border-red-300 focus:border-red-500"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={resetDialog}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={!isConfirmationValid || isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sí, eliminar mi cuenta
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
