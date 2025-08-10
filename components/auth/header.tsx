import Image from "next/image";

interface HeaderProps {
    label?: string;
    description?: string;
}

export const Header = ( { label, description }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-3">
            <div className="flex justify-center mt-4 mb-2">
                <Image 
                    src="/LogotipoEditableterpng.png" 
                    alt="Quéjate Logo" 
                    width={150} 
                    height={60}
                    className="object-contain"
                    priority
                />
            </div>
            {label && (
                <p className="mt-3 text-sm font-medium text-gray-700 text-left">{label}</p>
            )}
            {description && (
                <p className="mt-1 text-xs text-gray-500 text-left">{description}</p>
            )}
        </div>
    );
}