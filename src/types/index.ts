export type StudyStatus = 'Planning' | 'Ethics Pending' | 'CTRI Pending' | 'Site Activation' | 'Recruiting' | 'Active' | 'At Risk' | 'Completed' | 'Delayed'
export type StudyRisk = 'Low' | 'Moderate' | 'High'
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low'
export type MonitoringStatus = 'Scheduled' | 'Completed' | 'Overdue' | 'Cancelled'
export type SiteStatus = 'Active' | 'Recruiting' | 'At Risk' | 'Monitoring Due'
export type RoleName = 'PI' | 'Coordinator' | 'Monitor' | 'Ethics' | 'Pharmacovigilance' | 'Data Manager' | 'Admin' | 'Regulator'
export type HealthIndicator = 'Healthy' | 'Watch' | 'Critical'

export interface Study {
  id: string
  title: string
  type: string
  phase: string
  principalInvestigator: string
  sites: number
  targetEnrollment: number
  currentEnrollment: number
  status: StudyStatus
  risk: StudyRisk
  nextMilestone: string
  enrollmentTrend: { date: string; actual: number; target: number }[]
  progress: number
  protocolDeviation: number
  openQueries: number
  safetyEvents: number
  siteCount: number
  participantCount: number
  statusSummary: {
    recruitment: HealthIndicator
    compliance: HealthIndicator
    dataQuality: HealthIndicator
    safety: HealthIndicator
    monitoring: HealthIndicator
  }
}

export interface Site {
  id: string
  name: string
  investigator: string
  location: string
  status: SiteStatus
  target: number
  enrolled: number
  enrollmentPercent: number
  lastMonitoring: string
  nextMonitoring: string
  risk: StudyRisk
  trialId: string
  trialTitle: string
}

export interface AlertItem {
  id: string
  severity: AlertSeverity
  study: string
  site: string
  description: string
  dueDate: string
  owner: string
  action: string
  acknowledged: boolean
}

export interface Milestone {
  id: string
  name: string
  plannedDate: string
  actualDate?: string
  variance: string
  status: 'Completed' | 'On Track' | 'At Risk' | 'Delayed'
  phase: string
}

export interface MonitoringRecord {
  id: string
  study: string
  site: string
  monitor: string
  visitType: string
  plannedDate: string
  actualDate?: string
  findings: number
  status: MonitoringStatus
}

export interface EnrollmentMetric {
  label: string
  actual: number
  target: number
  completion: number
  velocity: number
  screened: number
  randomized: number
  screeningToEnrollment: number
}

export interface AppUser {
  id: string
  name: string
  role: RoleName
  permissions: string[]
}

export interface SearchResult {
  category: string
  label: string
  path: string
  meta: string
}

export interface GlobalFilterState {
  studyId: string
  siteId: string
  status: string[]
  risk: string[]
  severity: string[]
  search: string
  dateRange: string
  module: string
}

export type ParticipantStatus = 'Screened' | 'Enrolled' | 'Randomized' | 'Active' | 'Completed' | 'Withdrawn'
export type VisitStatus = 'Scheduled' | 'Completed' | 'Overdue' | 'Missed' | 'Rescheduled' | 'Cancelled'
export type DeviationSeverity = 'Minor' | 'Major' | 'Critical'
export type DeviationCategory =
  | 'Eligibility'
  | 'Informed Consent'
  | 'Visit Window'
  | 'Investigational Product'
  | 'Protocol Procedure'
  | 'Safety Reporting'
  | 'Data Entry'
  | 'Randomization'
  | 'Other'
export type DeviationStatus = 'Open' | 'Under Review' | 'CAPA Required' | 'Resolved' | 'Closed'
export type QuerySeverity = 'Low' | 'Medium' | 'High' | 'Critical'
export type QueryStatus = 'Open' | 'Assigned' | 'Responded' | 'Resolved' | 'Closed'
export type CAPAStatus = 'Open' | 'In Progress' | 'Overdue' | 'Completed' | 'Verified'
export type SiteRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Participant {
  id: string
  studyId: string
  siteId: string
  siteName: string
  screeningDate: string
  enrollmentDate?: string
  randomizationDate?: string
  currentVisit: string
  visitStatus: VisitStatus
  protocolDeviations: number
  safetyEvents: number
  status: ParticipantStatus
  ageGroup: string
  gender: string
  cohort: string
  dataCompleteness: number
  timeline: { label: string; date: string; complete: boolean }[]
}

