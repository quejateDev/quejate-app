"use client";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, UserPlus, Trophy } from "lucide-react";
import { FollowButton } from '../Buttons/FollowButton';
import { User as UserType } from '@/types/user';
import { UserWithFollowingStatus } from "@/types/user-with-following";

interface DashboardSidebarProps {
  className?: string;
  currentUser: UserWithFollowingStatus | null;
  initialTopUsers: UserWithFollowingStatus[];
  initialDiscoverUsers: UserWithFollowingStatus[];
}


export default function UserSidebar({
  className = "",
  currentUser,
  initialTopUsers,
  initialDiscoverUsers
}: DashboardSidebarProps) {
  const [discoverUsers, setDiscoverUsers] = useState(initialDiscoverUsers);
  const [topUsers, setTopUsers] = useState(initialTopUsers);

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
    <Avatar className="h-10 w-10 border border-quaternary">
      {user?.image && (
        <AvatarImage src={user.image} alt={user.name || ""} />
      )}
      <AvatarFallback className="bg-muted-foreground/10">
        <User className="h-6 w-6 stroke-1 text-quaternary" />
      </AvatarFallback>
    </Avatar>
  );

  const TopUserAvatar = ({ user, rank }: { user: UserType; rank: number }) => (
    <div className="relative">
      <Avatar className="h-10 w-10 border border-quaternary">
        {user?.image && (
          <AvatarImage src={user.image} alt={user.name || ""} />
        )}
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

  return (
    <div
      className={`w-80 space-y-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto ${className}`}
    >
      {discoverUsers.length > 0 && (
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
                    {user.name}
                  </p>
                </Link>
                <p className="text-xs text-muted-foreground truncate">
                  {user._count.followers} seguidores
                </p>
              </div>
              <FollowButton
                userId={user.id}
                isFollowing={user.isFollowing ?? false}
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
    )}
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
          <ScrollArea className="max-h-[300px] h-auto">
            <div className="space-y-4 pr-2">
              {topUsers.map((user, index) => (
                <div key={user.id}>
                  <div className="flex items-center gap-3 mt-4">
                    <TopUserAvatar user={user} rank={index + 1} />
                    <div className="flex-1 min-w-0">
                      <Link href={`/dashboard/profile/${user.id}`}>
                        <p className="font-medium text-sm hover:text-quaternary transition-colors cursor-pointer truncate">
                          {user.name}
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