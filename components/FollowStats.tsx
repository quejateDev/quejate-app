'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface FollowStatsProps {
  followers: User[];
  following: User[];
}

export function FollowStats({ followers, following }: FollowStatsProps) {
  return (
    <div className="flex gap-6 items-center justify-center mt-4">
      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="text-sm">
            <span className="font-semibold">{followers.length}</span> seguidores
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            {followers.map((follower) => (
              <div key={follower.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <UserCircle className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Link 
                  href={`/dashboard/profile/${follower.username}`}
                  className="text-sm hover:underline"
                >
                  {follower.firstName} {follower.lastName}
                </Link>
              </div>
            ))}
            {followers.length === 0 && (
              <p className="text-sm text-muted-foreground">No hay seguidores aún</p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger asChild>
          <button className="text-sm">
            <span className="font-semibold">{following.length}</span> siguiendo
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            {following.map((user) => (
              <div key={user.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <UserCircle className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Link 
                  href={`/dashboard/profile/${user.username}`}
                  className="text-sm hover:underline"
                >
                  {user.firstName} {user.lastName}
                </Link>
              </div>
            ))}
            {following.length === 0 && (
              <p className="text-sm text-muted-foreground">No sigues a nadie aún</p>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
