'use client';

import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useNotificationStore from "@/store/useNotificationStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import useAuthStore from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

export function NotificationDropdown() {
  const { notifications, unreadCount, setNotifications, markAsRead } = useNotificationStore();
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        const parsedData = data.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(parsedData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token, setNotifications]);

    const handleMarkAsReadAndNavigate = async (id: string, url: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      markAsRead(id);
      if (url !== "#") {
        setTimeout(() => {
          router.push(url);
        }, 100);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-ring" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No tienes notificaciones
          </div>
        ) : (
          notifications.map((notification) => {
            let url = notification.url || "#";
            if (
              notification.type === "follow" &&
              notification.data?.followerId
            ) {
              url = `/dashboard/profile/${notification.data.followerId}`;
            }
            let pqrsdId = notification.data?.pqrId || notification.data?.pqrId;
            if (
              (notification.type === "comment" || notification.type === "like") &&
              pqrsdId
            ) {
              url = `/dashboard/profile/pqr/${pqrsdId}`;
            }

            let avatarImage = "";
            let avatarFallback = "";
            if (notification.type === "follow") {
              avatarImage = notification.data?.followerImage || "";
              avatarFallback = notification.data?.followerName?.[0] || "";
            } else if (
              (notification.type === "comment" || notification.type === "like")
            ) {
              avatarImage = notification.data?.userImage || "";
              avatarFallback = notification.data?.userName?.[0] || "";
            }

            return (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                } cursor-pointer`}
                onClick={() => handleMarkAsReadAndNavigate(notification.id, url)}
              >
                {avatarImage && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarImage} />
                    <AvatarFallback>
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-none">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}