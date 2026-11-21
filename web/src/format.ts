// Formato español: coma decimal, máximo 2 decimales. Vacío si no hay valor.
export const formatEs = (value: number | null | undefined): string =>
  value == null ? '' : value.toLocaleString('es-ES', { maximumFractionDigits: 2 })
