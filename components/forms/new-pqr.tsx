"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getDepartmentsService } from "@/services/Department.service";
import { createPQRS } from "@/services/pqr.service";
import { Department, PQRSType, Prisma, User } from "@prisma/client";
import { useEffect, useState } from "react";

type PQRSForm = {
  type: PQRSType;
  subject: string;
  description: string;
  departmentId: Department["id"];
  creatorId: User["id"];
  dueDate: Date;
};

export function NewPQRForm() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [pqr, setPqr] = useState<PQRSForm>({
    type: "PETITION",
    subject: "",
    description: "",
    departmentId: "",
    creatorId: "9111e543-2225-4865-af16-b477cbc26f02",
    dueDate: new Date(),
  });

  async function fetchDepartments() {
    try {
      const departments = await getDepartmentsService();
      setDepartments(departments);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Error al obtener los departamentos",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await createPQRS(pqr);
      toast({
        title: "PQRS enviado",
        description: "PQRS enviado correctamente",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al enviar el PQRS",
        variant: "destructive",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu PQRS</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              onValueChange={(value) =>
                setPqr((prev) => ({ ...prev, type: value as PQRSType }))
              }
              value={pqr.type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PETITION">Petición</SelectItem>
                <SelectItem value="COMPLAINT">Queja</SelectItem>
                <SelectItem value="CLAIM">Reclamo</SelectItem>
                <SelectItem value="SUGGESTION">Sugerencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select
              onValueChange={(value) =>
                setPqr((prev) => ({ ...prev, departmentId: value }))
              }
              value={pqr.departmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Asunto</Label>
            <Input
              id="subject"
              placeholder="Ingresa el asunto"
              value={pqr.subject}
              onChange={(e) =>
                setPqr((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Ingresa tu descripción"
              rows={4}
              value={pqr?.description || ""}
              onChange={(e) =>
                setPqr((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="files">Archivos Adjuntos</Label>
            <Input
              id="files"
              type="file"
              className="cursor-pointer"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            <p className="text-sm text-gray-500">
              Formatos permitidos: PDF, DOC, DOCX, PNG, JPG (Máx. 5MB
              por archivo)
            </p>
          </div> */}

          <Button
            type="submit"
            className="w-full"
            disabled={
              !pqr.type || !pqr.subject || !pqr.description || !pqr.departmentId
            }
          >
            Enviar PQRS
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
