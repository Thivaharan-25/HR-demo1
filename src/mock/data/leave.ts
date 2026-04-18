import type { LeaveRequest } from '../types'

export const leaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeId: 'e3', type: 'Annual', startDate: '2026-04-28', endDate: '2026-04-30', status: 'pending', days: 3, reason: 'Family vacation' },
  { id: 'l2', employeeId: 'e4', type: 'Medical', startDate: '2026-04-20', endDate: '2026-04-21', status: 'approved', days: 2, reason: 'Doctor appointment' },
  { id: 'l3', employeeId: 'e5', type: 'Annual', startDate: '2026-05-05', endDate: '2026-05-09', status: 'approved', days: 5, reason: 'Holiday' },
  { id: 'l4', employeeId: 'e6', type: 'Unpaid', startDate: '2026-05-12', endDate: '2026-05-12', status: 'rejected', days: 1, reason: 'Personal errand' },
  { id: 'l5', employeeId: 'e7', type: 'Compassionate', startDate: '2026-04-22', endDate: '2026-04-23', status: 'approved', days: 2, reason: 'Family bereavement' },
  { id: 'l6', employeeId: 'e8', type: 'Annual', startDate: '2026-05-19', endDate: '2026-05-23', status: 'pending', days: 5, reason: 'Family trip' },
  { id: 'l7', employeeId: 'e9', type: 'Emergency', startDate: '2026-04-18', endDate: '2026-04-18', status: 'approved', days: 1, reason: 'Burst pipe at home' },
  { id: 'l8', employeeId: 'e10', type: 'Medical', startDate: '2026-04-25', endDate: '2026-04-26', status: 'pending', days: 2, reason: 'Dental surgery' },
]

export const leaveBalances = [
  { employeeId: 'e3', type: 'Annual', entitled: 14, used: 5, pending: 3, remaining: 6 },
  { employeeId: 'e3', type: 'Medical', entitled: 14, used: 2, pending: 0, remaining: 12 },
  { employeeId: 'e4', type: 'Annual', entitled: 14, used: 3, pending: 0, remaining: 11 },
  { employeeId: 'e4', type: 'Medical', entitled: 14, used: 2, pending: 0, remaining: 12 },
  { employeeId: 'e5', type: 'Annual', entitled: 14, used: 3, pending: 0, remaining: 11 },
  { employeeId: 'e5', type: 'Medical', entitled: 14, used: 0, pending: 0, remaining: 14 },
  { employeeId: 'e6', type: 'Annual', entitled: 14, used: 2, pending: 0, remaining: 12 },
  { employeeId: 'e6', type: 'Medical', entitled: 14, used: 1, pending: 0, remaining: 13 },
  { employeeId: 'e7', type: 'Annual', entitled: 14, used: 5, pending: 0, remaining: 9 },
  { employeeId: 'e7', type: 'Medical', entitled: 14, used: 0, pending: 0, remaining: 14 },
  { employeeId: 'e8', type: 'Annual', entitled: 14, used: 1, pending: 5, remaining: 8 },
  { employeeId: 'e8', type: 'Medical', entitled: 14, used: 0, pending: 0, remaining: 14 },
  { employeeId: 'e9', type: 'Annual', entitled: 14, used: 0, pending: 0, remaining: 14 },
  { employeeId: 'e9', type: 'Medical', entitled: 14, used: 2, pending: 0, remaining: 12 },
  { employeeId: 'e10', type: 'Annual', entitled: 14, used: 0, pending: 0, remaining: 14 },
  { employeeId: 'e10', type: 'Medical', entitled: 14, used: 0, pending: 2, remaining: 12 },
]
