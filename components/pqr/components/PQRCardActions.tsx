import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type PQRCardActionsProps = {
  liked: boolean;
  likeCount: number;
  isLoading: boolean;
  commentCount: number; 
  handleLike: () => void;
  onCommentClick: () => void;
};

export function PQRCardActions({
  liked,
  likeCount,
  isLoading,
  commentCount,
  handleLike,
  onCommentClick,
}: PQRCardActionsProps) {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 pl-0 hover:bg-transparent hover:text-current"
        onClick={handleLike}
        disabled={isLoading}
      >
        <Heart
          className={cn(
            "w-4 h-4",
            liked ? "fill-current text-red-500" : "text-gray-500 stroke-red-500"
          )}
        />
        <span>{likeCount}</span>
      </Button>
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