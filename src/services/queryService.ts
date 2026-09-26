import { dataQueries } from '../data/phase2'
import type { DataQuery } from '../types'

export const queryService = {
  getQueries: (): DataQuery[] => dataQueries.map((query) => ({ ...query })),
  getQueryById: (queryId: string) => dataQueries.find((query) => query.id === queryId) ?? null,
  resolveQuery: (queryId: string, resolution: string) => {
    const index = dataQueries.findIndex((query) => query.id === queryId)
    if (index === -1) return null
    dataQueries[index] = {
      ...dataQueries[index],
      status: 'Resolved',
      resolution,
      response: 'Site response reviewed and accepted by data management.',
    }
    return dataQueries[index]
  },
}
