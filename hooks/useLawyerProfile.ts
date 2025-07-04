"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import useAuthStore from "@/store/useAuthStore";
import { LawyerProfileData } from "@/types/lawyer-profile";



export interface LawyerProfileUpdateData {
  description?: string;
  feePerHour?: number;
  experienceYears?: number;
  specialties?: string[];
}

export const useLawyerProfile = () => {
  const { user } = useAuthStore();
  const [lawyerData, setLawyerData] = useState<LawyerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyerProfile = useCallback(async () => {
    if (!user?.id) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (user.role !== 'LAWYER') {
        setError("El usuario no es un abogado registrado");
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/lawyer/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError("Perfil de abogado no encontrado");
        } else {
          setError("Error al cargar el perfil");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLawyerData(data);
    } catch (err) {
      console.error("Error fetching lawyer profile:", err);
      setError("Error de conexión al cargar el perfil");
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  const updateProfile = async (updateData: LawyerProfileUpdateData): Promise<boolean> => {
    if (!lawyerData?.id) {
      toast({
        title: "Error",
        description: "No se puede actualizar el perfil",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch(`/api/lawyer/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedData = await response.json();
      setLawyerData(updatedData);
      
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      });

      return true;
    } catch (err) {
      console.error("Error updating lawyer profile:", err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchLawyerProfile();
  }, [fetchLawyerProfile]);

  return {
    lawyerData,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchLawyerProfile,
  };
};
