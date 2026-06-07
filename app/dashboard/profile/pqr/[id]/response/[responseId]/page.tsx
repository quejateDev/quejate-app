"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  MessageSquareText,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PQRAttachments } from "@/components/pqr/pqr-attachments";
import { formatDate } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";

type EntityResponseItem = {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  attachments: Array<{
    id: string;
    url: string;
    name: string;
    type: string | null;
  }>;
};

type ResponsesPageData = {
  pqr: {
    id: string;
    subject: string | null;
    consecutiveCode: string | null;
  };
  entity: {
    id: string;
    name: string;
    email: string | null;
    imageUrl: string | null;
  };
  responses: EntityResponseItem[];
};

function MetadataLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function ResponseBlock({
  response,
  responseRef,
}: {
  response: EntityResponseItem;
  responseRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={responseRef}
      className="rounded-lg border border-border overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-3 bg-accent/30 border-b border-border">
        <Avatar className="h-8 w-8 shrink-0 border-2 border-primary/20">
          {response.user.image && (
            <AvatarImage
              src={response.user.image}
              alt={response.user.name ?? "Funcionario"}
            />
          )}
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {response.user.name?.[0]?.toUpperCase() ?? (
              <User className="h-3.5 w-3.5" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {response.user.name ?? "Funcionario"}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            {formatDate(response.createdAt)}
          </p>
        </div>
      </div>

      <div className="border-l-4 border-quaternary bg-card px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[15px] sm:text-base text-foreground leading-relaxed whitespace-pre-wrap">
          {response.text}
        </p>
      </div>

      {response.attachments.length > 0 && (
        <div className="px-5 py-4 sm:px-6 border-t border-border bg-card">
          <PQRAttachments
            attachments={response.attachments.map((att) => ({
              name: att.name,
              url: att.url,
              type: att.type ?? "",
            }))}
          />
        </div>
      )}
    </div>
  );
}

export default function EntityResponsePage() {
  const { id: pqrId, responseId } = useParams<{
    id: string;
    responseId: string;
  }>();
  const [data, setData] = useState<ResponsesPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchResponses() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/pqr/${pqrId}/responses`);

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("PQRSD no encontrada");
          }
          if (res.status === 403) {
            throw new Error("No tienes permiso para ver estas respuestas");
          }
          throw new Error("Error al cargar las respuestas");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching entity responses:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    if (pqrId) {
      fetchResponses();
    }
  }, [pqrId]);

  useEffect(() => {
    if (!loading && data && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-muted rounded w-36" />
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="h-28 bg-tertiary/20" />
            <div className="h-16 bg-accent/60" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-10 max-w-3xl px-4 text-center">
        <p className="text-muted-foreground mb-4">
          {error ?? "No se pudo cargar las respuestas"}
        </p>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/profile/pqr/${pqrId}`}>
            Volver a la PQRSD
          </Link>
        </Button>
      </div>
    );
  }

  const { pqr, entity, responses } = data;

  if (responses.length === 0) {
    return (
      <div className="container mx-auto py-10 max-w-3xl px-4 text-center">
        <p className="text-muted-foreground mb-4">
          Esta PQRSD aún no tiene respuestas de la entidad.
        </p>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/profile/pqr/${pqrId}`}>
            Volver a la PQRSD
          </Link>
        </Button>
      </div>
    );
  }

  const responseCount = responses.length;

  return (
    <div className="container mx-auto py-8 max-w-3xl px-4 space-y-4">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="gap-2 -ml-2 text-primary hover:text-quaternary"
      >
        <Link href={`/dashboard/profile/pqr/${pqrId}`}>
          <ArrowLeft className="h-4 w-4" />
          Volver a la PQRSD
        </Link>
      </Button>

      <Card className="overflow-hidden border-border shadow-sm">
        <div className="bg-tertiary px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2 min-w-0">
              <div className="flex items-center gap-2 text-secondary">
                <MessageSquareText className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Respuestas oficiales
                </span>
              </div>
              <h1 className="text-xl font-bold text-tertiary-foreground leading-tight">
                Respuestas de la entidad
              </h1>
              {pqr.consecutiveCode && (
                <Link
                  href={`/dashboard/profile/pqr/${pqrId}`}
                  className="text-sm font-semibold text-secondary hover:text-quaternary-foreground underline-offset-2 hover:underline transition-colors"
                >
                  No. {pqr.consecutiveCode}
                </Link>
              )}
            </div>

            <div
              className={cn(
                "inline-flex items-center gap-1.5 shrink-0 self-start",
                "rounded-full bg-quaternary px-3.5 py-1.5",
                "text-sm font-semibold text-quaternary-foreground shadow-sm"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {responseCount === 1
                ? "1 respuesta"
                : `${responseCount} respuestas`}
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="flex items-center gap-3 px-5 py-4 bg-accent/50 border-b border-border">
            <Avatar className="h-10 w-10 shrink-0 border-2 border-primary/20 rounded-md">
              {entity.imageUrl && (
                <AvatarImage
                  src={entity.imageUrl}
                  alt={entity.name}
                  className="object-contain p-0.5"
                />
              )}
              <AvatarFallback className="bg-primary/10 text-primary rounded-md text-sm font-semibold">
                {entity.name[0]?.toUpperCase() ?? (
                  <Building2 className="h-5 w-5" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <MetadataLabel>Entidad</MetadataLabel>
              <p className="font-semibold text-foreground truncate">
                {entity.name}
              </p>
              {entity.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {entity.email}
                </p>
              )}
            </div>
          </div>

          <div className="px-5 py-6 sm:px-6 space-y-5">
            {responses.map((response) => (
              <ResponseBlock
                key={response.id}
                response={response}
                responseRef={
                  response.id === responseId ? highlightedRef : undefined
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
