import type { LeaveType } from '../types'

export const leaveTypes: LeaveType[] = [
  { id: 'lt1', name: 'Annual Leave', entitlementDays: 14, accrual: 'upfront', carryForward: true, maxCarryDays: 7, requiresDocument: false, approvalRequired: true, description: 'Standard paid annual leave entitlement' },
  { id: 'lt2', name: 'Medical Leave', entitlementDays: 14, accrual: 'upfront', carryForward: false, maxCarryDays: 0, requiresDocument: true, approvalRequired: true, description: 'Sick leave with medical certificate required for >2 days' },
  { id: 'lt3', name: 'Compassionate Leave', entitlementDays: 3, accrual: 'upfront', carryForward: false, maxCarryDays: 0, requiresDocument: true, approvalRequired: false, description: 'Leave for bereavement or family emergency' },
  { id: 'lt4', name: 'Unpaid Leave', entitlementDays: 30, accrual: 'upfront', carryForward: false, maxCarryDays: 0, requiresDocument: false, approvalRequired: true, description: 'Unpaid leave for extended absence needs' },
  { id: 'lt5', name: 'Emergency Leave', entitlementDays: 2, accrual: 'upfront', carryForward: false, maxCarryDays: 0, requiresDocument: false, approvalRequired: false, description: 'Immediate leave for unforeseen emergencies' },
]
