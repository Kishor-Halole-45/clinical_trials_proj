import type { CAPA, DataQuery, MonitoringFinding, Participant, ProtocolDeviation, VisitRecord } from '../types'

const studyMeta = [
  { studyId: 'AIIA-AYU-001', studyTitle: 'Ayurvedic Management in Mild to Moderate Rheumatoid Arthritis', prefix: 'A001', siteIds: ['SITE-001', 'SITE-002', 'SITE-012', 'SITE-024'] },
  { studyId: 'AIIA-AYU-002', studyTitle: 'Herbal Formulation for Chronic Fatigue and Sleep Quality', prefix: 'A002', siteIds: ['SITE-006', 'SITE-015', 'SITE-022'] },
  { studyId: 'AIIA-AYU-003', studyTitle: 'Ksheerabala Therapy in Post-Stroke Motor Recovery', prefix: 'A003', siteIds: ['SITE-003', 'SITE-005', 'SITE-010', 'SITE-025'] },
  { studyId: 'AIIA-AYU-004', studyTitle: 'Aswagandha Extract and Glycemic Control in Prediabetes', prefix: 'A004', siteIds: ['SITE-004', 'SITE-017', 'SITE-030'] },
  { studyId: 'AIIA-AYU-005', studyTitle: 'Brahmi for Cognitive Function in Geriatric Cohort', prefix: 'A005', siteIds: ['SITE-007', 'SITE-019', 'SITE-026'] },
  { studyId: 'AIIA-AYU-006', studyTitle: 'Panchatikta Therapy in Chronic Ulcerative Colitis', prefix: 'A006', siteIds: ['SITE-013', 'SITE-014', 'SITE-028'] },
  { studyId: 'AIIA-AYU-007', studyTitle: 'Amla and Shatavari in Women’s Reproductive Health', prefix: 'A007', siteIds: ['SITE-008', 'SITE-016', 'SITE-029'] },
  { studyId: 'AIIA-AYU-009', studyTitle: 'Guduchi in Immune Modulation in Long COVID Recovery', prefix: 'A009', siteIds: ['SITE-009', 'SITE-020', 'SITE-027'] },
  { studyId: 'AIIA-AYU-010', studyTitle: 'Mulethi for Chronic Cough and Pulmonary Recovery', prefix: 'A010', siteIds: ['SITE-011', 'SITE-018'] },
]

const siteNameMap: Record<string, string> = {
  'SITE-001': 'AIIA Research Center, New Delhi',
  'SITE-002': 'Bhopal Ayurvedic Institute',
  'SITE-003': 'NIA Jaipur Clinical Unit',
  'SITE-004': 'Karnataka Ayurveda Hospital',
  'SITE-005': 'Maharashtra Integrative Care Centre',
  'SITE-006': 'Kerala Research Clinic',
  'SITE-007': 'Assam Ayurvedic Treatment Hub',
  'SITE-008': 'Tamil Nadu Clinical Trials Unit',
  'SITE-009': 'Hyderabad Integrative Medicine Center',
  'SITE-010': 'Lucknow Ayurveda Research Hospital',
  'SITE-011': 'Nagpur Study Network',
  'SITE-012': 'Visakhapatnam Clinical Research Center',
  'SITE-013': 'Ahmedabad Primacy Care Clinic',
  'SITE-014': 'Patna Research Hub',
  'SITE-015': 'Cuttack Ethno-Medicine Unit',
  'SITE-016': 'Coimbatore Clinical Observatory',
  'SITE-017': 'Gorakhpur Ayurveda Centre',
  'SITE-018': 'Bhubaneswar Trial Network',
  'SITE-019': 'Indore Clinical Research Centre',
  'SITE-020': 'Jodhpur Integrative Medicine Hub',
  'SITE-021': 'Shillong Honorary Clinical Unit',
  'SITE-022': 'Trivandrum Wellness Research Lab',
  'SITE-023': 'Raipur Integrative Health Centre',
  'SITE-024': 'Agra Research Satellite Unit',
  'SITE-025': 'Kolkata Center for Traditional Medicine',
  'SITE-026': 'Vijayawada Ayurveda Hospital',
  'SITE-027': 'Noida Clinical Trial Centre',
  'SITE-028': 'Pune Clinical Research Facility',
  'SITE-029': 'Udaipur Traditional Medicine Center',
  'SITE-030': 'Surat Integrative Care Unit',
}

