import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

type PQRCardActionsProps = {
  liked: boolean;
  likeCount: number;
  isLoading: boolean;
  handleLike: () => void;
};

export function PQRCardActions({ liked, likeCount, isLoading, handleLike }: PQRCardActionsProps) {
  return (
    <div className="flex justify-between items-center">
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
    </div>
  );
}