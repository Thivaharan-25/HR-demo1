import type { ProductivityScore } from '../types'

export const productivityScores: ProductivityScore[] = [
  { employeeId: 'e1', date: '2026-04-17', score: 92, activeHours: 7.2, idleHours: 0.8, topApp: 'VS Code' },
  { employeeId: 'e2', date: '2026-04-17', score: 78, activeHours: 6.5, idleHours: 1.5, topApp: 'Excel' },
  { employeeId: 'e3', date: '2026-04-17', score: 88, activeHours: 7.0, idleHours: 1.0, topApp: 'VS Code' },
  { employeeId: 'e4', date: '2026-04-17', score: 61, activeHours: 5.0, idleHours: 3.0, topApp: 'Chrome' },
  { employeeId: 'e6', date: '2026-04-17', score: 85, activeHours: 6.8, idleHours: 1.2, topApp: 'Xcode' },
  { employeeId: 'e7', date: '2026-04-17', score: 77, activeHours: 6.2, idleHours: 1.8, topApp: 'Figma' },
  { employeeId: 'e8', date: '2026-04-17', score: 90, activeHours: 7.5, idleHours: 0.5, topApp: 'VS Code' },
]

// 4 weeks of daily productivity trend (Mon–Fri)
export const weeklyTrend = [
  // Week 1 — Mar 24–28
  { date: '03-24', avg: 71, attendance: 88, leave: 3 },
  { date: '03-25', avg: 74, attendance: 91, leave: 2 },
  { date: '03-26', avg: 69, attendance: 85, leave: 4 },
  { date: '03-27', avg: 76, attendance: 90, leave: 3 },
  { date: '03-28', avg: 72, attendance: 87, leave: 2 },
  // Week 2 — Mar 31–Apr 4
  { date: '03-31', avg: 75, attendance: 92, leave: 2 },
  { date: '04-01', avg: 78, attendance: 94, leave: 1 },
  { date: '04-02', avg: 73, attendance: 89, leave: 3 },
  { date: '04-03', avg: 80, attendance: 93, leave: 2 },
  { date: '04-04', avg: 77, attendance: 91, leave: 1 },
  // Week 3 — Apr 7–11
  { date: '04-07', avg: 79, attendance: 90, leave: 3 },
  { date: '04-08', avg: 82, attendance: 95, leave: 1 },
  { date: '04-09', avg: 80, attendance: 93, leave: 2 },
  { date: '04-10', avg: 83, attendance: 96, leave: 1 },
  { date: '04-11', avg: 81, attendance: 94, leave: 2 },
  // Week 4 — Apr 14–18
  { date: '04-14', avg: 84, attendance: 94, leave: 2 },
  { date: '04-15', avg: 82, attendance: 92, leave: 3 },
  { date: '04-16', avg: 80, attendance: 91, leave: 3 },
  { date: '04-17', avg: 86, attendance: 95, leave: 1 },
  { date: '04-18', avg: 83, attendance: 93, leave: 2 },
]

// Department-level breakdown
export const departmentStats = [
  { department: 'Engineering', headcount: 10, avgScore: 86, attendance: 94, onLeave: 1 },
  { department: 'HR', headcount: 4, avgScore: 72, attendance: 88, onLeave: 0 },
  { department: 'Finance', headcount: 3, avgScore: 79, attendance: 91, onLeave: 1 },
  { department: 'Marketing', headcount: 3, avgScore: 75, attendance: 90, onLeave: 0 },
  { department: 'Product', headcount: 3, avgScore: 81, attendance: 93, onLeave: 0 },
  { department: 'Operations', headcount: 2, avgScore: 70, attendance: 87, onLeave: 0 },
  { department: 'Sales', headcount: 3, avgScore: 78, attendance: 89, onLeave: 1 },
]

// Monthly headcount growth
export const headcountTrend = [
  { month: 'Oct', count: 20 },
  { month: 'Nov', count: 21 },
  { month: 'Dec', count: 22 },
  { month: 'Jan', count: 23 },
  { month: 'Feb', count: 25 },
  { month: 'Mar', count: 26 },
  { month: 'Apr', count: 28 },
]
