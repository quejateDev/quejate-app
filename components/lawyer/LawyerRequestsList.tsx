"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Eye, Check, X, Clock, CheckCircle, Mail, Phone } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserBasic } from '@/types/user-basic';
import { PaginationData } from '@/types/pagination';
import { LawyerRequestStatus } from '@prisma/client';
import { formatDate } from '@/lib/dateUtils';


interface PQR {
  id: string;
  subject: string;
  description: string;
}

interface LawyerRequest {
  id: string;
  message: string;
  status: LawyerRequestStatus;
  createdAt: string;
  user: UserBasic;
  pqr?: PQR;
}

interface LawyerRequestsResponse {
  data: LawyerRequest[];
  pagination: PaginationData;
}

const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ACCEPTED: { label: 'Aceptado', color: 'bg-blue-100 text-blue-800', icon: Check },
  REJECTED: { label: 'Rechazado', color: 'bg-red-100 text-red-800', icon: X },
  COMPLETED: { label: 'Completado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
};

export function LawyerRequestsList() {
  const [requests, setRequests] = useState<LawyerRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [statusFilter, setStatusFilter] = useState<LawyerRequestStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  const fetchRequests = async (page = 1, status?: LawyerRequestStatus | 'ALL') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (status && status !== 'ALL') {
        params.append('status', status);
      }

      const response = await fetch(`/api/lawyer/request?${params}`);
      if (!response.ok) {
        throw new Error('Error al cargar las solicitudes');
      }

      const data: LawyerRequestsResponse = await response.json();
      setRequests(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: LawyerRequestStatus) => {
    try {
      setActionLoading(requestId);
      
      const response = await fetch('/api/lawyer/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      await fetchRequests(pagination.page, statusFilter === 'ALL' ? undefined : statusFilter);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (value: string) => {
    const newStatus = value as LawyerRequestStatus | 'ALL';
    setStatusFilter(newStatus);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchRequests(1, newStatus === 'ALL' ? undefined : newStatus);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchRequests(newPage, statusFilter === 'ALL' ? undefined : statusFilter);
  };

  const handleViewPQR = (pqrId: string) => {
    router.push(`/dashboard/profile/pqr/${pqrId}`);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className='text-2xl font-bold'>Solicitudes de Clientes</CardTitle>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Filtrar por estado:</span>
            <Select value={statusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="ACCEPTED">Aceptado</SelectItem>
                <SelectItem value="REJECTED">Rechazado</SelectItem>
                <SelectItem value="COMPLETED">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay solicitudes para mostrar
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {requests.map((request) => {
                const StatusIcon = statusConfig[request.status].icon;
                return (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3 overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={request.user.profilePicture || undefined} 
                              alt={`${request.user.firstName} ${request.user.lastName}`}
                            />
                            <AvatarFallback className="text-lg">
                              {request.user.firstName?.[0]}{request.user.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg break-words">
                            {request.user.firstName} {request.user.lastName}
                          </h3>
                          <Badge className={statusConfig[request.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[request.status].label}
                          </Badge>
                        </div>
                 

                        <div className="space-y-2 my-6">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Información de Contacto
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{request.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{request.user.phone || 'No disponible'}</span>
                            </div>
                            
                        </div>

                        <Separator />

                        <div className="space-y-2 my-6">
                          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                            Mensaje del Cliente
                          </h3>
                          <p className="text-gray-800 mb-2 mr-2 break-all whitespace-normal overflow-hidden">
                              {request.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            Solicitud creada: {formatDate(request.createdAt)}
                          </p>
                        </div>

                        <Separator />

                        {request.pqr && (
                            <div className="flex justify-between items-start space-y-2">
                              <div>
                                <h3 className="mt-6 mb-2 font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  PQRSD Relacionada
                                </h3>
                                <p className="text-sm text-gray-700 mb-1">{request.pqr.subject}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {request.pqr.description}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleViewPQR(request.pqr!.id)}
                                className="ml-2 bg-quaternary text-white hover:bg-quaternary-dark"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver detalle
                              </Button>
                            </div>
                        )}

                      </div>
                    </div>

                    {request.status === 'PENDING' && (
                      <div className="flex space-x-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'ACCEPTED')}
                          disabled={actionLoading === request.id}
                          className='bg-green-600 hover:bg-green-700 text-white'
                        >
                          {actionLoading === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Aceptar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'REJECTED')}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <X className="w-4 h-4 mr-2" />
                          )}
                          Rechazar
                        </Button>
                      </div>
                    )}

                    {request.status === 'ACCEPTED' && (
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(request.id, 'COMPLETED')}
                          disabled={actionLoading === request.id}
                        >
                          {actionLoading === request.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Marcar como Completado
                        </Button>
                      </div>
                    )}
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
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  <span className="text-sm font-medium">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
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
    </Card>
  );
}