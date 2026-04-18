export type PresenceStatus = 'online' | 'break' | 'offline' | 'clocked-out'
export type LeaveStatus = 'pending' | 'approved' | 'rejected'
export type ExceptionSeverity = 'low' | 'medium' | 'high' | 'critical'
export type SkillStatus = 'pending' | 'validated' | 'rejected'
export type DocumentStatus = 'pending_acknowledgement' | 'acknowledged' | 'no_action'
export type DocumentCategory = 'Contract' | 'Policy' | 'Certificate' | 'General'
export type DocumentAccessLevel = 'Public' | 'Department' | 'Individual' | 'Confidential'

export interface Tenant {
  id: string; name: string; logo: string; primaryColor: string; slug: string
}
export interface Employee {
  id: string; tenantId: string; name: string; avatar: string
  department: string; team: string; jobTitle: string; email: string
  status: PresenceStatus; managerId: string | null; employmentType: 'full-time' | 'part-time' | 'contract'
  hireDate?: string; jobLevel?: string; salaryGrade?: string; workLocation?: string; shift?: string; phone?: string
}
export interface LeaveRequest {
  id: string; employeeId: string; type: string; startDate: string
  endDate: string; status: LeaveStatus; days: number; reason: string
}
export interface ExceptionEvent {
  id: string; employeeId: string; type: string; severity: ExceptionSeverity
  message: string; timestamp: string; resolved: boolean
}
export interface Notification {
  id: string; type: 'approval' | 'alert' | 'mention' | 'info'
  title: string; body: string; timestamp: string; read: boolean
}
export interface WmsBridgeLog {
  bridgeId: string; bridgeName: string; direction: string
  recordCount: number; status: 'success' | 'error'; timestamp: string
}
export interface ActivityEntry {
  employeeId: string; appName: string; duration: number
  category: 'productive' | 'neutral' | 'unproductive'; timestamp: string
}
export interface ProductivityScore {
  employeeId: string; date: string; score: number
  activeHours: number; idleHours: number; topApp: string
}
export interface LeaveType {
  id: string; name: string; entitlementDays: number
  accrual: 'upfront' | 'monthly'; carryForward: boolean; maxCarryDays: number
  requiresDocument: boolean; approvalRequired: boolean; description: string
}
export interface EmployeeSkill {
  employeeId: string; skillId: string; proficiency: number
  status: SkillStatus; source: 'self' | 'manager'; notes?: string; validatedBy?: string
}
export interface SkillCategory {
  id: string; name: string
  skills: { id: string; name: string }[]
}
export interface CompanyDocument {
  id: string; tenantId: string; title: string; category: DocumentCategory
  accessLevel: DocumentAccessLevel; uploadedBy: string; uploadedAt: string
  assignedTo?: string[]; requiresAcknowledgement: boolean; fileSize: string
}
export interface EmployeeDocument {
  id: string; employeeId: string; documentId: string; status: DocumentStatus
  acknowledgedAt?: string
}
export interface ActivityTimelineEntry {
  id: string; employeeId: string; type: 'hired' | 'promoted' | 'leave' | 'skill_added' | 'transferred' | 'offboarded'
  title: string; description: string; date: string
}
export interface Dependent {
  id: string; employeeId: string; name: string; relationship: string; dob: string
}
