import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  email
}: VerificationModalProps) {
  const router = useRouter()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">Verifica tu correo electrónico</DialogTitle>
          <DialogDescription className="text-center">
            Hemos enviado un correo de verificación a{" "}
            <span className="font-medium text-foreground">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-center text-sm text-muted-foreground">
          <p>
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones para verificar tu cuenta.
          </p>
          <p>
            Si no encuentras el correo, revisa tu carpeta de spam.
          </p>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="success"
            onClick={() => {
              onClose();
              router.push("/login");
            }}
          >
            Ir a iniciar sesión
          </Button>
          <Button variant="destructive" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
