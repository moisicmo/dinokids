import { TypeAction } from "@/models/enums"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTypeAction(action: TypeAction){
  return TypeAction[action as unknown as keyof typeof TypeAction];
}

// El backend guarda TypeAction en inglés (create, read, update, delete, manage)
// pero el enum del frontend usa esos mismos nombres como key y el label en
// español ("Crear", "Leer"...) como value (para mostrarlo en UI). Cualquier
// endpoint que reciba una acción como query/body debe mandar la key en inglés,
// no el value en español.
export function toBackendAction(action: TypeAction): string {
  return (Object.keys(TypeAction) as (keyof typeof TypeAction)[])
    .find((key) => TypeAction[key] === action) ?? action;
}