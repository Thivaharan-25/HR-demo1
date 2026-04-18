import type { ProductivityScore } from '../types'

export const productivityScores: ProductivityScore[] = [
  { employeeId: 'e1', date: '2026-04-17', score: 92, activeHours: 7.2, idleHours: 0.8, topApp: 'VS Code' },
  { employeeId: 'e2', date: '2026-04-17', score: 78, activeHours: 6.5, idleHours: 1.5, topApp: 'Excel' },
  { employeeId: 'e3', date: '2026-04-17', score: 88, activeHours: 7.0, idleHours: 1.0, topApp: 'VS Code' },
  { employeeId: 'e4', date: '2026-04-17', score: 61, activeHours: 5.0, idleHours: 3.0, topApp: 'Chrome' },
]

export const weeklyTrend = [
  { date: '04-11', avg: 74 },
  { date: '04-12', avg: 71 },
  { date: '04-13', avg: 79 },
  { date: '04-14', avg: 76 },
  { date: '04-15', avg: 82 },
  { date: '04-16', avg: 80 },
  { date: '04-17', avg: 83 },
]
