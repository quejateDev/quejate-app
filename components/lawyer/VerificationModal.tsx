"use client";
import { Button } from "@/components/ui/button";
import { VerificationStatus } from "@/hooks/useLawyerRegistration";

interface VerificationModalProps {
  isOpen: boolean;
  verificationStatus: VerificationStatus | null;
  onClose: () => void;
}

export function VerificationModal({
  isOpen,
  verificationStatus,
  onClose,
}: VerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Verificación Requerida</h3>
        <p className="mb-4">{verificationStatus?.message}</p>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="destructive">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  );
}
