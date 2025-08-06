import { cn } from "@/lib/utils";

interface HeaderProps {
    label: string;
}

export const Header = ( { label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center ">
            <h1 className={cn("text-3xl font-semibold text-center")}>Auth</h1>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}