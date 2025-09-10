"use client";


import { PQR } from "@/types/pqrsd";
import { UserBasic } from "@/types/user-basic";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { PQRCard } from "../pqr/PQRCard";

interface PQRListProfileProps {
  pqrs: PQR[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  currentUser: UserBasic | null;
  onUpdatePQRStatus: (pqrId: string, newStatus: keyof typeof import("@/constants/pqrMaps").statusMap) => void;
}

export default function PQRListProfile({ 
  pqrs, 
  isLoading, 
  hasMore, 
  onLoadMore, 
  currentUser,
  onUpdatePQRStatus
}: PQRListProfileProps) {

  return (
    <div className="space-y-6">
      {pqrs.map((pqr) => (
        <PQRCard
          key={pqr.id}
          pqr={pqr}
          initialLiked={pqr.likes?.length > 0}
          user={currentUser || null}
          isUserProfile={true}
          onUpdatePQRStatus={onUpdatePQRStatus}
        />
      ))}
      
      {pqrs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hay PQRSD para mostrar</p>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              'Mostrar más'
            )}
          </Button>
        </div>
      )}

      {!hasMore && pqrs.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay más PQRSD para mostrar</p>
        </div>
      )}

    </div>
  );
}