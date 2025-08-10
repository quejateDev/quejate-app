"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial = false
}: CardWrapperProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-white">
                <CardHeader className="space-y-4 pb-4">
                   <Header label={headerLabel} />     
                </CardHeader>
                <CardContent className="space-y-4">
                    {children}
                </CardContent>
               {showSocial && (
                <CardFooter className="pt-4">
                    <Social />
                </CardFooter>
               )}
               <CardFooter className="text-center pt-2 pb-6">
                <BackButton 
                label={backButtonLabel}
                href={backButtonHref}
                />
                  </CardFooter>
            </Card>
        </div>
    );
}