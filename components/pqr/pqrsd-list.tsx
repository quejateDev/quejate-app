"use client";

import { PQRCard } from "./PQRCard";
import { PQR } from "@/types/pqrsd";
import { UserBasic } from "@/types/user-basic";
import { useState } from "react";
import { PQRSkeleton } from "./pqr-skeleton";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface PQRListProps {
  initialPqrs: PQR[];
  currentUser: UserBasic | null;
}

export default function PQRList({ initialPqrs, currentUser }: PQRListProps) {
  const [pqrs, setPqrs] = useState<PQR[]>(initialPqrs);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePqrs = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/pqr?page=${page}&limit=10`);
      const data = await response.json();
      
      if (data.pqrs && data.pqrs.length > 0) {
        setPqrs(prev => [...prev, ...data.pqrs]);
        setPage(prev => prev + 1);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more PQRS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {pqrs.map((pqr) => (
        <PQRCard
          key={pqr.id}
          pqr={pqr}
          initialLiked={pqr.likes?.length > 0}
          user={currentUser || null}
          isUserProfile={false}
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
            onClick={loadMorePqrs}
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

      {isLoading && (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <PQRSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
}