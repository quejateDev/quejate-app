import Image from "next/image";

interface HeaderProps {
    label: string;
}

export const Header = ( { label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center">
            <div className="flex justify-center my-4">
                <Image 
                    src="/LogotipoEditableterpng.png" 
                    alt="Quéjate Logo" 
                    width={150} 
                    height={60}
                    className="object-contain"
                    priority
                />
            </div>
            <p className="text-lg font-medium text-gray-700 text-center">{label}</p>
        </div>
    );
}