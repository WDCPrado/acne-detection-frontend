import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatedRut = (rut: any) => {
  // Elimina cualquier guión o punto del RUT y lo convierte a mayúsculas
  if (rut === null) return null;
  rut = rut
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/[^0-9kK-]/g, "")
    .toUpperCase();

  if (rut.length < 2) {
    return rut;
  }

  // Separa el RUT en su parte numérica y su dígito verificador
  const rutPart = rut.slice(0, -1);
  const verificador = rut.slice(-1);

  // Combina la parte numérica del RUT con el dígito verificador y guión
  return rutPart + "-" + verificador;
};
