import { typeMap } from "@/constants/pqrMaps";
import { ActionButton } from "./ActionButton";
import { followUpOptions, pqrTypeOptions } from "../constants/followUpOptions";
import { OversightEntity } from "../types";

type FollowUpOptionsListProps = {
  pqrType: keyof typeof typeMap;
  typeLabel: string;
  oversightEntity: OversightEntity | null;
  error: string | null;
  onOptionSelect: (option: string) => void;
  onMouseEnter: (option: string) => void;
  onMouseLeave: () => void;
};

export function FollowUpOptionsList({
  pqrType,
  typeLabel,
  oversightEntity,
  error,
  onOptionSelect,
  onMouseEnter,
  onMouseLeave,
}: FollowUpOptionsListProps) {
  const availableOptions = pqrTypeOptions[pqrType] || [];

  const getOversightDescription = () => {
    if (error) return error;
    return "Enviar a ente de control competente";
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Selecciona el tipo de seguimiento que deseas realizar para tu {typeLabel}.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {availableOptions.map((optionKey: string) => {
          const option = followUpOptions[optionKey as keyof typeof followUpOptions];
          const isOversight = optionKey === "oversight";
          
          const isDisabled = isOversight && 
            !(pqrType === "COMPLAINT" || pqrType === "REPORT") && 
            (!!error || !oversightEntity);
            
          const description = isOversight ? getOversightDescription() : option.description;

          return (
            <ActionButton
              key={optionKey}
              option={optionKey}
              icon={option.icon}
              title={option.title}
              description={description}
              colorClass={option.colorClass}
              disabled={isDisabled}
              onSelect={onOptionSelect}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            />
          );
        })}
      </div>
    </div>
  );
}
