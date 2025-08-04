
import prisma from "./prisma";
import { str } from 'crc-32';

export async function checkCodeExists(code: string): Promise<boolean> {
  const existing = await prisma.entityConsecutive.findUnique({
    where: { code }
  });
  return existing !== null;
}

export function getInitials(name: string): string {
  const words = name.split(' ').filter(word => word.length > 0);
  let initials = words.map(word => word[0]?.toUpperCase() ?? '').join('');

  if (initials.length < 2) {
    initials = (initials + initials.charAt(0).repeat(2)).slice(0, 2);
  } else {
    initials = initials.slice(0, 2);
  }

  return initials;
}

export async function generateUniqueConsecutiveCode(name: string): Promise<string> {
  const initials = getInitials(name);
  const hash = str(name).toString(16).slice(-2).toUpperCase();
  const baseCode = `${initials}-${hash}`;
  let uniqueCode = baseCode;
  let counter = 1;

  while (await checkCodeExists(uniqueCode)) {
    uniqueCode = `${baseCode}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error('No se pudo generar un código único después de 100 intentos');
    }
  }

  return uniqueCode;
}