export interface VisitRecord {
  id: string
  studyId: string
  studyTitle: string
  participantId: string
  participantName: string
  siteId: string
  siteName: string
  visitType: string
  scheduledDate: string
  actualDate?: string
  visitWindow: string
  status: VisitStatus
  owner: string
  notes: string
  protocolDeviations: number
  dataQueries: number
}

export interface CAPA {
  id: string
  deviationId: string
  action: string
  owner: string
  dueDate: string
  status: CAPAStatus
  completionDate?: string
  verification: string
}

export interface ProtocolDeviation {
  id: string
  studyId: string
  siteId: string
  participantId: string
  category: DeviationCategory
  severity: DeviationSeverity
  detectedDate: string
  description: string
  capaRequired: boolean
  owner: string
  status: DeviationStatus
  rootCause: string
  correctiveAction: string
  preventiveAction: string
  dueDate?: string
}

export interface DataQuery {
  id: string
  studyId: string
  siteId: string
  participantId: string
  dataPoint: string
  issue: string
  severity: QuerySeverity
  raisedDate: string
  dueDate: string
  owner: string
  status: QueryStatus
  response?: string
  resolution?: string
}

export interface MonitoringFinding {
  id: string
  studyId: string
  siteId: string
  monitor: string
  visitType: string
  plannedDate: string
  actualDate?: string
  findings: number
  criticalFindings: number
  capaStatus: string
  status: VisitStatus
  siteRisk: SiteRiskLevel
  summary: string
}

export interface QualityMetric {
  label: string
  value: number
  tone: 'green' | 'blue' | 'amber' | 'red'
  description: string
}

export type AdverseEventSeverity = 'Mild' | 'Moderate' | 'Severe'
export type AdverseEventSeriousness = 'Non-serious' | 'Serious'
export type AdverseEventRelatedness = 'Not Related' | 'Unlikely' | 'Possible' | 'Probable' | 'Definite'
export type AdverseEventOutcome = 'Recovered' | 'Recovering' | 'Not Recovered' | 'Recovered with Sequelae' | 'Fatal' | 'Unknown'
export type AdverseEventStatus = 'Reported' | 'Under Review' | 'Follow-up Required' | 'Medically Reviewed' | 'Closed'
export type SafetyFollowUpStatus = 'Pending' | 'In Progress' | 'Received' | 'Overdue' | 'Closed'
export type SafetySignalStatus = 'Detected' | 'Under Review' | 'Confirmed' | 'Refuted' | 'Monitoring' | 'Closed'
export type DsmbMeetingStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled'
export type DsmbDecisionType = 'Continue Study' | 'Request Additional Safety Review' | 'Request Protocol Review' | 'Increase Monitoring' | 'Pause Recruitment' | 'Other'
export type SafetyNotificationType = 'SAE' | 'Follow-up' | 'Signal' | 'DSMB' | 'Review'

export interface AuditEntry {
  id: string
  actor: string
  action: string
  entity: string
  previousValue?: string
  newValue?: string
  timestamp: string
  reason?: string
}

export interface SafetyAssessment {
  severity: AdverseEventSeverity
  seriousness: AdverseEventSeriousness
  expectedness: 'Expected' | 'Unexpected' | 'Unknown'
  causality: AdverseEventRelatedness
  outcome: AdverseEventOutcome
  actionTaken: string
  dechallenge: 'Not Applicable' | 'Yes' | 'No' | 'Unknown'
  rechallenge: 'Not Applicable' | 'Yes' | 'No' | 'Unknown'
  medicalReview: string
  investigatorAssessment: string
}

