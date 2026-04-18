import type { SkillCategory, EmployeeSkill } from '../types'

export const skillCategories: SkillCategory[] = [
  { id: 'sc1', name: 'Technical', skills: [
    { id: 's1', name: 'React' },
    { id: 's2', name: '.NET' },
    { id: 's3', name: 'PostgreSQL' },
    { id: 's4', name: 'TypeScript' },
    { id: 's5', name: 'Python' },
    { id: 's6', name: 'Docker' },
    { id: 's7', name: 'AWS' },
    { id: 's8', name: 'Kubernetes' },
  ]},
  { id: 'sc2', name: 'Soft Skills', skills: [
    { id: 's9', name: 'Leadership' },
    { id: 's10', name: 'Communication' },
    { id: 's11', name: 'Problem Solving' },
    { id: 's12', name: 'Team Collaboration' },
  ]},
  { id: 'sc3', name: 'Domain', skills: [
    { id: 's13', name: 'HR Operations' },
    { id: 's14', name: 'Payroll Processing' },
    { id: 's15', name: 'Financial Analysis' },
    { id: 's16', name: 'Recruitment' },
  ]},
  { id: 'sc4', name: 'Management', skills: [
    { id: 's17', name: 'Project Management' },
    { id: 's18', name: 'Agile / Scrum' },
    { id: 's19', name: 'Stakeholder Management' },
    { id: 's20', name: 'Budget Planning' },
  ]},
]

export const employeeSkills: EmployeeSkill[] = [
  { employeeId: 'e3', skillId: 's1', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's2', proficiency: 3, status: 'pending', source: 'self' },
  { employeeId: 'e3', skillId: 's3', proficiency: 2, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's4', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's6', proficiency: 2, status: 'rejected', source: 'self', notes: 'Needs more hands-on experience' },
  { employeeId: 'e2', skillId: 's9', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's10', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's17', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's18', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e6', skillId: 's1', proficiency: 3, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e6', skillId: 's2', proficiency: 4, status: 'pending', source: 'self' },
  { employeeId: 'e4', skillId: 's13', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's16', proficiency: 3, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's15', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's14', proficiency: 3, status: 'pending', source: 'self' },
]
