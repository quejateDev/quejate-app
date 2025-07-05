import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { FollowUpOptionsList } from "./FollowUpOptionsList";
import { typeMap } from "@/constants/pqrMaps";
import { OversightEntity } from "../types";

type MainOptionsViewProps = {
  pqrType: keyof typeof typeMap;
  oversightEntity: OversightEntity | null;
  error: string | null;
  onOptionSelect: (option: string) => void;
  onMouseEnter: (option: string) => void;
  onMouseLeave: () => void;
};

export function MainOptionsView({
  pqrType,
  oversightEntity,
  error,
  onOptionSelect,
  onMouseEnter,
  onMouseLeave,
}: MainOptionsViewProps) {
  const typeLabel = typeMap[pqrType].label.toLowerCase();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Opciones de seguimiento
        </DialogTitle>
      </DialogHeader>

      <FollowUpOptionsList
        pqrType={pqrType}
        typeLabel={typeLabel}
        oversightEntity={oversightEntity}
        error={error}
        onOptionSelect={onOptionSelect}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </>
  );
}