const visitTemplates = ['Screening', 'Baseline', 'Week 4', 'Week 8', 'Week 12', 'Follow-up']
const participantStatuses: Participant['status'][] = ['Screened', 'Enrolled', 'Randomized', 'Active', 'Completed', 'Withdrawn']
const deviationCategories: ProtocolDeviation['category'][] = ['Eligibility', 'Informed Consent', 'Visit Window', 'Investigational Product', 'Protocol Procedure', 'Safety Reporting', 'Data Entry', 'Randomization', 'Other']
const querySeverities: DataQuery['severity'][] = ['Low', 'Medium', 'High', 'Critical']
const queryStatuses: DataQuery['status'][] = ['Open', 'Assigned', 'Responded', 'Resolved', 'Closed']

export const participants: Participant[] = Array.from({ length: 128 }, (_, index) => {
  const study = studyMeta[index % studyMeta.length]
  const siteId = study.siteIds[index % study.siteIds.length]
  const participantNumber = index + 1
  const status = participantStatuses[index % participantStatuses.length]
  const timeline = [
    { label: 'Screening', date: `2026-01-${String((index % 24) + 1).padStart(2, '0')}`, complete: true },
    { label: 'Eligible', date: `2026-01-${String((index % 18) + 10).padStart(2, '0')}`, complete: true },
    { label: 'Enrolled', date: `2026-02-${String((index % 20) + 6).padStart(2, '0')}`, complete: status !== 'Screened' },
    { label: 'Randomized', date: `2026-02-${String((index % 25) + 12).padStart(2, '0')}`, complete: status === 'Randomized' || status === 'Active' || status === 'Completed' },
    { label: 'Baseline', date: `2026-03-${String((index % 17) + 5).padStart(2, '0')}`, complete: status !== 'Screened' && status !== 'Enrolled' },
    { label: 'Week 4', date: `2026-04-${String((index % 22) + 5).padStart(2, '0')}`, complete: status === 'Completed' || status === 'Active' },
    { label: 'Week 8', date: `2026-05-${String((index % 18) + 10).padStart(2, '0')}`, complete: status === 'Completed' },
    { label: 'Week 12', date: `2026-06-${String((index % 20) + 6).padStart(2, '0')}`, complete: status === 'Completed' },
    { label: 'Follow-up', date: `2026-07-${String((index % 18) + 8).padStart(2, '0')}`, complete: status === 'Completed' },
  ]

  return {
    id: `PT-${study.prefix}-${String(participantNumber).padStart(4, '0')}`,
    studyId: study.studyId,
    siteId,
    siteName: siteNameMap[siteId],
    screeningDate: `2026-0${(index % 8) + 1}-0${(index % 15) + 1}`.replace(/-0(\d)$/, '-0$1'),
    enrollmentDate: status === 'Withdrawn' ? undefined : `2026-0${(index % 8) + 2}-0${(index % 12) + 2}`.replace(/-0(\d)$/, '-0$1'),
    randomizationDate: status === 'Screened' || status === 'Enrolled' ? undefined : `2026-0${(index % 8) + 2}-0${(index % 15) + 3}`.replace(/-0(\d)$/, '-0$1'),
    currentVisit: visitTemplates[index % visitTemplates.length],
    visitStatus: status === 'Completed' ? 'Completed' : index % 5 === 0 ? 'Overdue' : 'Scheduled',
    protocolDeviations: (index % 4) + 1,
    safetyEvents: index % 5 === 0 ? 1 : 0,
    status,
    ageGroup: ['18-35', '36-50', '51-65', '65+'][index % 4],
    gender: ['Female', 'Male', 'Undisclosed'][index % 3],
    cohort: ['Cohort A', 'Cohort B', 'Cohort C'][index % 3],
    dataCompleteness: 88 + (index % 11),
    timeline,
  }
})

