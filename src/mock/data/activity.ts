import type { ActivityEntry } from '../types'

export const activityFeed: ActivityEntry[] = [
  { employeeId: 'e1', appName: 'VS Code', duration: 120, category: 'productive', timestamp: '2026-04-17T09:00:00Z' },
  { employeeId: 'e1', appName: 'Chrome', duration: 45, category: 'neutral', timestamp: '2026-04-17T10:00:00Z' },
  { employeeId: 'e1', appName: 'Slack', duration: 30, category: 'productive', timestamp: '2026-04-17T10:45:00Z' },
  { employeeId: 'e2', appName: 'Excel', duration: 90, category: 'productive', timestamp: '2026-04-17T09:00:00Z' },
  { employeeId: 'e2', appName: 'YouTube', duration: 20, category: 'unproductive', timestamp: '2026-04-17T11:30:00Z' },
  { employeeId: 'e3', appName: 'VS Code', duration: 180, category: 'productive', timestamp: '2026-04-17T08:30:00Z' },
  { employeeId: 'e3', appName: 'GitHub', duration: 60, category: 'productive', timestamp: '2026-04-17T11:30:00Z' },
]

export const screenshots = [
  { employeeId: 'e1', url: 'https://placehold.co/320x200/1a1a2e/7C3AED?text=VS+Code', timestamp: '2026-04-17T09:30:00Z' },
  { employeeId: 'e1', url: 'https://placehold.co/320x200/1a1a2e/7C3AED?text=Chrome', timestamp: '2026-04-17T10:00:00Z' },
  { employeeId: 'e2', url: 'https://placehold.co/320x200/1a1a2e/7C3AED?text=Excel', timestamp: '2026-04-17T09:15:00Z' },
  { employeeId: 'e3', url: 'https://placehold.co/320x200/1a1a2e/7C3AED?text=VS+Code', timestamp: '2026-04-17T08:45:00Z' },
]
