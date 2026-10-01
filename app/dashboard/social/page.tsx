'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

interface User {
  id: string;
  name: string;
  image?: string | null;
  role: string;
  // Opcional: la búsqueda lo trae desde A-31 en el backend. Si esta página se
  // despliega antes, los resultados llegan sin él y se pintan sin contadores.
  _count?: {
    followers: number;
    following: number;
    PQRS: number;
  };
}

/**
 * Resultados que devuelve como mucho `GET /users/search` (`SEARCH_TAKE` en el
 * backend). Si llegan justo esos, puede haber más coincidencias.
 */
const SEARCH_LIMIT = 5;

export default function SocialPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);
  // `null` mientras no hay texto: entonces se enseña el directorio.
  const [results, setResults] = useState<User[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // A-31: con texto se busca en el servidor, por nombre. Antes se filtraba en
  // el navegador el directorio descargado, que son las 50 cuentas más
  // recientes, así que a las más antiguas no las encontraba.
  useEffect(() => {
    const q = debouncedSearch.trim();
    if (!q) {
      setResults(null);
      setSearchFailed(false);
      return;
    }

    // Si se sigue escribiendo, la respuesta de una búsqueda anterior se descarta.
    let current = true;
    setIsSearching(true);
    setSearchFailed(false);
    fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: User[] = await response.json();
        if (current) setResults(data);
      })
      .catch((error) => {
        console.error('Error searching users:', error);
        if (current) setSearchFailed(true);
      })
      .finally(() => {
        if (current) setIsSearching(false);
      });

    return () => {
      current = false;
    };
  }, [debouncedSearch]);

  const shownUsers = results ?? users;

  const UserCard = ({ user }: { user: User }) => (
    <Link href={`/dashboard/profile/${user.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex items-start gap-3 md:gap-4">
            <Avatar className="h-16 w-16 md:h-32 md:w-32 border border-quaternary flex-shrink-0">
              {user?.image ? (
                <AvatarImage src={user.image} alt={user.name}/>
              ) : null}
              <AvatarFallback className="bg-muted-foreground/10 text-quaternary font-normal text-2xl sm:text-5xl">
                {user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="h-6 w-6 stroke-1 text-quaternary" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold truncate">
                {user.name}
              </h3>
              {user._count && (
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-2 text-sm">
                  <span className="text-muted-foreground">
                    {user._count.followers} seguidores
                  </span>
                  <span className="text-muted-foreground">
                    {user._count.PQRS} PQRSD
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-bold pt-2 sm:pt-4">Descubre usuarios</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Encuentra y conecta con otros usuarios de la plataforma
          </p>
        </div>

        <Input
          type="search"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-muted"
        />

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {isLoading ? (
            <p className="text-muted-foreground col-span-full text-center py-8">Cargando usuarios...</p>
          ) : searchFailed ? (
            <p className="text-muted-foreground col-span-full text-center py-8">No se pudo buscar. Inténtalo de nuevo.</p>
          ) : isSearching && results === null ? (
            <p className="text-muted-foreground col-span-full text-center py-8">Buscando usuarios...</p>
          ) : shownUsers.length > 0 ? (
            shownUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">No se encontraron usuarios</p>
          )}
        </div>

        {results?.length === SEARCH_LIMIT && (
          <p className="text-sm text-muted-foreground text-center">
            Se muestran las {SEARCH_LIMIT} primeras coincidencias. Escribe más del nombre para afinar.
          </p>
        )}
      </div>
    </div>
  );
}
