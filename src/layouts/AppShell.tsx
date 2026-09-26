import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, CalendarDays, ChevronRight, Command, FileText, HelpCircle, LayoutDashboard, MapPinned, Milestone, MonitorCog, PackageCheck, RotateCcw, Search, ShieldCheck, Siren, UserCircle2, Workflow } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Dialog, DialogContent } from '../components/ui/dialog'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAppStore } from '../store/useAppStore'
import type { SearchResult } from '../types'

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Clinical Trials', to: '/trials', icon: PackageCheck },
  { label: 'Sites', to: '/sites', icon: MapPinned },
  { label: 'Participants', to: '/participants', icon: UserCircle2 },
  { label: 'Monitoring', to: '/monitoring', icon: MonitorCog },
  { label: 'Data Quality', to: '/data-quality', icon: FileText },
  { label: 'FHIR Interop', to: '/interoperability', icon: Workflow },
  { label: 'FHIR Resources', to: '/fhir/resources', icon: FileText },
  { label: 'FHIR Mapping', to: '/fhir/mapping', icon: FileText },
  { label: 'FHIR Validation', to: '/fhir/validation', icon: ShieldCheck },
  { label: 'FHIR Bundles', to: '/fhir/bundles', icon: FileText },
  { label: 'ABDM Readiness', to: '/abdm', icon: ShieldCheck },
  { label: 'CDISC Center', to: '/cdisc', icon: FileText },
  { label: 'Dataset Explorer', to: '/datasets', icon: FileText },
  { label: 'Data Mapping', to: '/data-mapping', icon: FileText },
  { label: 'Validation Center', to: '/validation', icon: ShieldCheck },
  { label: 'Define-XML', to: '/define-xml', icon: FileText },
  { label: 'Export Center', to: '/exports', icon: FileText },
  { label: 'Safety & Pharmacovigilance', to: '/pharmacovigilance', icon: Siren },
  { label: 'Ethics & Regulatory', to: '/ethics-regulatory', icon: ShieldCheck },
  { label: 'CTRI Tracking', to: '/ctri', icon: FileText },
  { label: 'Milestones', to: '/milestones', icon: Milestone },
  { label: 'Documents', to: '/documents', icon: FileText },
  { label: 'Consent Management', to: '/consent', icon: ShieldCheck },
  { label: 'Regulatory Calendar', to: '/regulatory-calendar', icon: CalendarDays },
  { label: 'Compliance Center', to: '/compliance', icon: ShieldCheck },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Audit Trail', to: '/audit', icon: FileText },
  { label: 'System Health', to: '/system-health', icon: ShieldCheck },
  { label: 'Controlled Terminology', to: '/controlled-terminology', icon: Search },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/trials': 'Clinical Trials',
  '/sites': 'Sites',
  '/participants': 'Participants',
  '/visits': 'Visit Management',
  '/pharmacovigilance': 'Pharmacovigilance',
  '/adverse-events': 'Adverse Event Management',
  '/sae': 'Serious Adverse Events',
  '/safety-signals': 'Safety Signals',
  '/dsmb': 'DSMB Reviews',
  '/deviations': 'Protocol Deviations',
  '/data-quality': 'Data Quality Center',
  '/interoperability': 'FHIR R4 + ABDM interoperability',
  '/fhir/resources': 'FHIR resource library',
  '/fhir/resources/:resourceId': 'FHIR resource detail',
  '/fhir/mapping': 'FHIR mapping workspace',
  '/fhir/validation': 'FHIR validation center',
  '/fhir/bundles': 'FHIR bundle builder',
  '/fhir/bundles/:bundleId': 'FHIR bundle detail',
  '/fhir/exchange': 'Exchange simulator',
  '/fhir/logs': 'Exchange logs',
  '/fhir/api': 'FHIR API catalog',
  '/abdm': 'ABDM readiness center',
  '/cdisc': 'CDISC Center',
  '/datasets': 'Dataset Explorer',
  '/data-mapping': 'Data Mapping Workspace',
  '/controlled-terminology': 'Controlled Terminology',
  '/validation': 'Validation Center',
  '/define-xml': 'Define-XML Package',
  '/exports': 'Export Center',
  '/enrollment': 'Enrollment',
  '/monitoring': 'Monitoring',
  '/alerts': 'Alerts',
  '/milestones': 'Milestones',
  '/ethics-regulatory': 'Ethics & Regulatory Center',
  '/ctri': 'CTRI Management Center',
  '/documents': 'Document Management',
  '/consent': 'Informed Consent Management',
  '/regulatory-calendar': 'Regulatory Calendar',
  '/compliance': 'Compliance Center',
  '/reports': 'Reports',
  '/audit': 'Audit Trail',
  '/system-health': 'System Health',
  '/login': 'Login',
}

