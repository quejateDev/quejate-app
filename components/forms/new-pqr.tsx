"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function NewPQRForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Envía tu PQRS</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select>
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
            <Label htmlFor="subject">Asunto</Label>
            <Input id="subject" placeholder="Ingresa el asunto" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Ingresa tu descripción"
              rows={4}
            />
          </div>

          <div className="space-y-2">
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
          </div>

          <Button type="submit" className="w-full">
            Enviar PQRS
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}