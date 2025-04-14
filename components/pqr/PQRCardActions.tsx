import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LikeButton from "@/components/Buttons/LikeButton";

type PQRCardActionsProps = {
  liked: boolean;
  likeCount: number;
  isLoading: boolean;
  commentCount: number; 
  handleLike: () => void;
  onCommentClick: () => void;
  pqrId: string;
};

export function PQRCardActions({
  liked,
  likeCount,
  isLoading,
  commentCount,
  handleLike,
  onCommentClick,
  pqrId,
}: PQRCardActionsProps) {
  return (
    <div className="flex items-center">
      <LikeButton
        likes={likeCount}
        initialLiked={liked}
        pqrId={pqrId}
      />
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 pl-0 hover:bg-transparent hover:text-current"
        onClick={onCommentClick}
      >
        <MessageCircle className="w-4 h-4 text-gray-500" />
        <span>{commentCount}</span>
      </Button>
    </div>
  );
}