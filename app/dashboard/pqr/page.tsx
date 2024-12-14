import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getPQRS } from "@/services/pqr.service";
import { Prisma } from "@prisma/client";

const pqrs = await getPQRS();

export default function PQRPage() {
  return (
    <div>
      <h1>PQRS</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Asunto</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Creador</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pqrs.map((pqr: Prisma.PQRSGetPayload<{ include: { department: true; creator: true } }>) => (
            <TableRow key={pqr.id}>
              <TableCell>{pqr.id}</TableCell>
              <TableCell>{pqr.type}</TableCell>
              <TableCell>{pqr.subject}</TableCell>
              <TableCell>{pqr.description}</TableCell>
              <TableCell>{pqr.department?.name}</TableCell>
              <TableCell>{pqr.creator?.firstName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
