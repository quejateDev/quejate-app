"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { typeMap } from "@/constants/pqrMaps";
import { PQR } from "@/types/pqrsd";
import { usePQRFollowUp } from "./hooks/usePQRFollowUp";
import { MainOptionsView } from "./components/MainOptionsView";
import { TutelaFormView } from "./components/TutelaFormView";
import { DocumentExportView } from "./components/DocumentExportView";
import { LawyersListView } from "./components/LawyersListView";
import { LawyerRequestModal } from "./components/LawyerRequestModal";
import { OversightEntityListView } from "./components/OversightEntityListView";
import { OversightDocumentLoadingView } from "./components/OversightDocumentLoadingView";
import { useLawyersList } from "./hooks/useLawyersList";

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
  const { sendLawyerRequest } = useLawyersList();
  const {
    selectedOption,
    oversightEntity,
    oversightEntities,
    isLoading,
    isLoadingEntities,
    isGeneratingOversightDoc,
    error,
    showTutelaForm,
    showOversightEntityList,
    isGenerating,
    generatedDocument,
    showDocumentExport,
    showLawyersList,
    showLawyerRequestModal,
    selectedLawyer,
    handleOptionSelect,
    handleOversightEntitySelect,
    handleClose,
    handleGenerateDocument,
    handleMouseEnter,
    handleMouseLeave,
    handleLawyerSelected,
    setShowTutelaForm,
    setShowLawyersList,
    setShowOversightEntityList,
    setShowLawyerRequestModal,
  } = usePQRFollowUp(pqrType, pqrData, onOpenChange);

  const getDialogClassName = () => {
    if (showDocumentExport && generatedDocument) {
      return "sm:max-w-3xl p-0 overflow-hidden flex flex-col max-h-[90vh] h-[90vh]";
    }
    if (showTutelaForm) {
      return "sm:max-w-xl";
    }
    if (showLawyersList || showOversightEntityList || isGeneratingOversightDoc) {
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
          onLawyerSelected={handleLawyerSelected}
        />
      );
    }

    if (showOversightEntityList) {
      return (
        <OversightEntityListView
          entities={oversightEntities}
          isLoading={isLoadingEntities}
          error={error}
          onEntitySelect={handleOversightEntitySelect}
          onBack={() => setShowOversightEntityList(false)}
        />
      );
    }

    if (isGeneratingOversightDoc && oversightEntity) {
      return (
        <OversightDocumentLoadingView
          oversightEntityName={oversightEntity.name}
          onBack={handleClose}
        />
      );
    }

    return (
      <MainOptionsView
        pqrType={pqrType}
        oversightEntity={null}
        error={null}
        onOptionSelect={handleOptionSelect}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className={`bg-white ${getDialogClassName()}`}>
          {renderContent()}
        </DialogContent>
      </Dialog>

      {selectedLawyer && (
        <LawyerRequestModal
          lawyer={selectedLawyer}
          pqrData={pqrData}
          open={showLawyerRequestModal}
          onOpenChange={setShowLawyerRequestModal}
          onSubmitRequest={async (lawyerId, message, clientContactEmail, clientContactPhone, pqrId) => {
            const success = await sendLawyerRequest(lawyerId, message, clientContactEmail, clientContactPhone, pqrId);
            if (success) {
              setShowLawyerRequestModal(false);
              handleClose();
            }
            return success;
          }}
        />
      )}
    </>
  );
}
