"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/dateUtils";
import { Rating } from "@/types/lawyer-rating";


interface RatingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerUserId: string;
  lawyerName: string;
}

export function RatingsModal({ isOpen, onClose, lawyerUserId, lawyerName }: RatingsModalProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageScore, setAverageScore] = useState<number>(0);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const fetchRatings = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lawyerId: lawyerUserId,
        page: page.toString(),
        limit: '10'
      });

      const response = await fetch(`/api/lawyer/rating?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setRatings(data.data);
        setAverageScore(data.averageScore || 0);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching ratings');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [lawyerUserId]);

  useEffect(() => {
    if (isOpen && lawyerUserId) {
      fetchRatings(1);
      setPagination(prev => ({ ...prev, page: 1 }));
    } else if (!isOpen) {
      setRatings([]);
      setLoading(true);
      setAverageScore(0);
      setPagination({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      });
    }
  }, [isOpen, lawyerUserId, fetchRatings]);

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchRatings(newPage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Reseñas de {lawyerName}</span>
            {averageScore > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{averageScore.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({pagination.total} {pagination.total === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quaternary"></div>
          </div>
        ) : ratings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Este abogado aún no tiene reseñas</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ratings.map((rating) => (
                <div key={rating.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={rating.client.image} />
                      <AvatarFallback className="bg-muted-foreground/10">
                        <User className="h-5 w-5 stroke-1" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {rating.client.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(rating.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(rating.score)}
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-gray-700 mt-2">{rating.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