function getTitle(pathname: string) {
  return pageTitles[pathname] ?? 'Clinical Research Command Center'
}

function getBreadcrumbs(pathname: string) {
  if (pathname.startsWith('/trials/')) return ['Portfolio', 'Clinical Trials', 'Study Detail']
  if (pathname.startsWith('/participants/')) return ['Portfolio', 'Participants', 'Participant Record']
  if (pathname.startsWith('/deviations/')) return ['Portfolio', 'Protocol Deviations', 'Deviation Detail']
  if (pathname.startsWith('/ethics-regulatory/')) return ['Portfolio', 'Ethics & Regulatory', 'Submission Detail']
  if (pathname.startsWith('/ctri/')) return ['Portfolio', 'CTRI Management', 'CTRI Record']
  if (pathname.startsWith('/documents/')) return ['Portfolio', 'Documents', 'Document Detail']
  if (pathname.startsWith('/consent/')) return ['Portfolio', 'Consent', 'Consent Detail']
  if (pathname.startsWith('/datasets/')) return ['Portfolio', 'Data Standards', 'Dataset Detail']
  if (pathname === '/dashboard') return ['Portfolio', 'Overview']
  if (pathname === '/trials') return ['Portfolio', 'Clinical Trials']
  if (pathname === '/sites') return ['Portfolio', 'Sites']
  if (pathname === '/participants') return ['Portfolio', 'Participants']
  if (pathname === '/visits') return ['Portfolio', 'Visit Management']
  if (pathname === '/pharmacovigilance') return ['Portfolio', 'Pharmacovigilance']
  if (pathname === '/adverse-events') return ['Portfolio', 'Adverse Event Management']
  if (pathname === '/sae') return ['Portfolio', 'Serious Adverse Events']
  if (pathname === '/safety-signals') return ['Portfolio', 'Safety Signals']
  if (pathname === '/dsmb') return ['Portfolio', 'DSMB Reviews']
  if (pathname === '/deviations') return ['Portfolio', 'Protocol Deviations']
  if (pathname === '/data-quality') return ['Portfolio', 'Data Quality Center']
  if (pathname === '/interoperability') return ['Portfolio', 'FHIR Interoperability']
  if (pathname.startsWith('/fhir/resources')) return ['Portfolio', 'FHIR Interoperability', 'FHIR Resources']
  if (pathname === '/fhir/mapping') return ['Portfolio', 'FHIR Interoperability', 'FHIR Mapping']
  if (pathname === '/fhir/validation') return ['Portfolio', 'FHIR Interoperability', 'FHIR Validation']
  if (pathname.startsWith('/fhir/bundles')) return ['Portfolio', 'FHIR Interoperability', 'FHIR Bundles']
  if (pathname === '/fhir/exchange') return ['Portfolio', 'FHIR Interoperability', 'Exchange Simulator']
  if (pathname === '/fhir/logs') return ['Portfolio', 'FHIR Interoperability', 'Exchange Logs']
  if (pathname === '/fhir/api') return ['Portfolio', 'FHIR Interoperability', 'FHIR API Catalog']
  if (pathname === '/abdm') return ['Portfolio', 'FHIR Interoperability', 'ABDM Readiness']
  if (pathname === '/cdisc') return ['Portfolio', 'Data Standards']
  if (pathname === '/datasets') return ['Portfolio', 'Data Standards', 'Dataset Explorer']
  if (pathname === '/data-mapping') return ['Portfolio', 'Data Standards', 'Data Mapping']
  if (pathname === '/controlled-terminology') return ['Portfolio', 'Data Standards', 'Controlled Terminology']
  if (pathname === '/validation') return ['Portfolio', 'Data Standards', 'Validation']
  if (pathname === '/define-xml') return ['Portfolio', 'Data Standards', 'Define-XML']
  if (pathname === '/exports') return ['Portfolio', 'Data Standards', 'Export Center']
  if (pathname === '/enrollment') return ['Portfolio', 'Enrollment']
  if (pathname === '/monitoring') return ['Portfolio', 'Monitoring']
  if (pathname === '/alerts') return ['Portfolio', 'Alerts']
  if (pathname === '/milestones') return ['Portfolio', 'Milestones']
  if (pathname === '/ethics-regulatory') return ['Portfolio', 'Ethics & Regulatory']
  if (pathname === '/ctri') return ['Portfolio', 'CTRI Management']
  if (pathname === '/documents') return ['Portfolio', 'Documents']
  if (pathname === '/consent') return ['Portfolio', 'Consent']
  if (pathname === '/regulatory-calendar') return ['Portfolio', 'Regulatory Calendar']
  if (pathname === '/compliance') return ['Portfolio', 'Compliance']
  if (pathname === '/reports') return ['Portfolio', 'Reports']
  if (pathname === '/audit') return ['Portfolio', 'Audit Trail']
  if (pathname === '/system-health') return ['Portfolio', 'System Health']
  return ['Portfolio']
}

