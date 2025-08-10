'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  _count?: {
    followers: number;
    following: number;
    PQRS: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = async (query: string = '') => {
    try {
      setIsLoading(true);
      const endpoint = query 
        ? `/api/users/search?q=${encodeURIComponent(query)}`
        : '/api/users';
      const response = await fetch(endpoint);
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

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

  const UserCard = ({ user }: { user: User }) => (
    <Link href={`/dashboard/profile/${user.username}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <UserCircle className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            {user._count && (
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>{user._count.followers} seguidores</span>
                <span>{user._count.PQRS} PQRs</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Explorar Usuarios</h1>
          <p className="text-muted-foreground">
            Encuentra y sigue a otros usuarios de la plataforma
          </p>
        </div>

        <Input
          type="search"
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="recent">Recientes</TabsTrigger>
            <TabsTrigger value="popular">Populares</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <p className="text-muted-foreground">Cargando usuarios...</p>
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <p className="text-muted-foreground">Usuarios que se unieron recientemente</p>
          </TabsContent>

          <TabsContent value="popular" className="space-y-4">
            <p className="text-muted-foreground">Usuarios con más seguidores</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
