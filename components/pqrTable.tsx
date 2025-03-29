"use client";

import { Prisma } from "@prisma/client";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { EyeIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function PqrTable({ pqrs }: { pqrs: any }) {
  function getRemainingTimeBadge(createdAt: Date) {
    const RESPONSE_LIMIT_DAYS = 15;
    const remainingTime =
      new Date(createdAt).getTime() + RESPONSE_LIMIT_DAYS * 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    const remaining = Math.floor(
      (remainingTime - currentTime) / (1000 * 60 * 60 * 24)
    );

    if (remaining > 5) {
      return <Badge variant="success">{remaining} días</Badge>;
    } else if (remaining > 0) {
      return <Badge variant="warning">{remaining} días</Badge>;
    } else {
      return <Badge variant="destructive">Vencido</Badge>;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PQRSD</CardTitle>
        <CardDescription>
          Gestiona las PQRSD creadas por los usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead className="text-center">Tiempo para responder</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pqrs.map(
              (
                pqr: Prisma.PQRSGetPayload<{
                  include: {
                    department: {
                      include: {
                        entity: {
                          include: {
                            category: true;
                          };
                        };
                      };
                    };
                    creator: true;
                  };
                }>
              ) => (
                <TableRow key={pqr.id}>
                  <TableCell>{pqr.id.slice(0, 6)}</TableCell>
                  <TableCell>{pqr.type}</TableCell>
                  <TableCell>
                    {pqr.department?.entity?.category?.name}
                  </TableCell>
                  <TableCell>{pqr.department?.entity?.name}</TableCell>
                  <TableCell>{pqr.department?.name}</TableCell>
                  <TableCell>{pqr.creator?.email}</TableCell>
                  <TableCell className="flex justify-center w-full">
                    {getRemainingTimeBadge(pqr.createdAt)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={`/admin/pqr/${pqr.id}`}>
                            <Button variant="outline" size="icon">
                              <EyeIcon className="w-4 h-4" />
                            </Button>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ver PQRSD</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
