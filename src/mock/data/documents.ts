import type { CompanyDocument, EmployeeDocument } from '../types'

export const companyDocuments: CompanyDocument[] = [
  { id: 'd1', tenantId: 't1', title: 'Employee Handbook 2026', category: 'Policy', accessLevel: 'Public', uploadedBy: 'e1', uploadedAt: '2026-01-15', requiresAcknowledgement: true, fileSize: '2.4 MB' },
  { id: 'd2', tenantId: 't1', title: 'Employment Contract — Aisha Noor', category: 'Contract', accessLevel: 'Individual', uploadedBy: 'e1', uploadedAt: '2022-01-10', assignedTo: ['e3'], requiresAcknowledgement: true, fileSize: '512 KB' },
  { id: 'd3', tenantId: 't1', title: 'Remote Work Policy', category: 'Policy', accessLevel: 'Public', uploadedBy: 'e1', uploadedAt: '2026-02-01', requiresAcknowledgement: true, fileSize: '1.1 MB' },
  { id: 'd4', tenantId: 't1', title: 'Data Protection & Privacy Policy', category: 'Policy', accessLevel: 'Public', uploadedBy: 'e1', uploadedAt: '2026-03-01', requiresAcknowledgement: false, fileSize: '890 KB' },
  { id: 'd5', tenantId: 't1', title: 'Engineering Department Guidelines', category: 'General', accessLevel: 'Department', uploadedBy: 'e2', uploadedAt: '2026-02-15', requiresAcknowledgement: false, fileSize: '340 KB' },
  { id: 'd6', tenantId: 't1', title: 'Performance Review Certificate — Q1 2026', category: 'Certificate', accessLevel: 'Individual', uploadedBy: 'e1', uploadedAt: '2026-04-01', assignedTo: ['e3', 'e6'], requiresAcknowledgement: false, fileSize: '200 KB' },
]

export const employeeDocuments: EmployeeDocument[] = [
  { id: 'ed1', employeeId: 'e3', documentId: 'd1', status: 'acknowledged', acknowledgedAt: '2026-01-20' },
  { id: 'ed2', employeeId: 'e3', documentId: 'd2', status: 'acknowledged', acknowledgedAt: '2022-01-12' },
  { id: 'ed3', employeeId: 'e3', documentId: 'd3', status: 'pending_acknowledgement' },
  { id: 'ed4', employeeId: 'e3', documentId: 'd4', status: 'no_action' },
  { id: 'ed5', employeeId: 'e3', documentId: 'd6', status: 'no_action' },
  { id: 'ed6', employeeId: 'e6', documentId: 'd1', status: 'pending_acknowledgement' },
  { id: 'ed7', employeeId: 'e6', documentId: 'd3', status: 'acknowledged', acknowledgedAt: '2026-02-03' },
  { id: 'ed8', employeeId: 'e6', documentId: 'd6', status: 'no_action' },
]
