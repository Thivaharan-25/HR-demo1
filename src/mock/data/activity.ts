import type { ActivityEntry } from '../types'

export const activityFeed: ActivityEntry[] = [
  // Sarah Lim (e1)
  { employeeId: 'e1', appName: 'VS Code', duration: 120, category: 'productive', timestamp: '2026-04-18T09:00:00Z' },
  { employeeId: 'e1', appName: 'Chrome', duration: 45, category: 'neutral', timestamp: '2026-04-18T11:00:00Z' },
  { employeeId: 'e1', appName: 'Slack', duration: 30, category: 'productive', timestamp: '2026-04-18T12:00:00Z' },
  { employeeId: 'e1', appName: 'Zoom', duration: 60, category: 'productive', timestamp: '2026-04-18T14:00:00Z' },
  { employeeId: 'e1', appName: 'Notion', duration: 25, category: 'productive', timestamp: '2026-04-18T15:30:00Z' },
  // James Rajan (e2)
  { employeeId: 'e2', appName: 'Excel', duration: 90, category: 'productive', timestamp: '2026-04-18T09:00:00Z' },
  { employeeId: 'e2', appName: 'Slack', duration: 40, category: 'productive', timestamp: '2026-04-18T10:30:00Z' },
  { employeeId: 'e2', appName: 'Zoom', duration: 75, category: 'productive', timestamp: '2026-04-18T11:30:00Z' },
  { employeeId: 'e2', appName: 'YouTube', duration: 20, category: 'unproductive', timestamp: '2026-04-18T13:30:00Z' },
  { employeeId: 'e2', appName: 'Jira', duration: 50, category: 'productive', timestamp: '2026-04-18T14:30:00Z' },
  // Aisha Noor (e3)
  { employeeId: 'e3', appName: 'VS Code', duration: 180, category: 'productive', timestamp: '2026-04-18T08:30:00Z' },
  { employeeId: 'e3', appName: 'GitHub', duration: 60, category: 'productive', timestamp: '2026-04-18T11:30:00Z' },
  { employeeId: 'e3', appName: 'Chrome', duration: 35, category: 'neutral', timestamp: '2026-04-18T13:00:00Z' },
  { employeeId: 'e3', appName: 'Slack', duration: 25, category: 'productive', timestamp: '2026-04-18T14:00:00Z' },
  { employeeId: 'e3', appName: 'Figma', duration: 40, category: 'productive', timestamp: '2026-04-18T15:00:00Z' },
  // Ravi Kumar (e4)
  { employeeId: 'e4', appName: 'Chrome', duration: 80, category: 'neutral', timestamp: '2026-04-18T09:15:00Z' },
  { employeeId: 'e4', appName: 'Excel', duration: 55, category: 'productive', timestamp: '2026-04-18T10:30:00Z' },
  { employeeId: 'e4', appName: 'Outlook', duration: 45, category: 'productive', timestamp: '2026-04-18T12:00:00Z' },
  { employeeId: 'e4', appName: 'YouTube', duration: 35, category: 'unproductive', timestamp: '2026-04-18T13:30:00Z' },
  // Hafiz Azman (e6)
  { employeeId: 'e6', appName: 'Xcode', duration: 150, category: 'productive', timestamp: '2026-04-18T09:00:00Z' },
  { employeeId: 'e6', appName: 'Simulator', duration: 40, category: 'productive', timestamp: '2026-04-18T11:30:00Z' },
  { employeeId: 'e6', appName: 'Slack', duration: 20, category: 'productive', timestamp: '2026-04-18T14:00:00Z' },
  { employeeId: 'e6', appName: 'Chrome', duration: 30, category: 'neutral', timestamp: '2026-04-18T15:00:00Z' },
  // Vikram Singh (e8)
  { employeeId: 'e8', appName: 'VS Code', duration: 200, category: 'productive', timestamp: '2026-04-18T08:00:00Z' },
  { employeeId: 'e8', appName: 'Terminal', duration: 60, category: 'productive', timestamp: '2026-04-18T11:00:00Z' },
  { employeeId: 'e8', appName: 'Docker Desktop', duration: 45, category: 'productive', timestamp: '2026-04-18T13:00:00Z' },
]

