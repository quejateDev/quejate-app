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
  email: string;
  name: string;
  image?: string | null;
  role: string;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}

export default function SocialPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

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

  const filteredUsers = users.filter(user => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.name.toLowerCase().includes(searchLower)
    );
  });

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
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-2 text-sm">
                <span className="text-muted-foreground">
                  {user._count.followers} seguidores
                </span>
                <span className="text-muted-foreground">
                  {user._count.PQRS} PQRSD
                </span>
              </div>
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
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">No se encontraron usuarios</p>
          )}
        </div>
      </div>
    </div>
  );
}
