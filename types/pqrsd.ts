import { statusMap, typeMap } from "@/constants/pqrMaps";

export interface PQR {
  id: string;
  type: keyof typeof typeMap;
  status: keyof typeof statusMap;
  dueDate: Date;
  anonymous: boolean;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
  subject?: string | null;
  description?: string | null;
  creator: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
  department: {
    name: string;
  } | null;
  entity: {
    id: string;
    name: string;
  };
  likes: { id: string; userId: string }[];
  customFieldValues: { name: string; value: string }[];
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  _count: {
    likes: number;
    comments: number;
  };
  /**
   * Vencimiento legal, **calculado por el servidor** en cada respuesta
   * (`getOverdueInfo`, `quejate-backend/src/pqr/overdue/overdue.ts`): los mismos
   * dos campos con los que la app móvil decide y redacta. `false` cuando el
   * tipo no tiene plazo legal —las sugerencias— o la PQRSD ya está resuelta o
   * cerrada.
   *
   * Los traen `GET /pqr`, `GET /pqr/:id` y `GET /pqr/user/:id`. La respuesta de
   * radicar (`POST /pqr`) no: una PQRSD recién radicada no puede estar vencida.
   */
  isOverdue: boolean;
  /**
   * Días **hábiles** transcurridos desde `dueDate`, con los festivos
   * colombianos calculados; `0` si no está vencida. Es el número que va en la
   * tutela y en el oficio.
   */
  businessDaysOverdue: number;
}