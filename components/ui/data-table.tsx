import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CustomAction<T> {
  icon: React.ElementType;
  label: string;
  onClick: (item: T) => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T | ((item: T) => React.ReactNode);
  }[];
  actions?: {
    edit?: {
      href: (item: T) => string;
    };
    delete?: {
      onDelete: (id: string) => void;
    };
    custom?: CustomAction<T>[];
  };
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  emptyMessage = "No se encontraron registros",
}: DataTableProps<T>) {
  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`font-semibold ${
                  index === columns.length - 1 && actions ? "text-right" : ""
                }`}
              >
                {column.header}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-right font-semibold">Acciones</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    className={`${
                      index === columns.length - 1 && actions ? "text-right" : ""
                    }`}
                  >
                    {typeof column.accessorKey === "function"
                      ? column.accessorKey(item)
                      : column.accessorKey === "createdAt"
                        ? format(
                            new Date(item[column.accessorKey] as string),
                            "PPP",
                            {
                              locale: es,
                            }
                          )
                        : (item[column.accessorKey] as React.ReactNode)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {actions.edit && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={actions.edit.href(item)}>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {actions.custom?.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={action.variant || "outline"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => action.onClick(item)}
                              >
                                <Icon className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{action.label}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                      {actions.delete && (
                        <AlertDialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar</p>
                            </TooltipContent>
                          </Tooltip>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Está seguro de eliminar este registro?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminarán
                                todos los datos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => actions.delete?.onDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
}
