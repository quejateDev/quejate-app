"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
} from "recharts";

export default function PqrVsDepartmentChart({ pqrs }: { pqrs: any }) {
  function getPqrsByDepartment() {
    const pqrsByDepartment = pqrs.reduce((acc: any, pqr: any) => {
      const department = pqr.department?.name;
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pqrsByDepartment).map(([department, count]) => ({
      name: department,
      Registros: count,
    }));
  }

  return (
    <div className="flex flex-row gap-4 w-full">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>PQRSD por departamento</CardTitle>
          <CardDescription>
            Observa la cantidad de PQRSD por departamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}}>
            <BarChart data={getPqrsByDepartment()} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="Registros" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>PQRSD por departamento</CardTitle>
          <CardDescription>
            Observa la cantidad de PQRSD por departamento
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
              <Pie
                data={getPqrsByDepartment()}
                nameKey="name"
                dataKey="Registros"
                fill="#8884d8"
                label
              />
              <ChartTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