export const visits: VisitRecord[] = Array.from({ length: 180 }, (_, index) => {
  const participant = participants[index % participants.length]
  const study = studyMeta.find((entry) => entry.studyId === participant.studyId) ?? studyMeta[0]
  const visitType = visitTemplates[index % visitTemplates.length]
  const scheduledDate = `2026-09-${String((index % 25) + 1).padStart(2, '0')}`
  const actualDate = index % 4 === 0 ? undefined : `2026-09-${String((index % 23) + 2).padStart(2, '0')}`

  return {
    id: `VIS-${String(index + 1).padStart(4, '0')}`,
    studyId: participant.studyId,
    studyTitle: study.studyTitle,
    participantId: participant.id,
    participantName: `Participant ${participant.id.split('-').at(-1)}`,
    siteId: participant.siteId,
    siteName: participant.siteName,
    visitType,
    scheduledDate,
    actualDate,
    visitWindow: index % 3 === 0 ? 'Early' : index % 3 === 1 ? 'On Time' : 'Late',
    status: index % 7 === 0 ? 'Overdue' : index % 5 === 0 ? 'Completed' : index % 6 === 0 ? 'Missed' : 'Scheduled',
    owner: ['A. Pillai', 'R. Iyer', 'S. Nair', 'K. Das'][index % 4],
    notes: index % 2 === 0 ? 'Review completed with site coordinator.' : 'Documentation pending for source verification.',
    protocolDeviations: index % 3,
    dataQueries: (index % 4) + 1,
  }
})

export const deviations: ProtocolDeviation[] = Array.from({ length: 42 }, (_, index) => {
  const participant = participants[index % participants.length]
  const category = deviationCategories[index % deviationCategories.length]
  const severity: ProtocolDeviation['severity'] = index % 8 === 0 ? 'Critical' : index % 4 === 0 ? 'Major' : 'Minor'
  const status: ProtocolDeviation['status'] = index % 7 === 0 ? 'Resolved' : index % 6 === 0 ? 'Closed' : index % 5 === 0 ? 'CAPA Required' : 'Under Review'

  return {
    id: `DEV-${String(index + 1).padStart(4, '0')}`,
    studyId: participant.studyId,
    siteId: participant.siteId,
    participantId: participant.id,
    category,
    severity,
    detectedDate: `2026-08-${String((index % 22) + 5).padStart(2, '0')}`,
    description: `${category} issue identified during routine operational review for the participant schedule and source documentation.`,
    capaRequired: index % 3 !== 0,
    owner: ['A. Pillai', 'S. Khanna', 'R. Iyer', 'N. Verma'][index % 4],
    status,
    rootCause: 'Operational workflow gap at site level with delayed source verification and inconsistent documentation capture.',
    correctiveAction: 'Site-level review and re-training of study procedures and escalation workflow.',
    preventiveAction: 'Monthly compliance review with checklist-driven completion tracking and CAPA verification.',
    dueDate: `2026-09-${String((index % 20) + 10).padStart(2, '0')}`,
  }
})

