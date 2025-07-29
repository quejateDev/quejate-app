import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { formatText } from '@/utils/formatText';

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

const EntityItem: React.FC<{
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
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
      <Avatar className="h-10 w-10 border border-quaternary">
        {entity.imageUrl ? (
          <AvatarImage src={entity.imageUrl} alt={entity.name} />
        ) : null}
        <AvatarFallback className="bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <Link href={`/dashboard/pqrs/create/${entity.id}`}>
          <h4 className="font-medium text-sm hover:text-primary transition-colors cursor-pointer leading-tight">
            {entity.name}
          </h4>
        </Link>
        
        <div className="mt-1 space-y-1">
          {entity.RegionalDepartment && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span>
                {formatText(entity.RegionalDepartment.name)}
                {entity.Municipality && 
                  `, ${formatText(entity.Municipality.name)}`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className="h-6 w-6 p-0 hover:bg-red-50 transition-colors shrink-0"
        >
          {isToggling ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isFavorite ? (
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-3 w-3 text-gray-400" />
          )}
        </Button>
      )}
    </div>
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
      <Card className={`${className} min-h-0`}>
        <CardHeader className="pb-3">
          <h3 className="text-base font-semibold">Mis Favoritos</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} min-h-0`}>
        <CardHeader className="pb-3">
          <h3 className="text-base font-semibold">Mis Favoritos</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-6 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} min-h-0 flex flex-col`}>
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between mr-3">
          <h3 className="text-base font-semibold">Mis Favoritos</h3>
          <Button
            variant={"outline"}
            size="sm"
            onClick={handleAddFavorites}
            className="h-8 px-3"
          >
            {showAddFavorites ? (
              <>
                <X className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Cerrar</span>
              </>
            ) : (
              <>
                <Heart className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 min-h-0">
        {showAddFavorites ? (
          <div className="space-y-3 h-full flex flex-col">
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar entidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            
            {entitiesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : availableEntities.length > 0 ? (
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-1 pr-3">
                  {availableEntities.map((entity) => (
                    <EntityItem
                      key={entity.id}
                      entity={entity}
                      isFavorite={false}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? 'No se encontraron entidades' : 'No hay entidades disponibles'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="h-full min-h-0">
            <div className="space-y-1 pr-3">
              {favorites.length > 0 ? (
                favorites.map((entity: Entity) => (
                  <EntityItem
                    key={entity.id}
                    entity={entity}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <HeartOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tienes favoritos aún</p>
                  <p className="text-xs mt-1 px-2">
                    Haz clic en agregar para añadir entidades a tus favoritos
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesSidebar;