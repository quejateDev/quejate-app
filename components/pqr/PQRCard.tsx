"use client";
import { Card, CardContent } from "@/components/ui/card";
import { PQRCardHeader } from "./components/PQRCardHeader";
import { PQRCardContent } from "./components/PQRCardContent";
import { PQRCardAttachments } from "./components/PQRCardAttachments";
import { PQRCardActions } from "./components/PQRCardActions";
import { CommentSection } from "./components/CommentSection";
import { useLike } from "./hooks/useLike";
import { useVideoPlayback } from "./hooks/useVideoPlayback";
import { typeMap, statusMap } from "@/constants/pqrMaps";
import useAuthStore from "@/store/useAuthStore";
import { useComments } from "./hooks/useComments";

type PQRCardProps = {
  pqr: {
    id: string;
    creator: {
      firstName: string ;
      lastName: string;
      avatarUrl?: string;
    } | null;
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
      comments: number;
    };
    dueDate: string;
  };
  initialLiked?: boolean;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
};

export function PQRCard({ pqr, initialLiked = false }: PQRCardProps) {
  const { user } = useAuthStore();

  const { liked, likeCount, isLoading, handleLike } = useLike(pqr.id, initialLiked, pqr._count?.likes || 0);
  const { commentCount, isVisible: showComments, toggleComments,incrementCount: incrementCommentCount  } = useComments(pqr.id, pqr._count?.comments ?? 0); // ✅ Usa `?? 0` para manejar `undefined`
  

  const { videoRefsDesktop, videoRefsMobile } = useVideoPlayback();

  const handleCommentSubmit = async (text: string) => {
    console.log("Comentario enviado:", text);
    incrementCommentCount();
  };

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
                videoRefsDesktop={videoRefsDesktop}
                isMobile={false}
              />
            </div>
            <div className="mt-4">
              <PQRCardActions
                liked={liked}
                likeCount={likeCount}
                commentCount={commentCount}
                isLoading={isLoading}
                handleLike={handleLike}
                onCommentClick={toggleComments}
              />
            </div>
            {showComments && (
              <CommentSection
              pqrId={pqr.id}
              user={user}
              onCommentSubmit={handleCommentSubmit}
            />
          )}
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden border-b border-gray-300">
        <PQRCardHeader pqr={pqr} />
        <PQRCardContent pqr={pqr} />
        <div className="mt-4 mb-2">
          <PQRCardAttachments
            attachments={pqr.attachments}
            videoRefsMobile={videoRefsMobile}
            isMobile={true}
          />
        </div>
        <div className="mt-4 pb-3">
          <PQRCardActions
            liked={liked}
            likeCount={likeCount}
            commentCount={commentCount}
            isLoading={isLoading}
            handleLike={handleLike}
            onCommentClick={toggleComments}
          />
        </div>
        {showComments && (
          <div className="mb-6">
            <CommentSection
              pqrId={pqr.id}
              user={user}
              onCommentSubmit={handleCommentSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
}