// Rich app usage summary (per employee per day — for bar chart)
export const appUsageSummary: Record<string, Array<{ app: string; minutes: number; category: string }>> = {
  e1: [
    { app: 'VS Code', minutes: 245, category: 'productive' },
    { app: 'Slack', minutes: 85, category: 'productive' },
    { app: 'Zoom', minutes: 75, category: 'productive' },
    { app: 'Chrome', minutes: 60, category: 'neutral' },
    { app: 'Notion', minutes: 35, category: 'productive' },
  ],
  e2: [
    { app: 'Excel', minutes: 130, category: 'productive' },
    { app: 'Jira', minutes: 90, category: 'productive' },
    { app: 'Zoom', minutes: 85, category: 'productive' },
    { app: 'Slack', minutes: 65, category: 'productive' },
    { app: 'YouTube', minutes: 20, category: 'unproductive' },
  ],
  e3: [
    { app: 'VS Code', minutes: 210, category: 'productive' },
    { app: 'GitHub', minutes: 80, category: 'productive' },
    { app: 'Figma', minutes: 55, category: 'productive' },
    { app: 'Slack', minutes: 40, category: 'productive' },
    { app: 'Chrome', minutes: 35, category: 'neutral' },
  ],
  e4: [
    { app: 'Outlook', minutes: 90, category: 'productive' },
    { app: 'Chrome', minutes: 80, category: 'neutral' },
    { app: 'Excel', minutes: 55, category: 'productive' },
    { app: 'YouTube', minutes: 35, category: 'unproductive' },
  ],
  e6: [
    { app: 'Xcode', minutes: 185, category: 'productive' },
    { app: 'Simulator', minutes: 55, category: 'productive' },
    { app: 'Chrome', minutes: 40, category: 'neutral' },
    { app: 'Slack', minutes: 30, category: 'productive' },
  ],
  e8: [
    { app: 'VS Code', minutes: 240, category: 'productive' },
    { app: 'Terminal', minutes: 80, category: 'productive' },
    { app: 'Docker Desktop', minutes: 60, category: 'productive' },
    { app: 'Slack', minutes: 25, category: 'productive' },
  ],
}

// Hourly presence timeline (0-23 for each employee)
export const hourlyTimeline: Record<string, Array<{ hour: number; status: 'active' | 'idle' | 'break' | 'absent' }>> = {
  e1: [
    ...Array.from({ length: 9 }, (_, i) => ({ hour: i, status: 'absent' as const })),
    { hour: 9, status: 'active' }, { hour: 10, status: 'active' },
    { hour: 11, status: 'active' }, { hour: 12, status: 'idle' },
    { hour: 13, status: 'break' }, { hour: 14, status: 'active' },
    { hour: 15, status: 'active' }, { hour: 16, status: 'active' },
    { hour: 17, status: 'idle' }, { hour: 18, status: 'absent' },
    ...Array.from({ length: 6 }, (_, i) => ({ hour: 19 + i, status: 'absent' as const })),
  ],
  e3: [
    ...Array.from({ length: 8 }, (_, i) => ({ hour: i, status: 'absent' as const })),
    { hour: 8, status: 'active' }, { hour: 9, status: 'active' },
    { hour: 10, status: 'active' }, { hour: 11, status: 'active' },
    { hour: 12, status: 'break' }, { hour: 13, status: 'idle' },
    { hour: 14, status: 'active' }, { hour: 15, status: 'active' },
    { hour: 16, status: 'active' }, { hour: 17, status: 'active' },
    { hour: 18, status: 'absent' },
    ...Array.from({ length: 6 }, (_, i) => ({ hour: 19 + i, status: 'absent' as const })),
  ],
}

export const screenshots = [
  { id: 'ss1', employeeId: 'e1', url: 'https://placehold.co/320x200/13111f/7C3AED?text=VS+Code+%7C+9:30am', timestamp: '2026-04-18T09:30:00Z', app: 'VS Code', trigger: 'scheduled' },
  { id: 'ss2', employeeId: 'e1', url: 'https://placehold.co/320x200/13111f/06b6d4?text=Chrome+%7C+11:00am', timestamp: '2026-04-18T11:00:00Z', app: 'Chrome', trigger: 'random' },
  { id: 'ss3', employeeId: 'e1', url: 'https://placehold.co/320x200/13111f/7C3AED?text=Slack+%7C+12:05pm', timestamp: '2026-04-18T12:05:00Z', app: 'Slack', trigger: 'scheduled' },
  { id: 'ss4', employeeId: 'e1', url: 'https://placehold.co/320x200/13111f/10b981?text=Zoom+%7C+2:15pm', timestamp: '2026-04-18T14:15:00Z', app: 'Zoom', trigger: 'scheduled' },
  { id: 'ss5', employeeId: 'e2', url: 'https://placehold.co/320x200/13111f/7C3AED?text=Excel+%7C+9:15am', timestamp: '2026-04-18T09:15:00Z', app: 'Excel', trigger: 'scheduled' },
  { id: 'ss6', employeeId: 'e2', url: 'https://placehold.co/320x200/13111f/f59e0b?text=Zoom+%7C+11:30am', timestamp: '2026-04-18T11:30:00Z', app: 'Zoom', trigger: 'scheduled' },
  { id: 'ss7', employeeId: 'e3', url: 'https://placehold.co/320x200/13111f/7C3AED?text=VS+Code+%7C+8:45am', timestamp: '2026-04-18T08:45:00Z', app: 'VS Code', trigger: 'random' },
  { id: 'ss8', employeeId: 'e3', url: 'https://placehold.co/320x200/13111f/7C3AED?text=GitHub+%7C+11:30am', timestamp: '2026-04-18T11:30:00Z', app: 'GitHub', trigger: 'scheduled' },
  { id: 'ss9', employeeId: 'e3', url: 'https://placehold.co/320x200/13111f/ec4899?text=Figma+%7C+3:00pm', timestamp: '2026-04-18T15:00:00Z', app: 'Figma', trigger: 'scheduled' },
]
