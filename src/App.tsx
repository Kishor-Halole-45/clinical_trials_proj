import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Component, type ErrorInfo, type ReactNode } from 'react'

import { AppShell } from './layouts/AppShell'
import { AlertsPage } from './pages/AlertsPage'
import { ClinicalTrialsPage } from './pages/ClinicalTrialsPage'
import { CompliancePage } from './pages/CompliancePage'
import { ConsentDetailPage } from './pages/ConsentDetailPage'
import { ConsentPage } from './pages/ConsentPage'
import { ControlledTerminologyPage } from './pages/ControlledTerminologyPage'
import { CtriDetailPage } from './pages/CtriDetailPage'
import { CtriManagementPage } from './pages/CtriManagementPage'
import { DashboardPage } from './pages/DashboardPage'
import { DataMappingPage } from './pages/DataMappingPage'
import { DataQualityPage } from './pages/DataQualityPage'
import { DatasetDetailPage } from './pages/DatasetDetailPage'
import { DatasetsPage } from './pages/DatasetsPage'
import { DefineXmlPage } from './pages/DefineXmlPage'
import { CdiscPage } from './pages/CdiscPage'
import { DeviationDetailPage } from './pages/DeviationDetailPage'
import { DeviationsPage } from './pages/DeviationsPage'
import { DocumentDetailPage } from './pages/DocumentDetailPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { EthicsRegulatoryPage } from './pages/EthicsRegulatoryPage'
import { EthicsSubmissionDetailPage } from './pages/EthicsSubmissionDetailPage'
import { EnrollmentPage } from './pages/EnrollmentPage'
import { ExportCenterPage } from './pages/ExportCenterPage'
import { ExchangeLogsPage } from './pages/ExchangeLogsPage'
import { ExchangeSimulatorPage } from './pages/ExchangeSimulatorPage'
import { FhirBundleDetailPage } from './pages/FhirBundleDetailPage'
import { FhirBundlesPage } from './pages/FhirBundlesPage'
import { FhirMappingPage } from './pages/FhirMappingPage'
import { FhirResourceDetailPage } from './pages/FhirResourceDetailPage'
import { FhirResourcesPage } from './pages/FhirResourcesPage'
import { FhirValidationPage } from './pages/FhirValidationPage'
import { InteroperabilityApiPage } from './pages/InteroperabilityApiPage'
import { InteroperabilityPage } from './pages/InteroperabilityPage'
import { LoginPage } from './pages/LoginPage'
import { MilestonesPage } from './pages/MilestonesPage'
import { MonitoringPage } from './pages/MonitoringPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AbdmPage } from './pages/AbdmPage'
import { ParticipantDetailPage } from './pages/ParticipantDetailPage'
import { ParticipantsPage } from './pages/ParticipantsPage'
import { PharmacovigilancePage } from './pages/PharmacovigilancePage'
import { AdverseEventDetailPage } from './pages/AdverseEventDetailPage'
import { AdverseEventsPage } from './pages/AdverseEventsPage'
import { SafetySignalDetailPage } from './pages/SafetySignalDetailPage'
import { SafetySignalsPage } from './pages/SafetySignalsPage'
import { RegulatoryCalendarPage } from './pages/RegulatoryCalendarPage'
import { SaePage } from './pages/SaePage'
import { DsmbPage } from './pages/DsmbPage'
import { DsmbDetailPage } from './pages/DsmbDetailPage'
import { SitesPage } from './pages/SitesPage'
import { Trial360Page } from './pages/Trial360Page'
import { TrialDetailPage } from './pages/TrialDetailPage'
import { ValidationPage } from './pages/ValidationPage'
import { VisitsPage } from './pages/VisitsPage'
import { AuditTrailPage } from './pages/AuditTrailPage'
import { ReportsPage } from './pages/ReportsPage'
import { SystemHealthPage } from './pages/SystemHealthPage'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App error boundary caught a rendering error', error, errorInfo)
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-soft">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">System Error</div>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">The CTMS page could not be loaded. Please retry or return to the dashboard.</p>
            <button type="button" onClick={() => window.location.href = '/dashboard'} className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">Return to dashboard</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/trials" element={<ClinicalTrialsPage />} />
            <Route path="/trials/:trialId" element={<TrialDetailPage />} />
            <Route path="/trials/:trialId/360" element={<Trial360Page />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/sites/:siteId" element={<SitesPage />} />
            <Route path="/participants" element={<ParticipantsPage />} />
            <Route path="/participants/:participantId" element={<ParticipantDetailPage />} />
            <Route path="/visits" element={<VisitsPage />} />
            <Route path="/pharmacovigilance" element={<PharmacovigilancePage />} />
            <Route path="/adverse-events" element={<AdverseEventsPage />} />
            <Route path="/adverse-events/:eventId" element={<AdverseEventDetailPage />} />
            <Route path="/sae" element={<SaePage />} />
            <Route path="/safety-signals" element={<SafetySignalsPage />} />
            <Route path="/safety-signals/:signalId" element={<SafetySignalDetailPage />} />
            <Route path="/dsmb" element={<DsmbPage />} />
            <Route path="/dsmb/:meetingId" element={<DsmbDetailPage />} />
            <Route path="/deviations" element={<DeviationsPage />} />
            <Route path="/deviations/:deviationId" element={<DeviationDetailPage />} />
            <Route path="/data-quality" element={<DataQualityPage />} />
            <Route path="/interoperability" element={<InteroperabilityPage />} />
            <Route path="/fhir/resources" element={<FhirResourcesPage />} />
            <Route path="/fhir/resources/:resourceId" element={<FhirResourceDetailPage />} />
            <Route path="/fhir/mapping" element={<FhirMappingPage />} />
            <Route path="/fhir/validation" element={<FhirValidationPage />} />
            <Route path="/fhir/bundles" element={<FhirBundlesPage />} />
            <Route path="/fhir/bundles/:bundleId" element={<FhirBundleDetailPage />} />
            <Route path="/fhir/exchange" element={<ExchangeSimulatorPage />} />
            <Route path="/fhir/logs" element={<ExchangeLogsPage />} />
            <Route path="/fhir/api" element={<InteroperabilityApiPage />} />
            <Route path="/abdm" element={<AbdmPage />} />
            <Route path="/cdisc" element={<CdiscPage />} />
            <Route path="/datasets" element={<DatasetsPage />} />
            <Route path="/datasets/:datasetId" element={<DatasetDetailPage />} />
            <Route path="/data-mapping" element={<DataMappingPage />} />
            <Route path="/controlled-terminology" element={<ControlledTerminologyPage />} />
            <Route path="/validation" element={<ValidationPage />} />
            <Route path="/define-xml" element={<DefineXmlPage />} />
            <Route path="/exports" element={<ExportCenterPage />} />
            <Route path="/enrollment" element={<EnrollmentPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/ethics-regulatory" element={<EthicsRegulatoryPage />} />
            <Route path="/ethics-regulatory/:submissionId" element={<EthicsSubmissionDetailPage />} />
            <Route path="/ctri" element={<CtriManagementPage />} />
            <Route path="/ctri/:ctriId" element={<CtriDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:documentId" element={<DocumentDetailPage />} />
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/consent/:participantId" element={<ConsentDetailPage />} />
            <Route path="/regulatory-calendar" element={<RegulatoryCalendarPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit" element={<AuditTrailPage />} />
            <Route path="/system-health" element={<SystemHealthPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
