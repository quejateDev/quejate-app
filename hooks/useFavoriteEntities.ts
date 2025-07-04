import { useState, useEffect, useCallback } from 'react';

interface BaseFavoriteEntity {
  id: string;
  name: string;
}

interface FavoritesState<T extends BaseFavoriteEntity> {
  favorites: T[];
  loading: boolean;
  error: string | null;
}

export const useFavoriteEntities = <T extends BaseFavoriteEntity>(userId: string) => {
  const [state, setState] = useState<FavoritesState<T>>({
    favorites: [],
    loading: true,
    error: null
  });

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`/api/users/${userId}/favorite-entities`);
      
      if (!response.ok) {
        throw new Error('Error al cargar favoritos');
      }
      
      const favorites = await response.json();
      setState({ favorites, loading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  }, [userId]);

  const toggleFavorite = useCallback(async (entityId: string) => {
    if (!userId) {
      console.error('No userId, no se puede actualizar favorito');
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}/favorite-entities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error al actualizar favorito:', errorText);
        throw new Error('Error al actualizar favorito');
      }

      const result = await response.json();
      await fetchFavorites();
      return result;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }, [userId, fetchFavorites]);

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId, fetchFavorites]);

  return {
    ...state,
    toggleFavorite,
    refetch: fetchFavorites
  };
};
