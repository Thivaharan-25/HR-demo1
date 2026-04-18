import type { ExceptionEvent } from '../types'

export const exceptionEvents: ExceptionEvent[] = [
  { id: 'ex1', employeeId: 'e4', type: 'Clocked In Late', severity: 'low', message: 'Ravi Kumar clocked in 45 minutes late', timestamp: '2026-04-17T08:45:00Z', resolved: false },
  { id: 'ex2', employeeId: 'e5', type: 'Non-Work App Used', severity: 'medium', message: 'Priya Devi used YouTube for 20 min during work hours', timestamp: '2026-04-17T11:32:00Z', resolved: false },
  { id: 'ex3', employeeId: 'e6', type: 'ID Scanner Failed', severity: 'high', message: 'Hafiz Azman fingerprint verification failed 3 times', timestamp: '2026-04-17T08:55:00Z', resolved: true },
  { id: 'ex4', employeeId: 'e8', type: 'Missed Clock-In', severity: 'critical', message: 'Vikram Singh has not clocked in today', timestamp: '2026-04-17T09:30:00Z', resolved: false },
]
