import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: Date | string) {
  const parsedDate = new Date(date)
  
  if (isNaN(parsedDate.getTime())) {
    return date
  }
  return new Intl.DateTimeFormat("es-ES", {
    month: "short",
    day: "numeric",
  }).format(parsedDate)
}