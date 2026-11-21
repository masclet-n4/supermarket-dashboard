import { expect, test } from 'bun:test'
import { getHistoryStartDate } from '../get-product-details'

test('builds a date-only cutoff for a history period', () => {
  const today = new Date('2026-11-04T12:00:00.000Z')

  expect(getHistoryStartDate('30', today)).toBe('2026-10-05')
  expect(getHistoryStartDate('all', today)).toBeNull()
})
