import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User } from "lucide-react";
import { createCommentService } from "@/services/api/pqr.service";

type Comment = {
  id: string;
  text: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    image?: string;
  };
};

type CommentSectionProps = {
  pqrId: string;
  user: {
    id: string;
    name: string;
    image?: string;
  } | null;
  initialComments: Comment[];
  onCommentSubmit: (text: string) => void;
  onCommentCreated: (comment: Comment) => void;
};

export function CommentSection({ 
  pqrId, 
  user, 
  initialComments, 
  onCommentSubmit,
  onCommentCreated 
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async () => {
    if (!commentText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newComment = await createCommentService({
        text: commentText,
        userId: user.id || "",
        pqrId: pqrId,
      });
      
      const commentWithUser = {
        ...newComment,
        user: {
          id: user.id,
          name: user.name, 
          image: user.image || "",    
        },
      };
      
      setComments(prev => [commentWithUser, ...prev]);
      onCommentCreated(commentWithUser);
      onCommentSubmit(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sm:px-4">
      <div className="flex items-center gap-2 mt-3">
      <Avatar className="w-8 h-8 shrink-0">
          {user?.image ? (
            <AvatarImage 
              src={user.image} 
              alt={`${user.name}`} 
            />
          ) : null}
          <AvatarFallback className="bg-gray-200 text-gray-700">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-4 w-4 stroke-1" />
            )}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex items-center w-full border rounded-full px-3 py-1 bg-gray-50">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escribe un comentario..."
            className="flex-1 resize-none text-sm min-h-8 max-h-24 py-1 bg-transparent focus:outline-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors ml-1 shrink-0"
            aria-label="Enviar comentario"
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <Send className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3 mt-3">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-2 text-gray-500 text-sm">
            No hay comentarios. ¡Sé el primero en comentar!
          </div>
        )}
      </div>
    </div>
  );
};


function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8 sm:w-8 sm:h-8 shrink-0 mt-1">
        {comment.user?.image ? (
          <AvatarImage 
            src={comment.user.image} 
            alt={`${comment.user.name}`}
          />
        ) : null}
        <AvatarFallback className="bg-gray-200 text-gray-700">
          {comment.user?.name?.charAt(0).toUpperCase() || (
            <User className="h-4 w-4 stroke-1" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 p-2 sm:p-3 rounded-lg break-words">
          <p className="font-semibold text-xs sm:text-sm">
            {comment.user?.name}
          </p>
          <p className="text-xs sm:text-sm mt-1">{comment.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}