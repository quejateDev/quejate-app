"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  headerDescription?: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    headerDescription,
    backButtonLabel,
    backButtonHref,
    showSocial = false
}: CardWrapperProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white">
                <CardHeader className="px-8 py-6">
                   <Header label={headerLabel} description={headerDescription} />     
                </CardHeader>
            <CardContent className="px-8 pb-6">
                {children}
            </CardContent>
           {showSocial && (
            <CardFooter className="px-8 pb-4">
                <Social />
            </CardFooter>
           )}
           <CardFooter className="text-center px-8 pb-6">
            <BackButton 
            label={backButtonLabel}
            href={backButtonHref}
            />
              </CardFooter>
        </Card>
        </div>
    );
}