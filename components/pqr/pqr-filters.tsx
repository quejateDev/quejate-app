"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { Prisma } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useState, useEffect } from "react";

type PqrFiltersProps = {
  departments: Prisma.DepartmentGetPayload<{
    include: {
      entity: true;
    };
  }>[];
  startDate: string | null;
  endDate: string | null;
};

export function PqrFilters({
  departments,
  endDate,
  startDate,
}: PqrFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate ? parseISO(startDate) : undefined,
    to: endDate ? parseISO(endDate) : undefined,
  });

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // If entity changes, clear department
    if (key === "entityId") {
      params.delete("departmentId");
    }

    const newUrl = `?${params.toString()}`;

    router.push(newUrl);
  }

  const handleDateSelect = (range: DateRange | undefined) => {
    console.log("Date range selected:", range);

    // Update local state
    setDate(range);

    if (range?.from) {
      updateFilters("startDate", range.from.toISOString());
    } else {
      updateFilters("startDate", null);
    }

    if (range?.to) {
      updateFilters("endDate", range.to.toISOString());
    } else {
      updateFilters("endDate", null);
    }

    // Close the popover after selection
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        value={searchParams.get("departmentId") || ""}
        onValueChange={(value) => updateFilters("departmentId", value)}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Filtrar por departamento" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((department) => (
            <SelectItem key={department.id} value={department.id}>
              {department.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date?.to ? (
                <>
                  {format(date.from, "P", { locale: es })} -{" "}
                  {format(date.to, "P", { locale: es })}
                </>
              ) : (
                format(date.from, "P", { locale: es })
              )
            ) : (
              <span>Filtrar por fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from ? date.from : undefined}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
