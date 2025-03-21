import { Badge } from "@/components/ui/badge";
import { typeMap, statusMap } from "../../../constants/pqrMaps";

type PQRCardHeaderProps = {
  pqr: {
    creator: {
      firstName: string;
      lastName: string;
    };
    anonymous: boolean;
    createdAt: Date;
    type: keyof typeof typeMap;
    status: keyof typeof statusMap;
  };
};

export function PQRCardHeader({ pqr }: PQRCardHeaderProps) {
  const creatorName = !pqr.anonymous
    ? `${pqr.creator.firstName} ${pqr.creator.lastName}`
    : "Anónimo";

  const formattedDate = new Date(pqr.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusInfo = statusMap[pqr.status];
  const typeInfo = typeMap[pqr.type];

  return (
    <>
      <div className="hidden md:block">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
              <span className="text-md">{creatorName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>
          <Badge variant={statusInfo.variant as any}>{statusInfo.label}</Badge>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
              <span className="text-md">{creatorName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-semibold">{creatorName}</p>
              <p className="text-xs text-muted-foreground">
                {formattedDate} •{" "}
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </p>
            </div>
          </div>
          <Badge variant={statusInfo.variant as any} className="text-xs">
            {statusInfo.label}
          </Badge>
        </div>
      </div>
    </>
  );
}