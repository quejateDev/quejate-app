"use client";

import { createContext, useContext, useState } from "react";
import LoginModal from "@/components/Modals/LoginModal";

const LoginModalContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

const LoginModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LoginModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <LoginModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </LoginModalContext.Provider>
  );
};

export default LoginModalProvider;

export const useLoginModal = () => {
  return useContext(LoginModalContext);
};
