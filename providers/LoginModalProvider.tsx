"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "@/components/auth/login-form";

interface LoginModalContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <LoginForm />
        </DialogContent>
      </Dialog>
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
