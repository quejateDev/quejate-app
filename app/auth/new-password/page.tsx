import NewPasswordForm from "@/components/auth/new-password-form";
import { Suspense } from "react";

const NewPasswordPage = () => {
  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
};

export default NewPasswordPage;
