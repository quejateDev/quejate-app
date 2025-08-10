"use client";

import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginFormModal from "@/components/auth/login-form-modal";

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
        <DialogContent className="sm:max-w-[300px] p-6 bg-white">
          <LoginFormModal/>
        </DialogContent>
      </Dialog>
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
