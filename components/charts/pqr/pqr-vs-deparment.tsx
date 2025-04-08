"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { CHART_COLORS } from "@/lib/config";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface PqrVsDepartmentChartProps {
  pqrs: Array<{
    department?: {
      name: string;
    };
  }>;
}

export default function PqrVsDepartmentChart({ pqrs }: PqrVsDepartmentChartProps) {
  function getPqrsByDepartment() {
    const pqrsByDepartment = pqrs.reduce((acc: Record<string, number>, pqr) => {
      const department = pqr.department?.name || "Sin asignar";
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pqrsByDepartment)
      .sort(([, a], [, b]) => b - a)
      .map(([department, count]) => ({
        name: department,
        Registros: count,
      }));
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} PQRSD{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  const data = getPqrsByDepartment();
  const total = data.reduce((sum, entry) => sum + entry.Registros, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>PQRSD por departamento</CardTitle>
          <CardDescription>
            Distribución de PQRSD por departamento en gráfico de barras
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="#64748b"
                fontSize={12}
                interval={0}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => value.toFixed(0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="Registros"
                fill="#8884d8"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Distribución porcentual</CardTitle>
          <CardDescription>
            Distribución de PQRSD por departamento en gráfico circular
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Pie
                data={data}
                nameKey="name"
                dataKey="Registros"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, value }) => `${name} (${((value / total) * 100).toFixed(1)}%)`}
                labelLine={true}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
