import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Gera uma senha aleatória com o número de dígitos especificado
export function gerarSenhaAleatoria(min: number, max: number): string {
  // Determina o número de dígitos aleatoriamente entre min e max
  const numDigitos = Math.floor(Math.random() * (max - min + 1)) + min

  // Gera cada dígito e concatena
  let senha = ""
  for (let i = 0; i < numDigitos; i++) {
    senha += Math.floor(Math.random() * 10)
  }

  return senha
}

// Formata uma data ISO para o formato brasileiro
export function formatarData(dataISO: string): string {
  return new Date(dataISO).toLocaleDateString("pt-BR")
}

// Formata uma data ISO para exibir apenas a hora
export function formatarHora(dataISO: string): string {
  return new Date(dataISO).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

