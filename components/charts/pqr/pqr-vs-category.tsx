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

export function PqrVsCategoryChart({ pqrs }: { pqrs: any }) {
  function getPqrsByCategory() {
    const pqrsByCategory = pqrs.reduce((acc: any, pqr: any) => {
      const category = pqr.department?.entity?.category?.name;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(pqrsByCategory)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([category, count]) => ({
        name: category,
        Registros: count,
      }));
  }

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>PQRS por Categoría</CardTitle>
        <CardDescription>
          Observa la cantidad de PQRS por categoría de entidad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <BarChart data={getPqrsByCategory()} accessibilityLayer>
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
