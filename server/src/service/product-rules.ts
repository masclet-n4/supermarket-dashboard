export const isHistoricalMinimum = (
  currentReferencePrice: number | null,
  minimumReferencePrice: number | null,
  maximumReferencePrice: number | null,
): boolean | null =>
  currentReferencePrice == null || minimumReferencePrice == null || maximumReferencePrice == null
    ? null
    : minimumReferencePrice < maximumReferencePrice && currentReferencePrice === minimumReferencePrice
