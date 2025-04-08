"use client";

import { ClientForm } from "@/components/forms/client-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewEmployeePage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a Empleados
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <UserPlus className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Nuevo Empleado</h1>
        </div>
      </div>
      
      <Card className="border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium text-muted-foreground">
            Complete la información del empleado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
