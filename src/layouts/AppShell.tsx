import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Bell, CalendarDays, ChevronRight, Command, FileText, LayoutDashboard, LayoutGrid, MapPinned, Milestone, MonitorCog, PackageCheck, RotateCcw, Search, ShieldCheck, Siren, UserCircle2, Workflow } from 'lucide-react'
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

const primaryNavItems = [
  { label: 'Portfolio', to: '/dashboard' },
  { label: 'Studies', to: '/trials' },
  { label: 'Safety', to: '/pharmacovigilance' },
  { label: 'Compliance', to: '/compliance' },
  { label: 'Analytics', to: '/reports' },
  { label: 'Documents', to: '/documents' },
  { label: 'Exports', to: '/exports' },
]

const moduleGroups = [
  { label: 'Portfolio', paths: ['/dashboard', '/trials', '/sites', '/participants', '/visits', '/enrollment', '/monitoring', '/milestones'] },
  { label: 'Safety', paths: ['/pharmacovigilance', '/adverse-events', '/sae', '/safety-signals', '/dsmb', '/alerts'] },
  { label: 'Compliance', paths: ['/deviations', '/ethics-regulatory', '/ctri', '/consent', '/regulatory-calendar', '/compliance', '/audit'] },
  { label: 'Data standards & interoperability', paths: ['/data-quality', '/interoperability', '/fhir/resources', '/fhir/mapping', '/fhir/validation', '/fhir/bundles', '/abdm', '/cdisc', '/datasets', '/data-mapping', '/controlled-terminology', '/validation', '/define-xml'] },
  { label: 'Workspace', paths: ['/documents', '/exports', '/reports', '/system-health'] },
].map((group) => ({ ...group, items: navItems.filter((item) => group.paths.includes(item.to)) }))

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
  const [modulesOpen, setModulesOpen] = useState(false)
  const shellRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!shellRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
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
        setModulesOpen(false)
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
    <div ref={shellRef} className="min-h-screen bg-[#f6f6f0] text-[#24372f]">
      <header className="sticky top-0 z-30 border-b border-[#e2e5da] bg-[#fbfbf6]/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <NavLink to="/dashboard" onClick={() => setModulesOpen(false)} className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#315d46] text-sm font-semibold text-white">A</span>
            <span>
              <span className="block font-display text-base font-bold text-[#24372f]">AIIA</span>
              <span className="hidden text-[10px] uppercase tracking-[0.12em] text-[#788278] sm:block">TrialShield</span>
            </span>
          </NavLink>

          <div className="hidden items-center gap-3 xl:flex">
            <nav aria-label="Primary navigation" className="flex items-center gap-0.5">
              {primaryNavItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} onClick={() => setModulesOpen(false)} className={({ isActive }) => `rounded-md px-2 py-2 text-xs font-medium transition-colors ${isActive ? 'bg-[#e8eee6] text-[#315d46]' : 'text-[#536258] hover:bg-[#f0f1e9]'}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-9 items-center gap-2 rounded-md border border-[#e2e5da] bg-white px-2.5 text-sm text-[#69766c] hover:border-[#b7c2b5]" aria-label="Search">
              <Search className="h-4 w-4" /><span className="hidden 2xl:inline">Search</span>
              <span className="hidden rounded border border-[#e2e5da] bg-[#f6f6f0] px-1.5 py-0.5 text-[10px] 2xl:inline-flex">⌘ K</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e2e5da] bg-white text-[#536258] hover:bg-[#f0f1e9] xl:hidden" aria-label="Search"><Search className="h-4 w-4" /></button>
            <div className="relative">
              <Button type="button" size="sm" variant="outline" onClick={() => setModulesOpen(!modulesOpen)} aria-expanded={modulesOpen} aria-label="All modules">
                <LayoutGrid className="h-4 w-4" /><span className="hidden sm:inline">All modules</span>
              </Button>
              {modulesOpen && (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 max-h-[min(76vh,620px)] w-[min(92vw,820px)] overflow-y-auto rounded-lg border border-[#e2e5da] bg-[#fffdf8] p-4 shadow-[0_12px_36px_rgba(36,55,47,0.12)] sm:p-5">
                  <h2 className="mb-4 font-display text-lg font-semibold text-[#24372f]">All modules</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {moduleGroups.map((group) => (
                      <section key={group.label}>
                        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#788278]">{group.label}</h3>
                        <div className="space-y-0.5">
                          {group.items.map(({ label, to, icon: Icon }) => (
                            <NavLink key={to} to={to} onClick={() => setModulesOpen(false)} className={({ isActive }) => `flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${isActive ? 'bg-[#e8eee6] font-semibold text-[#315d46]' : 'text-[#536258] hover:bg-[#f0f1e9]'}`}>
                              <Icon className="h-3.5 w-3.5 shrink-0" /><span>{label}</span>
                            </NavLink>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden items-center gap-1.5 2xl:flex">
              <Button type="button" size="sm" variant="secondary" onClick={() => setDemoMode(!demoMode)} aria-label="Toggle demo mode">{demoMode ? 'Demo on' : 'Demo off'}</Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => setLiveSimulation(!liveSimulation)} aria-label="Toggle live simulation">{liveSimulation ? 'Live' : 'Paused'}</Button>
              <Button type="button" size="sm" variant="secondary" onClick={resetDemoState} aria-label="Reset demo data"><RotateCcw className="h-3.5 w-3.5" /></Button>
            </div>
            <button type="button" onClick={() => setNotificationsOpen(true)} className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#e2e5da] bg-white text-[#536258] hover:bg-[#f0f1e9]" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b5483a] px-1 text-[10px] font-semibold text-white">{notificationCount}</span>}
            </button>
            <div className="hidden items-center gap-2 rounded-md border border-[#e2e5da] bg-white px-2 py-1 xl:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8eee6] text-[10px] font-semibold text-[#315d46]">{role.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="text-xs font-medium text-[#24372f]">{currentUser.name}</div>
                <select aria-label="Switch role" value={role} onChange={(event) => setRole(event.target.value as typeof role)} className="mt-0.5 max-w-28 bg-transparent text-[10px] uppercase tracking-[0.12em] text-[#788278] outline-none">
                  <option value="PI">PI</option><option value="Coordinator">Coordinator</option><option value="Monitor">Monitor</option><option value="Ethics">Ethics</option><option value="Pharmacovigilance">Pharmacovigilance</option><option value="Data Manager">Data Manager</option><option value="Admin">Admin</option><option value="Regulator">Regulator</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main aria-label={pageTitle} className="mx-auto w-full max-w-[1480px] p-4 md:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-[#788278]">
          {breadcrumbs.map((crumb, index) => (
            <span key={`${crumb}-${index}`} className="flex items-center gap-1.5">
              <span className={index === breadcrumbs.length - 1 ? 'font-medium text-[#536258]' : ''}>{crumb}</span>
              {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3 text-[#a3aaa0]" />}
            </span>
          ))}
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-[#e2e5da] bg-[#fbfbf6] p-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#788278]">Global filters</span>
          <span className="rounded-full border border-[#e2e5da] bg-white px-2 py-1 text-xs text-[#536258]">{globalFilters.studyId}</span>
          <span className="rounded-full border border-[#e2e5da] bg-white px-2 py-1 text-xs text-[#536258]">{globalFilters.siteId}</span>
          <span className="rounded-full border border-[#e2e5da] bg-white px-2 py-1 text-xs text-[#536258]">{globalFilters.module}</span>
          <span className="rounded-full border border-[#e2e5da] bg-white px-2 py-1 text-xs text-[#536258]">{globalFilters.dateRange}</span>
          {activeFilterCount > 0 && <button type="button" onClick={clearGlobalFilters} className="ml-auto text-xs font-medium text-[#315d46]">Clear filters</button>}
        </div>
        {children}
      </main>

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
