"use client";
import { Card, CardContent } from "@/components/ui/card";
import { PQRCardHeader } from "./PQRCardHeader";
import { PQRCardContent } from "./PQRCardContent";
import { PQRCardAttachments } from "./PQRCardAttachments";
import { PQRCardActions } from "./PQRCardActions";
import { CommentSection } from "./CommentSection";
import { useLike } from "../../hooks/useLike";
import { useVideoPlayback } from "../../hooks/useVideoPlayback";
import { useComments } from "../../hooks/useComments";
import { PQR } from "@/types/pqrsd";
import { cn } from "@/lib/utils";

export type PQRCardProps = {
  pqr: PQR;
  initialLiked?: boolean;
  user: {
    id: string;
    name: string | null;
  } | null;
  isUserProfile?: boolean;
  onUpdatePQRStatus?: (pqrId: string, newStatus: keyof typeof import("@/constants/pqrMaps").statusMap) => void;
};

export function PQRCard({ pqr, initialLiked = false, user, isUserProfile = false, onUpdatePQRStatus }: PQRCardProps) {
  const shouldShowCard = !pqr.private || isUserProfile || (user?.id && pqr.creator?.id === user.id);
  const { liked, likeCount } = useLike(
    pqr.id,
    initialLiked,
    pqr._count?.likes || 0
  );

  const isOverdue = new Date(pqr.dueDate) < new Date() && 
                   pqr.status !== "RESOLVED" && 
                   pqr.status !== "CLOSED" && isUserProfile;
  
  const cardClasses = cn(
    "border-secondary",
    {
      "border-red-600": isOverdue,
      "hover:shadow-md transition-shadow": !isOverdue
    }
  );

  const {
    commentCount,
    isVisible: showComments,
    isLoadingComments,
    toggleComments,
    localComments,
    addLocalComment
  } = useComments(pqr._count?.comments || 0);

  const { videoRefsDesktop, videoRefsMobile } = useVideoPlayback();
  
  const handleToggleComments = () => {
    toggleComments(pqr.id);
  };

  const handleCommentSubmit = async (text: string) => {
    console.log("Comentario enviado:", text);
  };

  if (!shouldShowCard) {
    return null;
  }
  return (
    <div className="md:block">
      <div className="hidden md:block">
        <Card  className={cardClasses}>
          <div className="p-6">
            <PQRCardHeader pqr={pqr} isUserProfile={isUserProfile} onUpdatePQRStatus={onUpdatePQRStatus} />
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
                onCommentClick={handleToggleComments}
                pqrId={pqr.id}
              />
            </div>
            {showComments && (
              <CommentSection
                pqrId={pqr.id}
                user={user}
                initialComments={localComments}
                isLoading={isLoadingComments}
                onCommentSubmit={handleCommentSubmit}
                onCommentCreated={addLocalComment}
              />
          )}
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden border-b-2 border-muted">
        <PQRCardHeader pqr={pqr} isUserProfile={isUserProfile} onUpdatePQRStatus={onUpdatePQRStatus} />
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
            onCommentClick={handleToggleComments}
            pqrId={pqr.id}
          />
        </div>
        {showComments && (
          <div className="mb-6">
            {showComments && (
            <CommentSection
              pqrId={pqr.id}
              user={user}
              initialComments={localComments}
              isLoading={isLoadingComments}
              onCommentSubmit={handleCommentSubmit}
              onCommentCreated={addLocalComment}
            />
          )}
          </div>
        )}
      </div>
    </div>
  );
}
