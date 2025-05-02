"use client";

import { AlertTriangle, CheckCircle2, FileSearch, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { typeMap, statusMap } from "@/constants/pqrMaps";
import { PQRFollowUpModal } from "./follow-up/PQRFollowUpModal";
import { useState } from "react";
import { getPQRDescription } from "@/lib/helpers/pqrHelpers";
import { PQR } from "@/types/pqrsd";

type PQRBasicInfo = PQR;

type PQRAlertModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daysExceeded: number;
  onResolved: () => void;
  onFollowUp: () => void;
  pqrType: keyof typeof typeMap;
  pqr: PQRBasicInfo;
};

export function PQRAlertModal({
  open,
  onOpenChange,
  daysExceeded,
  onResolved,
  onFollowUp,
  pqrType,
  pqr
}: PQRAlertModalProps) {
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const description = getPQRDescription(pqr.customFieldValues);

  const handleFollowUpClick = () => {
    onFollowUp();
    setFollowUpOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center mb-3 gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Tiempo de respuesta excedido
            </DialogTitle>
            <div className="space-y-4 py-2">
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                  <Clock className="h-4 w-4" />
                  Tu PQRSD ha excedido el tiempo de respuesta por {daysExceeded} día(s) hábil(es)
                </div>
              </div>
              <DialogDescription>
                ¿Has recibido una respuesta a tu solicitud o deseas realizar un seguimiento?
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-2">
            <button 
              onClick={onResolved}
              className="focus-visible:outline-none flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left"
            >
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-700">Ya recibí respuesta</h4>
                <p className="text-sm text-green-600">Marcar como resuelta y finalizar la solicitud</p>
              </div>
            </button>
            
            <button 
              onClick={handleFollowUpClick}
              className="flex items-center  gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
            >
              <div className="flex-shrink-0">
                <FileSearch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-700">No he recibido respuesta</h4>
                <p className="text-sm text-blue-600">Iniciar proceso de seguimiento formal</p>
              </div>
            </button>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Revisar más tarde
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PQRFollowUpModal
        open={followUpOpen}
        onOpenChange={setFollowUpOpen}
        pqrType={pqrType}
        pqrData= {pqr}
      />
    </>
  );
}