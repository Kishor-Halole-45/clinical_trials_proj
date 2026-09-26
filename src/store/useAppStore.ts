import { create } from 'zustand'
import type { AppUser, GlobalFilterState } from '../types'
import { currentUser } from '../data/users'
import { notificationItems } from '../data/phase3'

export type AppNotification = (typeof notificationItems)[number] & { read?: boolean }

interface AppState {
  currentUser: AppUser
  role: AppUser['role']
  sidebarOpen: boolean
  notificationCount: number
  notifications: AppNotification[]
  recentlyViewed: string[]
  favorites: string[]
  globalFilters: GlobalFilterState
  searchOpen: boolean
  demoMode: boolean
  liveSimulation: boolean
  setCurrentUser: (user: AppUser) => void
  setRole: (role: AppUser['role']) => void
  setSidebarOpen: (open: boolean) => void
  setNotificationCount: (count: number) => void
  setGlobalFilters: (filters: Partial<GlobalFilterState>) => void
  clearGlobalFilters: () => void
  setSearchOpen: (open: boolean) => void
  setDemoMode: (enabled: boolean) => void
  setLiveSimulation: (enabled: boolean) => void
  markNotificationRead: (id: string) => void
  dismissNotification: (id: string) => void
  markAllNotificationsRead: () => void
  addRecentlyViewed: (label: string, path: string) => void
  toggleFavorite: (id: string) => void
  resetDemoState: () => void
}

const initialNotifications: AppNotification[] = notificationItems.map((item) => ({ ...item, read: false }))

export const useAppStore = create<AppState>((set) => ({
  currentUser,
  role: currentUser.role,
  sidebarOpen: true,
  notificationCount: initialNotifications.filter((item) => !item.read).length,
  notifications: initialNotifications,
  recentlyViewed: ['Overview', 'AIIA-AYU-001', 'Participants'],
  favorites: ['AIIA-AYU-001', 'SITE-004'],
  globalFilters: {
    studyId: 'All studies',
    siteId: 'All sites',
    status: [],
    risk: [],
    severity: [],
    search: '',
    dateRange: 'All dates',
    module: 'All modules',
  },
  searchOpen: false,
  demoMode: true,
  liveSimulation: true,
  setCurrentUser: (user) => set({ currentUser: user, role: user.role }),
  setRole: (role) => set((state) => ({ role, currentUser: { ...state.currentUser, role } })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setNotificationCount: (notificationCount) => set({ notificationCount }),
  setGlobalFilters: (filters) =>
    set((state) => ({
      globalFilters: { ...state.globalFilters, ...filters },
    })),
  clearGlobalFilters: () =>
    set({
      globalFilters: {
        studyId: 'All studies',
        siteId: 'All sites',
        status: [],
        risk: [],
        severity: [],
        search: '',
        dateRange: 'All dates',
        module: 'All modules',
      },
    }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  setDemoMode: (demoMode) => set({ demoMode }),
  setLiveSimulation: (liveSimulation) => set({ liveSimulation }),
  markNotificationRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((item) => (item.id === id ? { ...item, read: true } : item))
      return { notifications, notificationCount: notifications.filter((item) => !item.read).length }
    }),
  dismissNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((item) => item.id !== id)
      return { notifications, notificationCount: notifications.filter((item) => !item.read).length }
    }),
  markAllNotificationsRead: () =>
    set((state) => {
      const notifications = state.notifications.map((item) => ({ ...item, read: true }))
      return { notifications, notificationCount: 0 }
    }),
  addRecentlyViewed: (label, _path) =>
    set((state) => {
      const next = [label, ...state.recentlyViewed.filter((item) => item !== label)].slice(0, 6)
      return { recentlyViewed: next }
    }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id],
    })),
  resetDemoState: () =>
    set({
      notifications: initialNotifications,
      notificationCount: initialNotifications.filter((item) => !item.read).length,
      recentlyViewed: ['Overview', 'AIIA-AYU-001', 'Participants'],
      favorites: ['AIIA-AYU-001', 'SITE-004'],
      demoMode: true,
      liveSimulation: true,
      globalFilters: {
        studyId: 'All studies',
        siteId: 'All sites',
        status: [],
        risk: [],
        severity: [],
        search: '',
        dateRange: 'All dates',
        module: 'All modules',
      },
    }),
}))
