import {
  adamsDatasets,
  cdiscActivities,
  cdiscDatasets,
  cdiscMappings,
  cdiscVariables,
  controlledTerminology,
  exportJobs,
  sdtmDomains,
  validationFindings,
} from '../data/cdisc'

export const getCdiscSummary = () => {
  const totalDatasets = cdiscDatasets.length
  const mapped = cdiscDatasets.filter((item) => item.mappingStatus === 'Mapped' || item.mappingStatus === 'Validated').length
  const openFindings = validationFindings.filter((item) => item.status !== 'Resolved').length
  const readyExports = exportJobs.filter((item) => item.status === 'Ready' || item.status === 'Completed').length

  return {
    totalDatasets,
    mapped,
    openFindings,
    readyExports,
  }
}

export const getDatasets = (standard?: string) => {
  if (!standard) return cdiscDatasets
  return cdiscDatasets.filter((dataset) => dataset.standard === standard)
}

export const getDatasetById = (id: string) => cdiscDatasets.find((dataset) => dataset.id === id) ?? cdiscDatasets[0]

export const getCdiscVariables = (datasetId: string) => cdiscVariables.filter((variable) => variable.datasetId === datasetId)

export const getMappings = () => cdiscMappings

export const getValidationSummary = () => ({
  total: validationFindings.length,
  critical: validationFindings.filter((item) => item.severity === 'Critical').length,
  high: validationFindings.filter((item) => item.severity === 'High').length,
  medium: validationFindings.filter((item) => item.severity === 'Medium').length,
})

export const getTerminology = () => controlledTerminology

export const getSdtmDomains = () => sdtmDomains

export const getAdamDatasets = () => adamsDatasets

export const getExportJobs = () => exportJobs

export const getActivities = () => cdiscActivities
