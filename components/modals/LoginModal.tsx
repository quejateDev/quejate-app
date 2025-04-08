"use client";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useLoginModal } from "@/providers/LoginModalProivder";
import LoginForm from "@/components/LoginForm";

export default function LoginModal() {
  const { isOpen, setIsOpen } = useLoginModal();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogDescription>
            <LoginForm onClose={() => setIsOpen(false)} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
