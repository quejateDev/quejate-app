"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationContent } from "./verification-content";

export default function VerifyEmail() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center">
            Verificación de Email
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Suspense fallback={
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          }>
            <VerificationContent />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}