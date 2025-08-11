"use client"

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/route";

export const Social = () => {

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500 bg-white px-2">o</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>
      <Button 
        size="lg" 
        variant="outline"
        className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 flex items-center justify-center gap-2"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="w-5 h-5" />
        <span>Continuar con Google</span>
      </Button>
    </div>
  );
}