const searchIndex: SearchResult[] = [
  { category: 'Studies', label: 'AIIA-AYU-001 · Rheumatoid Arthritis Trial', path: '/trials/AIIA-AYU-001', meta: 'Recruiting' },
  { category: 'Studies', label: 'AIIA-AYU-004 · Prediabetes Trial', path: '/trials/AIIA-AYU-004', meta: 'At Risk' },
  { category: 'Sites', label: 'SITE-004 · Karnataka Ayurveda Hospital', path: '/sites/SITE-004', meta: 'At Risk' },
  { category: 'Participants', label: 'Participant Enrollment Summary', path: '/enrollment', meta: '1,284 enrolled' },
  { category: 'CTRI IDs', label: 'CTRI/2026/AYU-118', path: '/ctri/CTRI-001', meta: 'Registry status' },
  { category: 'Ethics', label: 'IEC Amendment Pack v2.1', path: '/ethics-regulatory/ETH-104', meta: 'Approved' },
  { category: 'Documents', label: 'Study protocol 2026 v3', path: '/documents/DOC-201', meta: 'Approved' },
  { category: 'Compliance', label: 'Compliance review tracker', path: '/compliance', meta: 'Framework review' },
  { category: 'FHIR', label: 'FHIR R4 interoperability center', path: '/interoperability', meta: 'Participant and consent mapping' },
  { category: 'FHIR', label: 'FHIR resource library', path: '/fhir/resources', meta: 'Patient, consent, Observation' },
  { category: 'FHIR', label: 'FHIR bundle builder', path: '/fhir/bundles', meta: 'Synthetic exchange bundle' },
  { category: 'ABDM', label: 'ABDM readiness review', path: '/abdm', meta: 'Consent and identity coverage' },
  { category: 'CDISC', label: 'Clinical Data Standards Center', path: '/cdisc', meta: 'Lifecycle overview' },
  { category: 'CDISC', label: 'Dataset explorer', path: '/datasets', meta: 'SDTM and ADaM review' },
  { category: 'CDISC', label: 'Validation center', path: '/validation', meta: 'Open findings' },
  { category: 'Audit events', label: 'Monitoring visit logged', path: '/trials/AIIA-AYU-003', meta: 'Audit trail' },
  { category: 'Safety reports', label: 'SAE: Karnataka Ayurveda Hospital', path: '/alerts', meta: 'Critical' },
]

