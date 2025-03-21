"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PQRCardHeader } from "./components/PQRCardHeader";
import { PQRCardContent } from "./components/PQRCardContent";
import { PQRCardAttachments } from "./components/PQRCardAttachments";
import { PQRCardActions } from "./components/PQRCardActions";
import { useLike } from "./hooks/useLike";
import { useVideoPlayback } from "./hooks/useVideoPlayback";
import { typeMap, statusMap } from "@/constants/pqrMaps";

type PQRCardProps = {
  pqr: {
    id: string;
    creator: {
      firstName: string;
      lastName: string;
    };
    anonymous: boolean;
    createdAt: Date;
    type: keyof typeof typeMap;
    status: keyof typeof statusMap;
    customFieldValues: {
      name: string;
      value: string;
    }[];
    department: {
      entity: {
        name: string;
      };
    };
    attachments: {
      name: string;
      url: string;
      type: string;
      size: number;
    }[];
    _count?: {
      likes: number;
    };
    dueDate: string;
  };
  initialLiked?: boolean;
};

export function PQRCard({ pqr, initialLiked = false }: PQRCardProps) {
  const { liked, likeCount, isLoading, handleLike } = useLike(pqr.id, initialLiked, pqr._count?.likes || 0);
  const { videoRefsDesktop, videoRefsMobile } = useVideoPlayback();

  return (
    <div className="md:block">
      <div className="hidden md:block">
        <Card>
          <div className="p-6">
            <PQRCardHeader pqr={pqr} />
          </div>
          <CardContent>
            <PQRCardContent pqr={pqr} />
            <div className="mt-4">
              <PQRCardAttachments
                  attachments={pqr.attachments}
                  videoRefsDesktop={videoRefsDesktop} // Referencia para escritorio
                  isMobile={false} // No es móvil
                />
            </div>
            <div className="mt-4">
              <PQRCardActions
                liked={liked}
                likeCount={likeCount}
                isLoading={isLoading}
                handleLike={handleLike}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden border-b border-gray-300">
        <PQRCardHeader pqr={pqr} />
        <PQRCardContent pqr={pqr} />
        <div className="mt-4 mb-2">
          <PQRCardAttachments
            attachments={pqr.attachments}
            videoRefsMobile={videoRefsMobile} // Referencia para móvil
            isMobile={true} // Es móvil
          />
        </div>
        <div className="mt-4 pb-3">
          <PQRCardActions
            liked={liked}
            likeCount={likeCount}
            isLoading={isLoading}
            handleLike={handleLike}
          />
        </div>
      </div>
    </div>
  );
}