'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Trophy, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { FollowButton } from '../Buttons/FollowButton';
import { User as UserType } from '@/types/user';

interface DashboardSidebarProps {
  className?: string;
  currentUser: UserType | null;
}

export default function UserSidebar({ className = "", currentUser }: DashboardSidebarProps) {
  const [discoverUsers, setDiscoverUsers] = useState<UserType[]>([]);
  const [topUsers, setTopUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data: UserType[] = await response.json();

        const sortedByPQRS = [...data].sort(
          (a, b) => (b._count?.PQRS || 0) - (a._count?.PQRS || 0)
        );
        setTopUsers(sortedByPQRS.slice(0, 5));
        
        const followingIds = currentUser?.following?.map(user => user.id) || [];
        const filteredData = data.filter(user => 
          user.id !== currentUser?.id && 
          !followingIds.includes(user.id)
        );
        const shuffledUsers = [...filteredData].sort(() => Math.random() - 0.5);
        setDiscoverUsers(shuffledUsers.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUsers();
}, [currentUser?.id, currentUser?.following]);

  const handleFollowChange = (
    userId: string,
    isFollowing: boolean,
    counts?: { followers: number; following: number; PQRS: number }
  ) => {
    setDiscoverUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, isFollowing, _count: counts || user._count }
          : user
      )
    );
    
  };

  const UserAvatar = ({ user }: { user: UserType }) => (
    <Avatar className="h-12 w-12 border border-quaternary">
      {user?.profilePicture ? (
        <AvatarImage src={user.profilePicture} alt={user.firstName} />
      ) : null}
      <AvatarFallback className="bg-muted-foreground/10">
        <User className="h-6 w-6 stroke-1 text-quaternary" />
      </AvatarFallback>
    </Avatar>
  );

  const TopUserAvatar = ({ user, rank }: { user: UserType; rank: number }) => (
    <div className="relative">
      <Avatar className="h-10 w-10 border border-quaternary">
        {user?.profilePicture ? (
          <AvatarImage src={user.profilePicture} alt={user.firstName} />
        ) : null}
        <AvatarFallback className="bg-muted-foreground/10">
          <User className="h-5 w-5 stroke-1 text-quaternary" />
        </AvatarFallback>
      </Avatar>
      {rank <= 3 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
          {rank}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className={`w-80 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto ${className}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
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
    <div className={`w-80 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-quaternary" />
            Descubrir usuarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {discoverUsers.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Link href={`/dashboard/profile/${user.id}`}>
                <UserAvatar user={user} />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/dashboard/profile/${user.id}`}>
                  <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                    {user.firstName} {user.lastName}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground truncate">
                  {user._count.followers} seguidores
                </p>
              </div>
              <FollowButton
                userId={user.id}
                isFollowing={user.isFollowing || false}
                onFollowChange={(isFollowing, counts) => 
                  handleFollowChange(user.id, isFollowing, counts)
                }
              />
            </div>
          ))}
          <Separator className="my-4 bg-white" />
          <Link href="/dashboard/social">
            <Button variant="outline" className="w-full" size="sm">
              Ver más usuarios
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-quaternary" />
            Top usuarios
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Usuarios con más PQRSD realizadas
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center gap-3 mt-4">
                    <TopUserAvatar user={user} rank={index + 1} />
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/profile/${user.id}`}>
                        <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                          {user.firstName} {user.lastName}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{user._count.PQRS} PQRSD</span>
                        <span>•</span>
                        <span>{user._count.followers} seguidores</span>
                      </div>
                    </div>
                    {index <= 2 && (
                      <div className="text-xs">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                      </div>
                    )}
                  </div>
                  {index < topUsers.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}