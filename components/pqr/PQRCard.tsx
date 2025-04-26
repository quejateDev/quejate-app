"use client";
import { Card, CardContent } from "@/components/ui/card";
import { PQRCardHeader } from "./PQRCardHeader";
import { PQRCardContent } from "./PQRCardContent";
import { PQRCardAttachments } from "./PQRCardAttachments";
import { PQRCardActions } from "./PQRCardActions";
import { CommentSection } from "./CommentSection";
import { useLike } from "../../hooks/useLike";
import { useVideoPlayback } from "../../hooks/useVideoPlayback";
import { typeMap, statusMap } from "@/constants/pqrMaps";
import { useComments } from "../../hooks/useComments";

export type PQRCardProps = {
  pqr: {
    id: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: string | null;
    } | null;
    anonymous: boolean;
    private: boolean;
    createdAt: Date;
    type: keyof typeof typeMap;
    status: keyof typeof statusMap;
    subject?: string | null;
    description?: string | null;
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
    comments: {
      id: string;
      text: string;
      createdAt: Date;
      user: {
        firstName: string;
        lastName: string;
      };
    }[];
    _count?: {
      likes: number;
      comments: number;
    };
    dueDate: Date;
  };
  initialLiked?: boolean;
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
  } | null;
  isUserProfile?: boolean;
};

export function PQRCard({ pqr, initialLiked = false, user, isUserProfile = false }: PQRCardProps) {
  const shouldShowCard = !pqr.private || isUserProfile || (user?.id && pqr.creator?.id === user.id);
  const { liked, likeCount } = useLike(
    pqr.id,
    initialLiked,
    pqr._count?.likes || 0
  );
  
  const {
    commentCount,
    isVisible: showComments,
    toggleComments,
    localComments,
    addLocalComment
  } = useComments(pqr.comments);

  const { videoRefsDesktop, videoRefsMobile } = useVideoPlayback();

  const handleCommentSubmit = async (text: string) => {
    console.log("Comentario enviado:", text);
  };

  if (!shouldShowCard) {
    return null;
  }
  return (
    <div className="md:block">
      <div className="hidden md:block">
        <Card>
          <div className="p-6">
            <PQRCardHeader pqr={pqr} isUserProfile={isUserProfile} />
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
                onCommentClick={toggleComments}
                pqrId={pqr.id}
              />
            </div>
            {showComments && (
              <CommentSection
                pqrId={pqr.id}
                user={user}
                initialComments={localComments}
                onCommentSubmit={handleCommentSubmit}
                onCommentCreated={addLocalComment}
              />
          )}
          </CardContent>
        </Card>
      </div>
      <div className="md:hidden border-b border-gray-300">
        <PQRCardHeader pqr={pqr} isUserProfile={true} />
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
            onCommentClick={toggleComments}
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
