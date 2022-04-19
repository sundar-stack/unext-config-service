export interface QueryCriteria {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: { [s: string]: any },
  fields?: string[],
  sortOptions?: SortOption[],
  skip?: number
  limit?: number
}

export interface SortOption {
  sortKey: string,
  sortOrder: number
}