export interface AdverseEvent {
  id: string
  participantId: string
  participantName: string
  studyId: string
  studyTitle: string
  siteId: string
  siteName: string
  visitId: string
  eventTerm: string
  description: string
  onsetDate: string
  resolutionDate?: string
  severity: AdverseEventSeverity
  seriousness: AdverseEventSeriousness
  relatedness: AdverseEventRelatedness
  outcome: AdverseEventOutcome
  status: AdverseEventStatus
  assignedTo: string
  reporter: string
  actionTaken: string
  treatmentProvided: string
  followUpRequired: boolean
  followUpDueDate?: string
  lastUpdated: string
  auditTrail: AuditEntry[]
  assessment?: SafetyAssessment
}

export interface SafetyFollowUp {
  id: string
  eventId: string
  requestedDate: string
  dueDate: string
  requestedBy: string
  assignedTo: string
  status: SafetyFollowUpStatus
  responseDate?: string
  notes: string
}

export interface SafetySignal {
  id: string
  signalTerm: string
  studyId: string
  studyTitle: string
  detectedFrom: string
  eventCount: number
  observedPattern: string
  status: SafetySignalStatus
  detectionDate: string
  reviewer: string
  reviewStatus: 'Pending' | 'In Progress' | 'Completed'
  lastUpdated: string
  affectedStudies: string[]
  affectedSites: string[]
  evidence: string
  auditTrail: AuditEntry[]
}

export interface DSMBDecision {
  id: string
  meetingId: string
  decision: DsmbDecisionType
  rationale: string
  date: string
  recordedBy: string
}

export interface DSMBMeeting {
  id: string
  studyId: string
  studyTitle: string
  meetingDate: string
  meetingType: string
  chair: string
  members: string[]
  agenda: string[]
  status: DsmbMeetingStatus
  outcome?: string
  decisions: DSMBDecision[]
}

export interface SafetyNotification {
  id: string
  type: SafetyNotificationType
  title: string
  description: string
  timestamp: string
  study: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  path: string
  read?: boolean
  category: 'Safety Review' | 'SAE' | 'Follow-up' | 'Signal' | 'DSMB'
}

export interface SafetySummary {
  totalAEs: number
  openAEs: number
  seriousAEs: number
  openReviews: number
  adrCount: number
  eventsThisMonth: number
  openFollowUps: number
  pendingMedicalReview: number
}

export interface CDISCDataset {
  id: string
  datasetName: string
  studyId: string
  standard: 'CDASH' | 'SDTM' | 'ADaM'
  domain: string
  version: string
  records: number
  variables: number
  mappedVariables: number
  unmappedVariables: number
  mappingStatus: 'Mapped' | 'Needs Review' | 'Draft' | 'Validated'
  validationStatus: 'Validated' | 'Needs Review' | 'Open'
  lastUpdated: string
  owner: string
  description: string
  status: string
}

export interface CDISCVariable {
  id: string
  datasetId: string
  variableName: string
  label: string
  dataType: string
  length: number
  sourceField: string
  standard: 'CDASH' | 'SDTM' | 'ADaM'
  domain: string
  required: boolean
  controlledTerminology: string
  mappingStatus: 'Mapped' | 'Needs Review' | 'Draft' | 'Validated'
  validationStatus: 'Validated' | 'Needs Review' | 'Open'
  owner: string
  targetDomain: string
  targetVariable: string
  mappingRule: string
  transformation: 'Direct' | 'Derived' | 'Lookup' | 'Calculated'
}

export interface MappingDefinition {
  id: string
  sourceDataset: string
  sourceVariable: string
  targetStandard: 'CDASH' | 'SDTM' | 'ADaM'
  targetDomain: string
  targetVariable: string
  mappingType: 'Direct' | 'Derived' | 'Lookup' | 'Calculated'
  transformationRule: string
  description: string
  owner: string
  status: 'Mapped' | 'Needs Review' | 'Draft' | 'Validated'
  lastUpdated: string
}

export interface ControlTerm {
  code: string
  term: string
  definition: string
  standard: string
  version: string
  status: 'Configured' | 'Under Review'
  usedBy: string
  lastUpdated: string
}

