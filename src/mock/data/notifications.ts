import type { Notification } from '../types'

export const notifications: Notification[] = [
  { id: 'n1', type: 'approval', title: 'Leave Request', body: 'Aisha Noor has requested 3 days annual leave', timestamp: '2026-04-17T09:00:00Z', read: false },
  { id: 'n2', type: 'alert', title: 'Exception Detected', body: 'Vikram Singh has not clocked in today', timestamp: '2026-04-17T09:30:00Z', read: false },
  { id: 'n3', type: 'mention', title: 'Mentioned by James', body: 'You were mentioned in the Audit Log review', timestamp: '2026-04-17T10:00:00Z', read: true },
  { id: 'n4', type: 'info', title: 'WMS Sync Complete', body: 'Bridge 1: 12 employee records synced successfully', timestamp: '2026-04-17T08:05:00Z', read: true },
]
