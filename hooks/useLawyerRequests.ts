import { ApiResponse, LawyerRequest } from '@/types/lawyer-request';
import { useState } from 'react';

export function useLawyerRequests() {
  const [requests, setRequests] = useState<LawyerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyRequests = async (status?: string, page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) params.append('status', status);

      const response = await fetch(`/api/lawyer/my-requests?${params}`);
      
      if (!response.ok) {
        throw new Error('Error al obtener las solicitudes');
      }

      const data: ApiResponse = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (lawyerId: string, message: string, pqrId?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/lawyer/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lawyerId,
          message,
          pqrId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la solicitud');
      }

      const newRequest = await response.json();
      return newRequest;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    error,
    fetchMyRequests,
    createRequest,
    setRequests
  };
}
