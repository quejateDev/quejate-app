"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CHART_COLORS } from "@/lib/config";
interface PqrVsTimeChartProps {
  pqrs: Array<{
    createdAt: Date;
  }>;
}

export function PqrVsTimeChart({ pqrs }: PqrVsTimeChartProps) {
  function getPqrsByDate() {
    const pqrsByDate = pqrs.reduce((acc: Record<string, number>, pqr) => {
      const date = new Date(pqr.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(pqrsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date: new Date(date),
        Registros: count,
      }));
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">
            {format(new Date(label), "d 'de' MMMM, yyyy", { locale: es })}
          </p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} PQRSD{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PQRSD creados a lo largo del tiempo</CardTitle>
        <CardDescription>
          Observa la cantidad de PQRSD creados a lo largo del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={getPqrsByDate()} 
            margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
          >
            <defs>
              <linearGradient id="colorRegistros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), "d MMM", { locale: es })}
              angle={-45}
              textAnchor="end"
              height={60}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Registros"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS[0], strokeWidth: 2 }}
              activeDot={{ r: 6, fill: CHART_COLORS[0] }}
              fillOpacity={1}
              fill="url(#colorRegistros)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
