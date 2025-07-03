"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LawyerRegistrationForm, VerificationModal } from "@/components/lawyer";
import { useLawyerRegistration } from "@/hooks/useLawyerRegistration";

export default function LawyerRegistrationPage() {
  const {
    formData,
    loading,
    isUploadingImage,
    verificationModal,
    verificationStatus,
    currentSpecialty,
    documentTypeOptions,
    canVerify,
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleAddSpecialty,
    handleRemoveSpecialty,
    handleSubmit,
    setVerificationModal,
    setCurrentSpecialty,
  } = useLawyerRegistration();

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl py-4 text-center">
            Registro de Abogado
          </CardTitle>
          <CardDescription>
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Se verificará automáticamente con
                la Rama Judicial que tu tarjeta profesional esté vigente. Todos
                los datos proporcionados deben ser verídicos y actualizados.
              </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LawyerRegistrationForm
            formData={formData}
            currentSpecialty={currentSpecialty}
            documentTypeOptions={documentTypeOptions}
            loading={loading}
            isUploadingImage={isUploadingImage}
            canVerify={canVerify}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onFileChange={handleFileChange}
            onCurrentSpecialtyChange={setCurrentSpecialty}
            onAddSpecialty={handleAddSpecialty}
            onRemoveSpecialty={handleRemoveSpecialty}
          />
        </CardContent>
      </Card>

      <VerificationModal
        isOpen={verificationModal}
        verificationStatus={verificationStatus}
        onClose={() => setVerificationModal(false)}
      />
    </main>
  );
}
