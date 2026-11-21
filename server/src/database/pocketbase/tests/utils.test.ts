import { expect, test } from 'bun:test'
import type { ProductTrendsCriteria } from '../../../service/types/product-trends'
import { getTrendSort, getTrendSortField } from '../utils'

const criteria = (overrides: Partial<ProductTrendsCriteria> = {}): ProductTrendsCriteria => ({
  period: '30',
  sortName: 'priceMovement',
  sortDirection: 'ASC',
  page: 1,
  ...overrides,
})

test('maps trend criteria to one PocketBase sort field and direction', () => {
  expect(getTrendSort(criteria())).toBe('price_diff_mean_d30')
  expect(getTrendSort(criteria({
    period: '7',
    metric: 'percent',
    sortDirection: 'DESC',
  }))).toBe('-price_diff_mean_pct_d7')
  expect(getTrendSort(criteria({
    period: '90',
    sortName: 'priceChanges',
    sortDirection: 'DESC',
  }))).toBe('-num_changes_d90')
})

test('maps the selected stat field for filtering missing values', () => {
  expect(getTrendSortField(criteria({ metric: 'percent' })))
    .toBe('price_diff_mean_pct_d30')
})
