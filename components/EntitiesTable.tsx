import { Entity } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EntitiesTableProps {
  entities: Entity[];
}

export function EntitiesTable({ entities }: EntitiesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha de Creación</TableHead>
          <TableHead>Última Actualización</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entities.map((entity) => (
          <TableRow key={entity.id}>
            <TableCell className="font-medium">{entity.name}</TableCell>
            <TableCell>{entity.description || "Sin descripción"}</TableCell>
            <TableCell>{new Date(entity.createdAt).toLocaleDateString("es-ES")}</TableCell>
            <TableCell>{new Date(entity.updatedAt).toLocaleDateString("es-ES")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
