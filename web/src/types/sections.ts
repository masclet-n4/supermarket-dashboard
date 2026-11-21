   export const SECTIONS = {
     HOME: 'HOME',
     TRENDS: 'TRENDS',
     PRODUCTS: 'PRODUCTS',
   } as const

   export type Section = (typeof SECTIONS)[keyof typeof SECTIONS]
