"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button asChild variant="outline" className="w-full" onClick={() => {}}>
      <Link href={href} className="flex items-center justify-center">
        {label}
        </Link>
    </Button>
  );
};

