import { create } from 'zustand'
import type { ExceptionEvent, Notification } from '../mock/types'

interface LiveState {
  presenceStatuses: Record<string, string>
  liveExceptions: ExceptionEvent[]
  liveNotifications: Notification[]
  inboxCount: number
  wmsSyncLog: Array<{ bridgeName: string; recordCount: number; timestamp: string }>
  updatePresence: (employeeId: string, status: string) => void
  addException: (event: ExceptionEvent) => void
  addNotification: (n: Notification) => void
  addWmsLog: (entry: { bridgeName: string; recordCount: number; timestamp: string }) => void
}

export const useLiveStore = create<LiveState>((set) => ({
  presenceStatuses: {
    e1: 'online', e2: 'online', e3: 'online', e4: 'break',
    e5: 'offline', e6: 'online', e7: 'online', e8: 'clocked-out',
    e9: 'online', e10: 'break',
  },
  liveExceptions: [],
  liveNotifications: [],
  inboxCount: 2,
  wmsSyncLog: [],
  updatePresence: (employeeId, status) =>
    set((s) => ({ presenceStatuses: { ...s.presenceStatuses, [employeeId]: status } })),
  addException: (event) =>
    set((s) => ({ liveExceptions: [event, ...s.liveExceptions].slice(0, 20), inboxCount: s.inboxCount + 1 })),
  addNotification: (n) =>
    set((s) => ({ liveNotifications: [n, ...s.liveNotifications].slice(0, 20), inboxCount: s.inboxCount + 1 })),
  addWmsLog: (entry) =>
    set((s) => ({ wmsSyncLog: [entry, ...s.wmsSyncLog].slice(0, 10) })),
}))