const quickCommands = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Trial 360', path: '/trials/AIIA-AYU-001/360' },
  { label: 'Participants', path: '/participants' },
  { label: 'Visits', path: '/visits' },
  { label: 'Deviations', path: '/deviations' },
  { label: 'Data Quality', path: '/data-quality' },
  { label: 'Reports', path: '/reports' },
  { label: 'Audit Trail', path: '/audit' },
  { label: 'System Health', path: '/system-health' },
  { label: 'FHIR Interop', path: '/interoperability' },
  { label: 'FHIR Mapping', path: '/fhir/mapping' },
  { label: 'ABDM', path: '/abdm' },
  { label: 'CDISC', path: '/cdisc' },
  { label: 'Datasets', path: '/datasets' },
  { label: 'Validation', path: '/validation' },
  { label: 'Monitoring', path: '/monitoring' },
  { label: 'Ethics', path: '/ethics-regulatory' },
  { label: 'CTRI', path: '/ctri' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    sidebarOpen,
    setSidebarOpen,
    searchOpen,
    setSearchOpen,
    notificationCount,
    notifications,
    setRole,
    currentUser,
    role,
    demoMode,
    liveSimulation,
    globalFilters,
    clearGlobalFilters,
    setDemoMode,
    setLiveSimulation,
    resetDemoState,
    markNotificationRead,
    dismissNotification,
    markAllNotificationsRead,
  } = useAppStore()
  const breadcrumbs = useMemo(() => getBreadcrumbs(location.pathname), [location.pathname])
  const pageTitle = useMemo(() => getTitle(location.pathname), [location.pathname])
  const [query, setQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const sidebarRef = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!shellRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      )
      gsap.fromTo(
        sidebarRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      )
    }, shellRef)

    return () => ctx.revert()
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setSearchOpen])

  const results = query.trim()
    ? searchIndex.filter((item) => `${item.label} ${item.category} ${item.meta}`.toLowerCase().includes(query.toLowerCase()))
    : searchIndex.slice(0, 6)

  const activeFilterCount = [globalFilters.studyId, globalFilters.siteId, globalFilters.dateRange, globalFilters.module]
    .filter((value) => value && value !== 'All studies' && value !== 'All sites' && value !== 'All dates' && value !== 'All modules').length

  const handleNavigate = (path: string) => {
    navigate(path)
    setSearchOpen(false)
  }

  const handleNotificationAction = (item: (typeof notifications)[number]) => {
    markNotificationRead(item.id)
    if (item.path) {
      navigate(item.path)
      setNotificationsOpen(false)
    }
  }

  return (
    <div ref={shellRef} className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_38%),linear-gradient(180deg,_#020817_0%,_#0f172a_100%)]">
        <AnimatePresence>
          {(sidebarOpen || location.pathname === '/dashboard') && (
            <motion.aside
              ref={sidebarRef}
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col border-r border-slate-800 bg-slate-950/95 shadow-[0_0_40px_rgba(14,165,233,0.12)] md:relative md:z-auto"
            >
              <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20">A</div>
                <div>
                  <div className="text-lg font-semibold tracking-[-0.03em] text-white">AIIA</div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Clinical Research</div>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
                <div className="space-y-1">
                  {navItems.slice(0, 8).map(({ label, to, icon: Icon }) => (
                    <NavLink
                      key={label}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="my-4 h-px bg-slate-800" />

                <div className="space-y-1">
                  {navItems.slice(8).map(({ label, to, icon: Icon }) => (
                    <NavLink
                      key={label}
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? 'bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 bg-slate-900/75 p-3">
                <div className="mb-2 flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200">
                  <span>System Status</span>
                  <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">LIVE</span>
                </div>
                <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  <HelpCircle className="h-4 w-4 text-slate-400" />
                  Help
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-slate-800/80 px-2 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-300">PI</div>
                  <div>
                    <div className="text-sm font-medium text-white">{currentUser.name}</div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">{currentUser.role}</div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-3 text-slate-100 backdrop-blur md:px-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div>
                <div className="text-xl font-semibold tracking-[-0.04em] text-white">{pageTitle}</div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {breadcrumbs.map((crumb, index) => (
                    <span key={crumb} className="flex items-center gap-2">
                      {crumb}
                      {index < breadcrumbs.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-300 hover:border-slate-500"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
                <span className="ml-2 inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium">⌘ K</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" size="sm" variant="secondary" onClick={() => setDemoMode(!demoMode)} aria-label="Toggle demo mode">
                {demoMode ? 'Demo on' : 'Demo off'}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setLiveSimulation(!liveSimulation)} aria-label="Toggle live simulation">
                {liveSimulation ? 'Live' : 'Paused'}
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={resetDemoState} aria-label="Reset demo data">
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Reset</span>
              </Button>
              <button type="button" onClick={() => setNotificationsOpen(true)} className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
              <div className="hidden items-center gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-300">{demoMode ? 'Live' : 'Demo'}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-semibold text-cyan-300">{role.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div className="text-xs font-medium text-slate-100">{currentUser.name}</div>
                    <select
                      aria-label="Switch role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as typeof role)}
                      className="mt-0.5 bg-transparent text-[10px] uppercase tracking-[0.12em] text-slate-400 outline-none"
                    >
                      <option value="PI">PI</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Monitor">Monitor</option>
                      <option value="Ethics">Ethics</option>
                      <option value="Pharmacovigilance">Pharmacovigilance</option>
                      <option value="Data Manager">Data Manager</option>
                      <option value="Admin">Admin</option>
                      <option value="Regulator">Regulator</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-2 shadow-[0_0_30px_rgba(14,165,233,0.08)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Global filters</span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">{globalFilters.studyId}</span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">{globalFilters.siteId}</span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">{globalFilters.module}</span>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200">{globalFilters.dateRange}</span>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearGlobalFilters} className="ml-auto text-xs font-medium text-cyan-300">
                  Clear filters
                </button>
              )}
            </div>
            {children}
          </main>
        </div>
      </div>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-xl rounded-xl p-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Global notification center</div>
              <div className="flex items-center gap-2">
                <Badge variant="info">{notificationCount} unread</Badge>
                <button type="button" className="text-xs font-medium text-primary" onClick={markAllNotificationsRead}>Mark all read</button>
              </div>
            </div>
          </div>
          <div className="max-h-[460px] space-y-3 overflow-y-auto p-4">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">All notifications are cleared.</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className={`rounded-xl border p-3 ${item.read ? 'border-slate-200 bg-white' : 'border-primary/20 bg-slate-50'}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-slate-800">{item.title}</div>
                    <Badge variant={item.category === 'Critical' ? 'critical' : item.category === 'Regulatory' ? 'warning' : item.category === 'System' ? 'neutral' : 'info'}>{item.category}</Badge>
                  </div>
                  <div className="text-sm text-slate-600">{item.description}</div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.study}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant={item.severity === 'Critical' ? 'critical' : item.severity === 'High' ? 'warning' : 'neutral'}>{item.severity}</Badge>
                    <div className="flex items-center gap-2">
                      {!item.read && <button type="button" className="text-xs font-medium text-primary" onClick={() => markNotificationRead(item.id)}>Mark read</button>}
                      <button type="button" className="text-xs font-medium text-primary" onClick={() => handleNotificationAction(item)}>{item.action}</button>
                      <button type="button" className="text-xs font-medium text-slate-500" onClick={() => dismissNotification(item.id)}>Dismiss</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl rounded-xl p-0">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search studies, sites, participants, CTRI IDs..."
                className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                aria-label="Global search"
              />
              <div className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                <Command className="h-3 w-3" /> K
              </div>
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickCommands.map(({ label, path }) => (
                <button key={label} type="button" onClick={() => handleNavigate(path)} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100">
                  {label}
                </button>
              ))}
            </div>
            {results.length > 0 ? (
              <div className="space-y-4">
                {Array.from(new Set(results.map((item) => item.category))).map((category) => (
                  <div key={category}>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{category}</div>
                    <div className="space-y-2">
                      {results
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <button
                            key={`${item.category}-${item.label}`}
                            type="button"
                            onClick={() => handleNavigate(item.path)}
                            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                          >
                            <div>
                              <div className="text-sm font-medium text-slate-800">{item.label}</div>
                              <div className="text-xs text-slate-500">{item.meta}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">No matching records found.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
