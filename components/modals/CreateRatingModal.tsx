"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerUserId: string;
  lawyerName: string;
  onRatingCreated?: () => void;
}

interface ExistingRating {
  id: string;
  score: number;
  comment?: string;
}

export function CreateRatingModal({ 
  isOpen, 
  onClose, 
  lawyerUserId, 
  lawyerName, 
  onRatingCreated 
}: CreateRatingModalProps) {
  const [score, setScore] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [existingRating, setExistingRating] = useState<ExistingRating | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(false);

  const checkExistingRating = useCallback(async () => {
    setCheckingExisting(true);
    try {
      const response = await fetch(`/api/lawyer/rating/my-rating?lawyerId=${lawyerUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.rating) {
          setExistingRating(data.rating);
          setScore(data.rating.score);
          setComment(data.rating.comment || "");
          setIsEditing(true);
        } else {
          setExistingRating(null);
          setIsEditing(false);
          setScore(0);
          setComment("");
        }
      }
    } catch (error) {
      console.error('Error checking existing rating:', error);
    } finally {
      setCheckingExisting(false);
    }
  }, [lawyerUserId]);

  useEffect(() => {
    if (isOpen && lawyerUserId) {
      setScore(0);
      setComment("");
      setExistingRating(null);
      setIsEditing(false);
      setCheckingExisting(false);
      checkExistingRating();
    }
  }, [isOpen, lawyerUserId, checkExistingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (score === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const url = isEditing ? '/api/lawyer/rating/update' : '/api/lawyer/rating';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? {
            ratingId: existingRating!.id,
            score,
            comment: comment.trim() || undefined
          }
        : {
            lawyerId: lawyerUserId,
            score,
            comment: comment.trim() || undefined
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: isEditing ? "Reseña actualizada" : "Reseña enviada",
          description: isEditing 
            ? "Tu reseña ha sido actualizada exitosamente"
            : "Tu reseña ha sido publicada exitosamente",
          variant: "default",
        });

        setScore(0);
        setComment("");
        setExistingRating(null);
        setIsEditing(false);
        onRatingCreated?.();
        onClose();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || `Error al ${isEditing ? 'actualizar' : 'enviar'} la reseña`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Error",
        description: `Error al ${isEditing ? 'actualizar' : 'enviar'} la reseña`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starValue: number) => {
    setScore(starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoveredStar(starValue);
  };

  const handleStarLeave = () => {
    setHoveredStar(0);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredStar || score);
      
      return (
        <Star
          key={index}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
          }`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          onMouseLeave={handleStarLeave}
        />
      );
    });
  };

  const getScoreText = (score: number) => {
    switch (score) {
      case 1: return "Muy malo";
      case 2: return "Malo";
      case 3: return "Regular";
      case 4: return "Bueno";
      case 5: return "Excelente";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle>
            {checkingExisting 
              ? "Cargando..." 
              : isEditing 
                ? `Editar reseña de ${lawyerName}` 
                : `Calificar a ${lawyerName}`
            }
          </DialogTitle>
        </DialogHeader>

        {checkingExisting ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quaternary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Calificación</Label>
              <div className="flex items-center gap-1">
                {renderStars()}
              </div>
              {score > 0 && (
                <p className="text-sm text-muted-foreground">
                  {getScoreText(score)}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="comment" className="text-sm font-medium">
                Comentario (opcional)
              </Label>
              <Textarea
                id="comment"
                placeholder="Comparte tu experiencia con este abogado..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none border border-muted"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/500
              </p>
            </div>

            {isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Estás editando tu reseña existente. Los cambios reemplazarán tu calificación anterior.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-quaternary text-white hover:bg-quaternary-dark"
                disabled={loading || score === 0}
              >
                {loading 
                  ? (isEditing ? "Actualizando..." : "Enviando...") 
                  : (isEditing ? "Actualizar Reseña" : "Enviar Reseña")
                }
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
