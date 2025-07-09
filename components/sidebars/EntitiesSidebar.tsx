'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Star, 
  MapPin, 
  CheckCircle,
  TrendingUp,
  Clock
} from 'lucide-react';

import { Entity } from '@/types/entity';

interface EntitiesSidebarProps {
  className?: string;
}

export default function EntitiesSidebar({ className = "" }: EntitiesSidebarProps) {
  const [featuredEntities, setFeaturedEntities] = useState<Entity[]>([]);
  const [recentEntities, setRecentEntities] = useState<Entity[]>([]);
  const [topEntities, setTopEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/entities');
        if (response.ok) {
          const data: Entity[] = await response.json();

          const verified = data.filter(entity => entity.isVerified);
          setFeaturedEntities(verified.slice(0, 3));
          
          const sortedByPQRS = [...data].sort(
            (a, b) => (b._count?.pqrs || 0) - (a._count?.pqrs || 0)
          );
          setTopEntities(sortedByPQRS.slice(0, 4));
          
          const sortedByDate = [...data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setRecentEntities(sortedByDate.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const EntityAvatar = ({ entity }: { entity: Entity }) => (
    <div className="relative">
      <Avatar className="h-10 w-10 border border-quaternary">
        {entity?.imageUrl ? (
          <AvatarImage src={entity.imageUrl} alt={entity.name} />
        ) : null}
        <AvatarFallback className="bg-muted-foreground/10">
          <Building2 className="h-5 w-5 stroke-1 text-quaternary" />
        </AvatarFallback>
      </Avatar>
      {entity.isVerified && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
          <CheckCircle className="h-2.5 w-2.5 text-white" />
        </div>
      )}
    </div>
  );

  const EntityRankAvatar = ({ entity, rank }: { entity: Entity; rank: number }) => (
    <div className="relative">
      <Avatar className="h-8 w-8 border border-quaternary">
        {entity?.imageUrl ? (
          <AvatarImage src={entity.imageUrl} alt={entity.name} />
        ) : null}
        <AvatarFallback className="bg-muted-foreground/10">
          <Building2 className="h-4 w-4 stroke-1 text-quaternary" />
        </AvatarFallback>
      </Avatar>
      {rank <= 3 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
          {rank}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className={`w-60 space-y-6 ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`w-60 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto ${className}`}>
      {featuredEntities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-quaternary" />
              Entidades Verificadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featuredEntities.map((entity) => (
              <div key={entity.id} className="flex items-start gap-3">
                <EntityAvatar entity={entity} />
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/pqrs/create/${entity.id}`}>
                    <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                      {entity.name}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {entity.category.name}
                  </p>
                  {entity.Municipality && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">
                        {entity.Municipality.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-quaternary" />
            Más Activas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topEntities.map((entity, index) => (
            <div key={entity.id} className="flex items-center gap-3">
              <EntityRankAvatar entity={entity} rank={index + 1} />
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/pqrs/create/${entity.id}`}>
                  <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                    {entity.name}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground">
                  {entity._count?.pqrs || 0} PQRS
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {recentEntities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-quaternary" />
              Nuevas Entidades
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEntities.map((entity) => (
              <div key={entity.id} className="flex items-start gap-3">
                <EntityAvatar entity={entity} />
                <div className="flex-1 min-w-0">
                  <Link href={`/dashboard/pqrs/create/${entity.id}`}>
                    <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                      {entity.name}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">
                    {entity.category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entity.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}