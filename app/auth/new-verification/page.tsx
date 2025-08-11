import { NewVerificationForm } from "@/components/auth/new-verification-form"
import { Suspense } from "react";


const NewVerificationPage = async () => {
   return (
      <div className="w-full min-h-screen">
         <Suspense fallback={<div>Loading...</div>}>
            <NewVerificationForm />
         </Suspense>
      </div>
   )
}

export default NewVerificationPage;