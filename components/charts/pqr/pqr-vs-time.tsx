"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from "recharts";

export function PqrVsTimeChart({ pqrs }: { pqrs: any }) {
  function getPqrsByDate() {
    const pqrsByDate = pqrs.reduce((acc: any, pqr: any) => {
      const date = new Date(pqr.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pqrsByDate).map(([date, count]) => ({
      name: date,
      Registros: count,
    }));
  }

  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>PQRS creados a lo largo del tiempo</CardTitle>
        <CardDescription>
          Observa la cantidad de PQRS creados a lo largo del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <LineChart data={getPqrsByDate()} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Line type="natural" dataKey="Registros" stroke="#8884d8" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
