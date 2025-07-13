import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  HeartOff, 
  Building2, 
  MapPin, 
  Search,
  X,
  Loader2
} from 'lucide-react';
import { Entity } from '@/types/entity';
import Link from 'next/link';
import { useFavoriteEntities } from '@/hooks/useFavoriteEntities';

interface EntitiesState {
  entities: Entity[];
  loading: boolean;
  error: string | null;
}

const useEntities = () => {
  const [state, setState] = useState<EntitiesState>({
    entities: [],
    loading: false,
    error: null
  });

  const fetchEntities = async (departmentId?: string, municipalityId?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const params = new URLSearchParams();
      if (departmentId) params.append('departmentId', departmentId);
      if (municipalityId) params.append('municipalityId', municipalityId);
      
      const response = await fetch(`/api/entities?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar entidades');
      }
      
      const entities = await response.json();
      setState({ entities, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido'
      }));
    }
  };

  return {
    ...state,
    fetchEntities
  };
};

const EntityCard: React.FC<{
  entity: Entity;
  isFavorite?: boolean;
  onToggleFavorite?: (entityId: string) => Promise<void>;
}> = ({ entity, isFavorite = false, onToggleFavorite }) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;
    
    setIsToggling(true);
    try {
      await onToggleFavorite(entity.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            {entity.imageUrl ? (
              <AvatarImage src={entity.imageUrl} alt={entity.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/pqrs/create/${entity.id}`}>
                  <h4 className="font-medium text-sm truncate hover:text-primary transition-colors cursor-pointer">
                    {entity.name}
                  </h4>
                </Link>
                <Badge className="text-xs mt-1 bg-secondary text-tertiary">
                  {entity.category.name}
                </Badge>
              </div>
              {onToggleFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  disabled={isToggling}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isFavorite ? (
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              )}
            </div>
            {entity.Municipality && (
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">
                  {entity.Municipality.name}
                  {entity.Municipality.RegionalDepartment && 
                    `, ${entity.Municipality.RegionalDepartment.name}`
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const FavoritesSidebar: React.FC<{
  userId: string;
  className?: string;
}> = ({ userId, className = "" }) => {
  const { favorites, loading, error, toggleFavorite } = useFavoriteEntities<Entity>(userId);
  const { entities, loading: entitiesLoading, fetchEntities } = useEntities();
  const [showAddFavorites, setShowAddFavorites] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const availableEntities = entities.filter(entity => {
    const isFavorite = favorites.some((fav: Entity) => fav.id === entity.id);
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entity.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    return !isFavorite && matchesSearch;
  });

  const handleAddFavorites = async () => {
    if (!showAddFavorites) {
      setShowAddFavorites(true);
      if (entities.length === 0) {
        await fetchEntities();
      }
    } else {
      setShowAddFavorites(false);
      setSearchTerm('');
    }
  };

  const handleToggleFavorite = async (entityId: string) => {
    await toggleFavorite(entityId);
    if (showAddFavorites) {
      await fetchEntities();
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mis Favoritos</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mis Favoritos</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`sticky top-24 h-auto overflow-y-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Mis Favoritos</h3>
          <Button
            variant={"outline"}
            size="sm"
            onClick={handleAddFavorites}
          >
            {showAddFavorites ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Cerrar
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-1" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showAddFavorites ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {entitiesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : availableEntities.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {availableEntities.map((entity) => (
                  <EntityCard
                    key={entity.id}
                    entity={entity}
                    isFavorite={false}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? 'No se encontraron entidades' : 'No hay entidades disponibles'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.length > 0 ? (
              favorites.map((entity: Entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <HeartOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tienes favoritos aún</p>
                <p className="text-xs mt-1">
                  Haz clic en agregar para añadir entidades a tus favoritos
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesSidebar;