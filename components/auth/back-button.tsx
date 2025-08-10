"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button asChild variant="link" className="w-full text-gray-600 hover:text-blue-600">
      <Link href={href} className="flex items-center justify-center text-sm">
        {label}
        </Link>
    </Button>
  );
};

