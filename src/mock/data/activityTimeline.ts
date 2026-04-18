import type { ActivityTimelineEntry, Dependent } from '../types'

export const activityTimeline: ActivityTimelineEntry[] = [
  { id: 'at1', employeeId: 'e3', type: 'hired', title: 'Joined Nexus Corp', description: 'Started as Software Engineer on the Platform team', date: '2022-01-10' },
  { id: 'at2', employeeId: 'e3', type: 'skill_added', title: 'Skill Added: React', description: 'React proficiency validated at Advanced level by James Rajan', date: '2022-06-15' },
  { id: 'at3', employeeId: 'e3', type: 'leave', title: 'Annual Leave Taken', description: '5 days annual leave', date: '2023-08-07' },
  { id: 'at4', employeeId: 'e3', type: 'promoted', title: 'Promoted to L4', description: 'Promotion from L3 to L4 effective immediately', date: '2024-01-01' },
  { id: 'at5', employeeId: 'e3', type: 'skill_added', title: 'Skill Added: TypeScript', description: 'TypeScript proficiency validated at Advanced level', date: '2024-03-20' },
  { id: 'at6', employeeId: 'e2', type: 'hired', title: 'Joined Nexus Corp', description: 'Started as Engineering Manager on the Platform team', date: '2021-06-01' },
  { id: 'at7', employeeId: 'e2', type: 'promoted', title: 'Promoted to L6', description: 'Promotion from L5 to L6, Engineering Manager role', date: '2023-01-01' },
]

export const dependents: Dependent[] = [
  { id: 'dep1', employeeId: 'e3', name: 'Ahmad Noor', relationship: 'Spouse', dob: '1991-03-22' },
  { id: 'dep2', employeeId: 'e3', name: 'Zara Noor', relationship: 'Child', dob: '2018-07-14' },
  { id: 'dep3', employeeId: 'e2', name: 'Preethi Rajan', relationship: 'Spouse', dob: '1988-11-05' },
  { id: 'dep4', employeeId: 'e2', name: 'Arjun Rajan', relationship: 'Child', dob: '2015-02-28' },
]
