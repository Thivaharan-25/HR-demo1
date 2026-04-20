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
    e9: 'online', e10: 'break', e11: 'online', e12: 'online',
    e13: 'break', e14: 'online', e15: 'clocked-out', e16: 'online',
    e17: 'offline', e18: 'online', e19: 'online', e20: 'online',
    e21: 'online', e22: 'break', e23: 'online', e24: 'online',
    e25: 'offline', e26: 'online', e27: 'offline', e28: 'online',
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