export interface ValidationFinding {
  id: string
  dataset: string
  domain: string
  variable: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  rule: string
  description: string
  status: 'Open' | 'Investigating' | 'Resolved'
  assignedTo: string
  detectedAt: string
  observedValue: string
  expectedValue: string
}

export interface ExportJob {
  id: string
  name: string
  type: 'SDTM' | 'ADaM' | 'Define-XML'
  status: 'Completed' | 'Generating' | 'Ready'
  createdAt: string
  owner: string
  size: string
}

export interface SdtmDomain {
  id: string
  name: string
  description: string
  recordCount: number
  variables: number
  completion: number
  status: 'Validated' | 'Mapped' | 'Needs Review'
  domain: string
}

export interface ADaMDataset {
  id: string
  datasetName: string
  description: string
  records: number
  variables: number
  status: 'Mapped' | 'Draft' | 'In Progress'
  sourceSdtm: string[]
  validation: 'Validated' | 'Needs Review' | 'Open'
}

export interface CDASHForm {
  id: string
  formName: string
  fields: number
  requiredFields: number
  sourceVariables: number
  mappingStatus: 'Mapped' | 'Validated' | 'Needs Review'
  standard: 'CDASH'
  owner: string
}

export interface DefineXmlMetadata {
  study: string
  version: string
  status: 'In Progress' | 'Ready' | 'Validated'
  datasets: string[]
  codelists: string[]
  methods: string[]
  lastUpdated: string
}

export interface CDISCActivity {
  id: string
  action: string
  entity: string
  timestamp: string
  actor: string
}

export type FhirResourceType = 'Patient' | 'Observation' | 'Condition' | 'Encounter' | 'Consent' | 'ResearchStudy' | 'ResearchSubject' | 'Bundle' | 'Practitioner' | 'MedicationStatement'
export type FhirValidationStatus = 'Validated' | 'Needs Review' | 'Warning' | 'Failed'
export type FhirExchangeStatus = 'Queued' | 'Delivered' | 'Failed' | 'Synced'
export type FhirMappingStatus = 'Draft' | 'Mapped' | 'Validated' | 'Needs Review' | 'Rejected'

export interface FHIRResource {
  id: string
  resourceType: FhirResourceType
  profile: string
  title: string
  studyId: string
  participantId?: string
  status: 'Active' | 'Draft' | 'Validated' | 'Needs Review' | 'Synced'
  sourceEntity: string
  lastUpdated: string
  version: string
  sourceSystem: string
  sourceDisplay: string
  content: Record<string, unknown>
  validationStatus: FhirValidationStatus
  exchangeStatus: FhirExchangeStatus
  auditTrail: { id: string; actor: string; action: string; timestamp: string; summary?: string }[]
}

export interface FHIRMapping {
  id: string
  sourceField: string
  targetField: string
  sourceSystem: string
  targetSystem: string
  transformation: string
  mappingType: 'Direct' | 'Derived' | 'Lookup' | 'CodeMap'
  status: FhirMappingStatus
  owner: string
  lastUpdated: string
}

export interface FHIRValidationFinding {
  id: string
  resourceId: string
  title: string
  severity: 'Info' | 'Warning' | 'Error'
  rule: string
  message: string
  status: FhirValidationStatus
  lastUpdated: string
}

export interface FHIRBundle {
  id: string
  bundleType: 'document' | 'message' | 'collection'
  studyId: string
  label: string
  resourceCount: number
  status: 'Draft' | 'Ready' | 'Delivered' | 'Needs Review'
  createdAt: string
  createdBy: string
  resourceIds: string[]
}

export interface FHIRExchangeLog {
  id: string
  bundleId: string
  endpoint: string
  method: 'POST' | 'PUT' | 'PATCH'
  status: 'Success' | 'Failed' | 'Queued'
  correlationId: string
  message: string
  timestamp: string
}

export interface ABDMReadinessStep {
  id: string
  label: string
  status: 'Ready' | 'In progress' | 'Needs attention'
  detail: string
}

export interface ABDMReadiness {
  interoperability: string
  consentCoverage: number
  patientMatchRate: number
  terminologyCoverage: number
  steps: ABDMReadinessStep[]
}
