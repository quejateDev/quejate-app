// Components
export { ActionButton } from "./components/ActionButton";
export { FollowUpOptionsList } from "./components/FollowUpOptionsList";
export { MainOptionsView } from "./components/MainOptionsView";
export { TutelaFormView } from "./components/TutelaFormView";
export { DocumentExportView } from "./components/DocumentExportView";
export { LawyersListView } from "./components/LawyersListView";
export { LawyerDetailModal } from "./components/LawyerDetailModal";
export { LawyerRequestModal } from "./components/LawyerRequestModal";

// Hooks
export { usePQRFollowUp } from "./hooks/usePQRFollowUp";
export { useLawyersList } from "./hooks/useLawyersList";

// Services
export { pqrFollowUpService, PQRFollowUpService } from "./services/pqrFollowUpService";

// Constants
export { followUpOptions, pqrTypeOptions } from "./constants/followUpOptions";

// Main Modal (refactored version)
export { PQRFollowUpModal } from "./PQRFollowUpModal";
