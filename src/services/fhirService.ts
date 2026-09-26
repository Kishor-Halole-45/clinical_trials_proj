import {
  defaultABDMReadiness,
  defaultFHIRBundles,
  defaultFHIRExchangeLogs,
  defaultFHIRMappings,
  defaultFHIRResources,
  defaultFHIRValidationFindings,
} from '../data/fhir'
import type { FHIRBundle, FHIRExchangeLog, FHIRMapping, FHIRResource, FHIRValidationFinding } from '../types'

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const resourceStore: FHIRResource[] = clone(defaultFHIRResources)
const mappingStore: FHIRMapping[] = clone(defaultFHIRMappings)
const validationStore: FHIRValidationFinding[] = clone(defaultFHIRValidationFindings)
const bundleStore: FHIRBundle[] = clone(defaultFHIRBundles)
const exchangeLogStore: FHIRExchangeLog[] = clone(defaultFHIRExchangeLogs)

export const fhirService = {
  getResources: () => clone(resourceStore),
  getResourceById: (resourceId: string) => resourceStore.find((resource) => resource.id === resourceId) ?? null,
  getMappings: () => clone(mappingStore),
  createMapping: (input: Omit<FHIRMapping, 'id' | 'lastUpdated'> & { id?: string }) => {
    const created: FHIRMapping = {
      ...input,
      id: input.id ?? `FHIR-MAP-${String(mappingStore.length + 1).padStart(3, '0')}`,
      lastUpdated: new Date().toISOString().slice(0, 10),
    }
    mappingStore.unshift(created)
    return clone(created)
  },
  updateMappingStatus: (mappingId: string, status: FHIRMapping['status']) => {
    const mapping = mappingStore.find((item) => item.id === mappingId)
    if (!mapping) return null
    mapping.status = status
    mapping.lastUpdated = new Date().toISOString().slice(0, 10)
    return clone(mapping)
  },
  getValidationFindings: () => clone(validationStore),
  runValidation: () => {
    validationStore.forEach((finding) => {
      if (finding.status === 'Needs Review') {
        finding.status = 'Warning'
      } else if (finding.status === 'Warning') {
        finding.status = 'Validated'
      }
      finding.lastUpdated = new Date().toISOString().slice(0, 10)
    })
    return clone(validationStore)
  },
  resolveFinding: (findingId: string) => {
    const finding = validationStore.find((item) => item.id === findingId)
    if (!finding) return null
    finding.status = 'Validated'
    finding.lastUpdated = new Date().toISOString().slice(0, 10)
    return clone(finding)
  },
  getBundles: () => clone(bundleStore),
  getBundleById: (bundleId: string) => bundleStore.find((bundle) => bundle.id === bundleId) ?? null,
  createBundle: (studyId: string, label: string, resourceIds: string[]) => {
    const created: FHIRBundle = {
      id: `BUNDLE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(bundleStore.length + 1).padStart(3, '0')}`,
      bundleType: 'collection',
      studyId,
      label,
      resourceCount: resourceIds.length,
      status: 'Ready',
      createdAt: new Date().toISOString(),
      createdBy: 'Data Manager',
      resourceIds,
    }
    bundleStore.unshift(created)
    return clone(created)
  },
  simulateExchange: (bundleId: string, endpoint: string, method: FHIRExchangeLog['method'] = 'POST') => {
    const bundle = bundleStore.find((item) => item.id === bundleId)
    if (!bundle) return null
    bundle.status = 'Delivered'
    const log: FHIRExchangeLog = {
      id: `FHIR-LOG-${String(exchangeLogStore.length + 1).padStart(3, '0')}`,
      bundleId,
      endpoint,
      method,
      status: 'Success',
      correlationId: `CORR-${Date.now().toString().slice(-6)}`,
      message: 'Synthetic exchange succeeded and was queued to the downstream ABDM gateway for validation.',
      timestamp: new Date().toISOString(),
    }
    exchangeLogStore.unshift(log)
    return clone(log)
  },
  getExchangeLogs: () => clone(exchangeLogStore),
  getABDMReadiness: () => clone(defaultABDMReadiness),
}
