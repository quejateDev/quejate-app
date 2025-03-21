import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Send, User } from "lucide-react";
import { createCommentService, getCommentsService } from "@/services/api/pqr.service";
import { getUserService } from "@/services/api/User.service";

type Comment = {
  id: string;
  text: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  pqrId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

type CommentSectionProps = {
  pqrId: string;
  user: {
    id?: string;
    email: string;
    name?: string;
  } | null;
  onCommentSubmit: (text: string) => void;
};

export function CommentSection({ pqrId, user, onCommentSubmit }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{ firstName: string; lastName: string } | null>(null);


  useEffect(() => {
    if (user?.id) {
      const fetchUserData = async () => {
        try {
          const userDetails = await getUserService(user.id!);
          setUserData({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
          });
        } catch (error) {
          console.error("Error al cargar los datos del usuario:", error);
        }
      };
      fetchUserData();
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getCommentsService(pqrId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [pqrId]);

  const handleSubmit = async () => {
    if (commentText.trim() && user?.id && userData) {
      try {
        const newComment = await createCommentService({
          text: commentText,
          userId: user.id,
          pqrId: pqrId,
        });
        const commentWithUser = {
          ...newComment,
          user: {
            id: user.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
          },
        };
        setComments((prevComments) => [commentWithUser, ...prevComments]);
        onCommentSubmit(commentText);
        setCommentText("");
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <div className="sm:px-4">
      <div className="flex items-center gap-2 mt-3">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarFallback>
            {userData?.firstName ? userData.firstName.charAt(0) : <User className="h-6 w-6 stroke-1" />}
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
          />
          <button
            onClick={handleSubmit}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors ml-1 shrink-0"
            aria-label="Enviar comentario"
            disabled={isLoading || !commentText.trim()}
          >
            <Send className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-3 text-sm">
          <div className="inline-block animate-spin mr-2">⟳</div>
          Cargando comentarios...
        </div>
      ) : (
        <div className="space-y-3 mt-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="w-8 h-8 sm:w-8 sm:h-8 shrink-0 mt-1">
                  <AvatarFallback>
                  {comment.user?.firstName?.charAt(0) || <User className="h-8 w-8 stroke-1" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 p-2 sm:p-3 rounded-lg break-words">
                    <p className="font-semibold text-xs sm:text-sm">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </p>
                    <p className="text-xs sm:text-sm mt-1">{comment.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-gray-500 text-sm">
              No hay comentarios. ¡Sé el primero en comentar!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;