'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Star, MessageSquare, ChevronLeft, ChevronRight, Eye, Mail, Phone, User, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/dateUtils';
import { LawyerRequest, ApiResponse } from '@/types/lawyer-request';
import { statusConfig } from '@/constants/status-request';
import { RatingsModal } from '@/components/modals/RatingsModal';
import { CreateRatingModal } from '@/components/modals/CreateRatingModal';

export default function LawyerRequestsPage() {
  const [requests, setRequests] = useState<LawyerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [ratingsModal, setRatingsModal] = useState<{
    isOpen: boolean;
    lawyerUserId: string;
    lawyerName: string;
  }>({
    isOpen: false,
    lawyerUserId: '',
    lawyerName: ''
  });
  const [createRatingModal, setCreateRatingModal] = useState<{
    isOpen: boolean;
    lawyerUserId: string;
    lawyerName: string;
  }>({
    isOpen: false,
    lawyerUserId: '',
    lawyerName: ''
  });
  const router = useRouter();

  const fetchRequests = async (status?: string, page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status) params.append('status', status);

      const response = await fetch(`/api/lawyer/my-requests?${params}`);
      
      if (response.ok) {
        const data: ApiResponse = await response.json();
        setRequests(data.data);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching requests');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(selectedStatus, currentPage);
  }, [selectedStatus, currentPage]);

  const getAverageRating = (ratings: Array<{ score: number }>) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
  };

  const handleStatusFilter = (status: string) => {
    const newStatus = status === 'ALL' ? '' : status;
    setSelectedStatus(newStatus);
    setCurrentPage(1);
  };

  const handleRatingsClick = (lawyerUserId: string, lawyerName: string) => {
    setRatingsModal({
      isOpen: true,
      lawyerUserId,
      lawyerName
    });
  };

  const handleCreateRatingClick = (lawyerUserId: string, lawyerName: string) => {
    setCreateRatingModal({
      isOpen: true,
      lawyerUserId,
      lawyerName
    });
  };

  const refreshRequests = async () => {
    await fetchRequests(selectedStatus, currentPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-quaternary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Mis Solicitudes de Asesoría Legal</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Filtrar por estado:</span>
              <Select value={selectedStatus || 'ALL'} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p>No tienes solicitudes de asesoría legal</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {requests.map((request) => {
                  const StatusIcon = statusConfig[request.status].icon;
                  return (
                    <div key={request.id} className="border rounded-lg p-4 space-y-3 overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="w-full">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8 border border-primary">
                              <AvatarImage src={request.lawyer.user.image} />
                              <AvatarFallback className="bg-muted-foreground/10">
                                <User className="h-5 w-5 stroke-1" />
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-lg break-words">
                              {request.lawyer.user.name}
                            </h3>
                            <Badge className={statusConfig[request.status].color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig[request.status].label}
                            </Badge>
                          </div>

                          <div className="space-y-2 my-6">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Información del Abogado
                            </h3>
                            <div className="flex items-center">
                          <div 
                            className="flex items-center space-x-1 mt-1 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleRatingsClick(request.lawyer.user.id, `${request.lawyer.user.name}`)}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {getAverageRating(request.lawyer.receivedRatings).toFixed(1)}
                            </span>
                            <span className="text-sm text-gray-500 underline">
                              ({request.lawyer.receivedRatings.length} {request.lawyer.receivedRatings.length === 1 ? 'reseña' : 'reseñas'})
                            </span>
                          </div>
                          
                          {request.status === 'COMPLETED' && (
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateRatingClick(request.lawyer.user.id, `${request.lawyer.user.name}`);
                                }}
                                className="w-8 h-8 rounded-full bg-secondary text-quaternary hover:bg-secondary-dark flex items-center justify-center ml-2"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                          
                            <div>
                              {request.status === 'ACCEPTED' || request.status === 'COMPLETED' && (
                                <div className='py-4'>
                                  <h3 className='font-semibold text-sm text-muted-foreground'>Contacto</h3>
                                  <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.lawyer.user.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.lawyer.user.phone || 'No disponible'}</span>
                                </div>
                                </div>
                              )}
                              <p className='pt-3'>{request.lawyer.description}</p>
                            </div>
                            <div className="pt-3">
                              <Separator />
                            </div>
                          </div>


                          { request.lawyer.specialties.filter(s => s.trim() !== "").length >= 1 && (
                            <div className="space-y-2 my-6">
                              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Especialidades
                              </h3>
                              <div className="flex flex-wrap gap-1 pb-3">
                                {request.lawyer.specialties.map((specialty, index) => (
                                  <Badge key={index} className="text-xs bq-primary text-white">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                              <Separator />
                            </div>
                          )}

                          <div className="space-y-2 my-6">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Tu Mensaje
                            </h3>
                            <p className="text-gray-800 mb-2 mr-2 break-all whitespace-normal overflow-hidden">
                              {request.message}
                            </p>
                          </div>

                          <Separator />
                          <div className="space-y-2 my-6">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              Tu Información de Contacto
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {request.clientContactEmail && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.clientContactEmail}</span>
                                </div>
                              )}
                              {request.clientContactPhone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{request.clientContactPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {request.pqr && (
                            <>
                              <Separator />
                              <div className="flex justify-between items-start space-y-2 pt-6">
                                <div>
                                  <h3 className="mb-2 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                    PQRSD Relacionada
                                  </h3>
                                  <p className="text-sm text-gray-700 mb-1">{request.pqr.subject}</p>
                                  <p className="text-xs text-gray-500 pt-4">
                                    Solicitud creada: {formatDate(request.createdAt)}
                                  </p>
                                  {request.updatedAt !== request.createdAt && (
                                    <p className="text-xs text-gray-500">
                                      Actualizada: {formatDate(request.updatedAt)}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/profile/pqr/${request.pqr!.id}`)}
                                  className="ml-2 bg-quaternary text-white hover:bg-quaternary-dark"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver detalle
                                </Button>
                              </div>
                            </>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} solicitudes
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <span className="text-sm font-medium">
                      Página {currentPage} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        
        <RatingsModal
          isOpen={ratingsModal.isOpen}
          onClose={() => setRatingsModal(prev => ({ ...prev, isOpen: false }))}
          lawyerUserId={ratingsModal.lawyerUserId}
          lawyerName={ratingsModal.lawyerName}
        />
        
        <CreateRatingModal
          isOpen={createRatingModal.isOpen}
          onClose={() => setCreateRatingModal(prev => ({ ...prev, isOpen: false }))}
          lawyerUserId={createRatingModal.lawyerUserId}
          lawyerName={createRatingModal.lawyerName}
          onRatingCreated={refreshRequests}
        />
    </div>
  );
}
