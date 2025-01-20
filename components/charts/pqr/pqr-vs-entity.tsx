"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";

export function PqrVsEntityChart({ pqrs }: { pqrs: any }) {
  function getPqrsByEntity() {
    const pqrsByEntity = pqrs.reduce((acc: any, pqr: any) => {
      const entity = pqr.department?.entity?.name;
      if (entity) {
        acc[entity] = (acc[entity] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(pqrsByEntity)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([entity, count]) => ({
        name: entity,
        Registros: count,
      }));
  }

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>PQRS por Entidad</CardTitle>
        <CardDescription>
          Observa la cantidad de PQRS por entidad (Top 10)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <BarChart data={getPqrsByEntity()} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="Registros" fill="#8884d8" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