export const capAs: CAPA[] = Array.from({ length: 26 }, (_, index) => {
  const deviation = deviations[index % deviations.length]
  return {
    id: `CAPA-${String(index + 1).padStart(4, '0')}`,
    deviationId: deviation.id,
    action: index % 2 === 0 ? 'Re-train site staff on protocol-specific procedure documentation.' : 'Escalate and verify informed consent completeness with delegated monitors.',
    owner: ['A. Pillai', 'R. Iyer', 'S. Khanna', 'N. Verma'][index % 4],
    dueDate: `2026-09-${String((index % 18) + 12).padStart(2, '0')}`,
    status: index % 5 === 0 ? 'Completed' : index % 4 === 0 ? 'Overdue' : 'In Progress',
    completionDate: index % 5 === 0 ? `2026-09-${String((index % 16) + 8).padStart(2, '0')}` : undefined,
    verification: index % 5 === 0 ? 'Verified by monitor and site manager.' : 'Pending verification and site sign-off.',
  }
})

export const dataQueries: DataQuery[] = Array.from({ length: 110 }, (_, index) => {
  const participant = participants[index % participants.length]
  const severity: DataQuery['severity'] = querySeverities[index % querySeverities.length]
  const status: DataQuery['status'] = queryStatuses[index % queryStatuses.length]

  return {
    id: `QRY-${String(index + 1).padStart(4, '0')}`,
    studyId: participant.studyId,
    siteId: participant.siteId,
    participantId: participant.id,
    dataPoint: ['Vital signs', 'Medication adherence', 'ECG values', 'Laboratory results', 'Dosing timestamp', 'Visit completion'][index % 6],
    issue: 'Source documentation does not reconcile with EDC entry for the selected visit window and required data elements.',
    severity,
    raisedDate: `2026-08-${String((index % 21) + 6).padStart(2, '0')}`,
    dueDate: `2026-09-${String((index % 16) + 12).padStart(2, '0')}`,
    owner: ['A. Pillai', 'R. Iyer', 'S. Khanna', 'D. Shah'][index % 4],
    status,
    response: status === 'Resolved' || status === 'Closed' ? 'Response received and reconciliation completed with site documentation.' : 'Awaiting site clarification and supporting source review.',
    resolution: status === 'Resolved' || status === 'Closed' ? 'EDC value corrected and source verification uploaded.' : undefined,
  }
})

export const monitoringFindings: MonitoringFinding[] = Array.from({ length: 52 }, (_, index) => {
  const participant = participants[index % participants.length]
  const findingStatus: MonitoringFinding['status'] = index % 6 === 0 ? 'Completed' : index % 5 === 0 ? 'Overdue' : 'Scheduled'
  const siteRisk: MonitoringFinding['siteRisk'] = ['Low', 'Medium', 'High', 'Critical'][index % 4] as MonitoringFinding['siteRisk']

  return {
    id: `MF-${String(index + 1).padStart(4, '0')}`,
    studyId: participant.studyId,
    siteId: participant.siteId,
    monitor: ['R. Iyer', 'K. Das', 'A. Rao', 'N. Shah'][index % 4],
    visitType: ['Routine', 'Safety', 'Remote review', 'Data review', 'Site assessment'][index % 5],
    plannedDate: `2026-09-${String((index % 20) + 10).padStart(2, '0')}`,
    actualDate: index % 3 === 0 ? `2026-09-${String((index % 18) + 11).padStart(2, '0')}` : undefined,
    findings: (index % 6) + 1,
    criticalFindings: index % 4 === 0 ? 1 : 0,
    capaStatus: index % 2 === 0 ? 'Open' : 'In Progress',
    status: findingStatus,
    siteRisk,
    summary: 'Monitoring review identified workflow issues, delayed follow-up actions and incomplete reconciliations requiring targeted intervention.',
  }
})

export const qualityMetrics = [
  { label: 'Completeness', value: 96.4, tone: 'green', description: 'EDC coverage and source reconciliation is stable across active studies.' },
  { label: 'Accuracy', value: 94.1, tone: 'blue', description: 'Validation checks are in range with minor documentation discrepancies.' },
  { label: 'Consistency', value: 93.8, tone: 'amber', description: 'Core data fields remain aligned with site-specific monitoring feedback.' },
  { label: 'Timeliness', value: 95.6, tone: 'green', description: 'Query closures and update cycles remain within target turnaround.' },
] as const
