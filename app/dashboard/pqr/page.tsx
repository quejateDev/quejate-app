"use client";

import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getPQRS } from "@/services/api/pqr.service";
import { Prisma } from "@prisma/client";
import { EyeIcon } from "lucide-react";
import {
  BarChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

const pqrs = await getPQRS();

export default function PQRPage() {
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

  function getPqrsByDate() {
    const pqrsByDate = pqrs.reduce((acc: any, pqr: any) => {
      const date = new Date(pqr.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pqrsByDate).map(([date, count]) => ({
      name: date,
      count,
    }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <PqrVsTimeChart pqrs={pqrs} />
        <PqrVsDepartmentChart pqrs={pqrs} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>PQRS</CardTitle>
          <CardDescription>
            Gestiona las PQRS creadas por los usuarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Creador</TableHead>
                <TableHead>Tiempo para responder</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pqrs.map(
                (
                  pqr: Prisma.PQRSGetPayload<{
                    include: { department: true; creator: true };
                  }>
                ) => (
                  <TableRow key={pqr.id}>
                    <TableCell>{pqr.id.slice(0, 6)}</TableCell>
                    <TableCell>{pqr.type}</TableCell>
                    <TableCell>{pqr.subject}</TableCell>
                    <TableCell>{pqr.description}</TableCell>
                    <TableCell>{pqr.department?.name}</TableCell>
                    <TableCell>
                      {pqr.creator?.firstName} {pqr.creator?.lastName}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      {getRemainingTimeBadge(pqr.createdAt)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <a href={`/dashboard/pqr/${pqr.id}`}>
                              <Button variant="outline" size="icon">
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver PQRS</p>
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
    </div>
  );
}
