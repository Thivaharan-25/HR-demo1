import type { SkillCategory, EmployeeSkill } from '../types'

export const skillCategories: SkillCategory[] = [
  {
    id: 'sc1', name: 'Technical', skills: [
      { id: 's1', name: 'React' },
      { id: 's2', name: '.NET / C#' },
      { id: 's3', name: 'PostgreSQL' },
      { id: 's4', name: 'TypeScript' },
      { id: 's5', name: 'Python' },
      { id: 's6', name: 'Docker' },
      { id: 's7', name: 'AWS' },
      { id: 's8', name: 'Kubernetes' },
      { id: 's21', name: 'Node.js' },
      { id: 's22', name: 'GraphQL' },
      { id: 's23', name: 'REST APIs' },
      { id: 's24', name: 'CI/CD' },
    ],
  },
  {
    id: 'sc2', name: 'Soft Skills', skills: [
      { id: 's9', name: 'Leadership' },
      { id: 's10', name: 'Communication' },
      { id: 's11', name: 'Problem Solving' },
      { id: 's12', name: 'Team Collaboration' },
      { id: 's25', name: 'Mentoring' },
      { id: 's26', name: 'Conflict Resolution' },
    ],
  },
  {
    id: 'sc3', name: 'Domain', skills: [
      { id: 's13', name: 'HR Operations' },
      { id: 's14', name: 'Payroll Processing' },
      { id: 's15', name: 'Financial Analysis' },
      { id: 's16', name: 'Recruitment' },
      { id: 's27', name: 'Compliance & Labor Law' },
      { id: 's28', name: 'Sales Strategy' },
    ],
  },
  {
    id: 'sc4', name: 'Management', skills: [
      { id: 's17', name: 'Project Management' },
      { id: 's18', name: 'Agile / Scrum' },
      { id: 's19', name: 'Stakeholder Management' },
      { id: 's20', name: 'Budget Planning' },
      { id: 's29', name: 'OKR / Goal Setting' },
    ],
  },
  {
    id: 'sc5', name: 'Design & UX', skills: [
      { id: 's30', name: 'Figma' },
      { id: 's31', name: 'User Research' },
      { id: 's32', name: 'Prototyping' },
      { id: 's33', name: 'Accessibility (a11y)' },
    ],
  },
]

export const employeeSkills: EmployeeSkill[] = [
  // e1 - Sarah Lim (Full-Stack Tech Lead)
  { employeeId: 'e1', skillId: 's1', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's4', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's21', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's3', proficiency: 3, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's6', proficiency: 3, status: 'pending', source: 'self' },
  { employeeId: 'e1', skillId: 's9', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's10', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e1', skillId: 's25', proficiency: 3, status: 'pending', source: 'self' },

  // e2 - James Rajan (Engineering Manager)
  { employeeId: 'e2', skillId: 's9', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's10', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's17', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's18', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's19', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's1', proficiency: 3, status: 'validated', source: 'self', validatedBy: 'e1' },
  { employeeId: 'e2', skillId: 's29', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e1' },

  // e3 - Aisha Noor (Senior Engineer)
  { employeeId: 'e3', skillId: 's1', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's4', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's3', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's21', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's23', proficiency: 5, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's6', proficiency: 3, status: 'rejected', source: 'self', notes: 'Needs more hands-on experience' },
  { employeeId: 'e3', skillId: 's10', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e3', skillId: 's11', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },

  // e4 - Ravi Kumar (HR Manager)
  { employeeId: 'e4', skillId: 's13', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's16', proficiency: 3, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's27', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's10', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's19', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e4', skillId: 's17', proficiency: 3, status: 'pending', source: 'self' },

  // e5 - Mei Lin (Finance Director)
  { employeeId: 'e5', skillId: 's15', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's14', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's20', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's19', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e5', skillId: 's9', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },

  // e6 - Hafiz Azman (iOS Engineer)
  { employeeId: 'e6', skillId: 's1', proficiency: 2, status: 'pending', source: 'self' },
  { employeeId: 'e6', skillId: 's2', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e6', skillId: 's4', proficiency: 3, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e6', skillId: 's11', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e6', skillId: 's12', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e2' },

  // e8 - Vikram Singh (Backend Lead)
  { employeeId: 'e8', skillId: 's3', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's5', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's6', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's7', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's8', proficiency: 3, status: 'pending', source: 'self' },
  { employeeId: 'e8', skillId: 's21', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's22', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e8', skillId: 's24', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e2' },

  // e9 - Omar Shaikh (IT Ops)
  { employeeId: 'e9', skillId: 's6', proficiency: 3, status: 'validated', source: 'self', validatedBy: 'e2' },
  { employeeId: 'e9', skillId: 's7', proficiency: 3, status: 'pending', source: 'self' },
  { employeeId: 'e9', skillId: 's11', proficiency: 3, status: 'validated', source: 'manager', validatedBy: 'e2' },

  // e11 - Product Lead
  { employeeId: 'e11', skillId: 's17', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e11', skillId: 's18', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e11', skillId: 's19', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },
  { employeeId: 'e11', skillId: 's29', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e1' },
  { employeeId: 'e11', skillId: 's10', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e1' },

  // e12 - UX Designer
  { employeeId: 'e12', skillId: 's30', proficiency: 5, status: 'validated', source: 'manager', validatedBy: 'e11' },
  { employeeId: 'e12', skillId: 's31', proficiency: 5, status: 'validated', source: 'self', validatedBy: 'e11' },
  { employeeId: 'e12', skillId: 's32', proficiency: 4, status: 'validated', source: 'self', validatedBy: 'e11' },
  { employeeId: 'e12', skillId: 's33', proficiency: 3, status: 'pending', source: 'self' },
  { employeeId: 'e12', skillId: 's10', proficiency: 4, status: 'validated', source: 'manager', validatedBy: 'e11' },
]
