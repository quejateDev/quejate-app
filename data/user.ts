import prisma from "@/lib/prisma";
import { UserWithFollowingStatus } from "@/types/user-with-following";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        return null;
    }   
}

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        return null;
    }   
}

export async function getUsersForSidebar(
  currentUserId?: string
): Promise<{
  topUsers: UserWithFollowingStatus[];
  discoverUsers: UserWithFollowingStatus[];
}> {
  const allUsers = await prisma.user.findMany({
    include: {
      _count: { select: { PQRS: true, followers: true, following: true } },
      followers: { select: { id: true, firstName: true, lastName: true } },
      following: { select: { id: true, firstName: true, lastName: true } }
    }
  });

  let followingIds: string[] = [];
  if (currentUserId) {
    const currentUser = allUsers.find(u => u.id === currentUserId);
    followingIds = currentUser?.following?.map(f => f.id) || [];
  }

  const allUsersWithFollowing: UserWithFollowingStatus[] = allUsers.map(u => ({
    ...u,
    isFollowing: followingIds.includes(u.id)
  }));

  const sortedByPQRS = [...allUsersWithFollowing].sort(
    (a, b) => (b._count?.PQRS || 0) - (a._count?.PQRS || 0)
  );
  const topUsers = sortedByPQRS.slice(0, 5);

  let discoverUsers = currentUserId
    ? allUsersWithFollowing.filter(
        u => u.id !== currentUserId && !followingIds.includes(u.id)
      )
    : allUsersWithFollowing;

  discoverUsers = discoverUsers
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return { topUsers, discoverUsers };
}

export async function getFullUserWithFollowingStatus(
  userId: string
): Promise<UserWithFollowingStatus | null> {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { PQRS: true, followers: true, following: true } },
      followers: { select: { id: true, firstName: true, lastName: true } },
      following: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!user) return null;
  const followingIds = user.following.map(f => f.id);

  return {
    ...user,
    isFollowing: false,
  };
}
