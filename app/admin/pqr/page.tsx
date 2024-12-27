"use client";

import PqrVsDepartmentChart from "@/components/charts/pqr/pqr-vs-deparment";
import { PqrVsTimeChart } from "@/components/charts/pqr/pqr-vs-time";
import PqrTable from "@/components/pqrTable";
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
  

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4 w-full">
        <PqrVsTimeChart pqrs={pqrs} />
        <PqrVsDepartmentChart pqrs={pqrs} />
      </div>

      <PqrTable pqrs={pqrs} />
    </div>
  );
}
