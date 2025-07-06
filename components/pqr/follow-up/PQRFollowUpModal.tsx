"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { typeMap } from "@/constants/pqrMaps";
import { PQR } from "@/types/pqrsd";
import { usePQRFollowUp } from "./hooks/usePQRFollowUp";
import { MainOptionsView } from "./components/MainOptionsView";
import { TutelaFormView } from "./components/TutelaFormView";
import { DocumentExportView } from "./components/DocumentExportView";
import { LawyersListView } from "./components/LawyersListView";

type PQRFollowUpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pqrType: keyof typeof typeMap;
  pqrData: PQR;
};

export function PQRFollowUpModal({
  open,
  onOpenChange,
  pqrType,
  pqrData,
}: PQRFollowUpModalProps) {
  const {
    selectedOption,
    oversightEntity,
    isLoading,
    error,
    showTutelaForm,
    isGenerating,
    generatedDocument,
    showDocumentExport,
    showLawyersList,
    handleOptionSelect,
    handleClose,
    handleGenerateDocument,
    handleMouseEnter,
    handleMouseLeave,
    setShowTutelaForm,
    setShowLawyersList,
  } = usePQRFollowUp(pqrType, pqrData, onOpenChange);

  const getDialogClassName = () => {
    if (showDocumentExport && generatedDocument) {
      return "sm:max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] h-[90vh]";
    }
    if (showTutelaForm) {
      return "sm:max-w-xl";
    }
    if (showLawyersList) {
      return "sm:max-w-2xl";
    }
    return "sm:max-w-md";
  };

  const renderContent = () => {
    if (showDocumentExport && generatedDocument) {
      return (
        <DocumentExportView
          selectedOption={selectedOption}
          generatedDocument={generatedDocument}
          pqrData={pqrData}
          oversightEntity={oversightEntity}
          onClose={handleClose}
        />
      );
    }

    if (showTutelaForm) {
      return (
        <TutelaFormView
          pqrData={pqrData}
          isLoading={isGenerating}
          onGenerateDocument={handleGenerateDocument}
          onClose={() => setShowTutelaForm(false)}
        />
      );
    }

    if (showLawyersList) {
      return (
        <LawyersListView
          pqrData={pqrData}
          onBack={() => setShowLawyersList(false)}
        />
      );
    }

    return (
      <MainOptionsView
        pqrType={pqrType}
        oversightEntity={oversightEntity}
        error={error}
        onOptionSelect={handleOptionSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`bg-white ${getDialogClassName()}`}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
