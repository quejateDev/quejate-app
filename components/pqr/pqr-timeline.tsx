"use client";

import { formatDate } from "@/lib/utils";
import { MessageSquare, User } from "lucide-react";

interface PQRTimelineProps {
  pqr: any; // Tipado completo según necesidades
}

export function PQRTimeline({ pqr }: PQRTimelineProps) {
  // Combinar comentarios y cambios de estado en una línea de tiempo
  const timeline = [
    ...pqr.comments.map((comment: any) => ({
      type: "comment",
      date: comment.createdAt,
      user: comment.user,
      content: comment.content,
    })),
    // Aquí puedes agregar otros eventos como cambios de estado
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {timeline.map((event, index) => (
        <div key={index} className="flex gap-4">
          {event.type === "comment" ? (
            <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
          ) : (
            <User className="w-5 h-5 text-gray-500 mt-1" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {event.user.firstName} {event.user.lastName}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatDate(event.date)}
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">{event.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 