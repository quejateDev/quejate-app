'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Users2 } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
  role: string;
  _count: {
    followers: number;
    following: number;
    PQRS: number;
  };
}

export default function SocialPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [popularUsers, setPopularUsers] = useState<User[]>([]);
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
          // Sort users by follower count for popular users
          const sortedByFollowers = [...data].sort(
            (a, b) => (b._count?.followers || 0) - (a._count?.followers || 0)
          );
          setPopularUsers(sortedByFollowers.slice(0, 5));
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

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    );
  });

  const UserCard = ({ user }: { user: User }) => (
    <Link href={`/dashboard/profile/${user.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-32 w-32 border border-quaternary">
              {user?.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.firstName}/>
              ) : null}
              <AvatarFallback className="bg-muted-foreground/10">
                {<User className="h-16 w-16 stroke-1 text-quaternary" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1">
              <h3 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">@{user.email}</p>
              <div className="flex gap-4 mt-2 text-sm">
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col flex-reserve md:grid gap-6 md:grid-cols-12">
        {/* Main Content */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold pt-4">Descubre usuarios</h1>
            <p className="text-muted-foreground">
              Encuentra y conecta con otros usuarios de la plataforma
            </p>
          </div>

          <Input
            type="search"
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-muted-foreground">Cargando usuarios...</p>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users2 className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Usuarios Populares</h2>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {popularUsers.map((user, index) => (
                    <div key={user.id}>
                      <Link
                        href={`/dashboard/profile/${user.id}`}
                        className="flex items-center gap-3 hover:bg-accent rounded-lg p-2 transition-colors"
                      >
                        <Avatar className="h-16 w-16 border border-quaternary">
                          {user?.profilePicture ? (
                            <AvatarImage src={user.profilePicture} alt={user.firstName}/>
                          ) : null}
                          <AvatarFallback className="bg-muted-foreground/10">
                            {<User className="h-8 w-8 stroke-1 text-quaternary" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {user._count.followers} seguidores
                          </span>
                        </div>
                      </Link>
                      {index < popularUsers.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
