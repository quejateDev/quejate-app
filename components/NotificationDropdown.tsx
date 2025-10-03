"use client";

import { Bell, Scale, Clock } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import useNotificationStore from "@/store/useNotificationStore";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  isCommentNotification,
  isFollowNotification,
  isLawyerRequestAcceptedNotification,
  isLawyerRequestRejectedNotification,
  isLikeNotification,
  isNewLawyerRequestNotification,
  isPQRSDTimeExpiredNotification,
  Notification,
} from "@/types/notification";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

export function NotificationDropdown() {
  const { notifications, unreadCount, setNotifications, markAsRead } =
    useNotificationStore();
  const session = useCurrentUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session, setNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId: id }),
      });
      if (!response.ok) throw new Error("Failed to mark notification as read");
      markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (isFollowNotification(notification.data)) {
      return `/dashboard/profile/${notification.data.followerId}`;
    }

    if (isLikeNotification(notification.data)) {
      return `/dashboard/profile/pqr/${notification.data.pqrId}`;
    }

    if (isCommentNotification(notification.data)) {
      return `/dashboard/profile/pqr/${notification.data.pqrId}`;
    }

    if (
      isLawyerRequestAcceptedNotification(notification.data) ||
      isLawyerRequestRejectedNotification(notification.data)
    ) {
      return "/dashboard/lawyer/lawyer-requests";
    }

    if (isNewLawyerRequestNotification(notification.data)) {
      return "/dashboard/lawyer";
    }

    if (isPQRSDTimeExpiredNotification(notification.data)) {
      return `/dashboard/profile/pqr/${notification.data.pqrId}`;
    }

    return "#";
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
      <DropdownMenuContent align="end" className="w-80 p-0">
        <ScrollArea className="h-[480px]">
          <div className="p-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No tienes notificaciones
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  className={`flex items-start gap-3 p-4 ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <Link href={getNotificationLink(notification)}>
                    {(isFollowNotification(notification.data) ||
                      isLikeNotification(notification.data) ||
                      isCommentNotification(notification.data)) && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            isFollowNotification(notification.data)
                              ? notification.data.followerImage
                              : isLikeNotification(notification.data)
                              ? notification.data.userImage
                              : isCommentNotification(notification.data)
                              ? notification.data.userImage
                              : undefined
                          }
                        />
                        <AvatarFallback>
                          {isFollowNotification(notification.data)
                            ? notification.data.followerName?.[0]
                            : isLikeNotification(notification.data)
                            ? notification.data.userName?.[0]
                            : isCommentNotification(notification.data)
                            ? notification.data.userName?.[0]
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {(notification.type === "lawyer_request_accepted" ||
                      notification.type === "lawyer_request_rejected" ||
                      notification.type === "new_lawyer_request") && (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Scale className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    {notification.type === "pqrsd_time_expired" && (
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
