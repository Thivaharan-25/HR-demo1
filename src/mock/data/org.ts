export const departments = [
  // Top level
  { id: 'd1', name: 'Engineering', parentId: null, headCount: 12, managerId: 'e2', code: 'ENG', color: '#7C3AED' },
  { id: 'd2', name: 'HR & People', parentId: null, headCount: 4, managerId: 'e4', code: 'HRP', color: '#06b6d4' },
  { id: 'd3', name: 'Finance', parentId: null, headCount: 3, managerId: 'e5', code: 'FIN', color: '#10b981' },
  { id: 'd4', name: 'Marketing', parentId: null, headCount: 3, managerId: 'e7', code: 'MKT', color: '#f59e0b' },
  { id: 'd5', name: 'Operations', parentId: null, headCount: 2, managerId: 'e9', code: 'OPS', color: '#ef4444' },
  { id: 'd6', name: 'Product', parentId: null, headCount: 3, managerId: 'e11', code: 'PRD', color: '#ec4899' },
  { id: 'd7', name: 'Sales', parentId: null, headCount: 3, managerId: 'e14', code: 'SLS', color: '#f97316' },
  // Sub-departments
  { id: 'd8', name: 'Platform', parentId: 'd1', headCount: 4, managerId: 'e2', code: 'ENG-PLT', color: '#7C3AED' },
  { id: 'd9', name: 'Mobile', parentId: 'd1', headCount: 2, managerId: 'e6', code: 'ENG-MOB', color: '#7C3AED' },
  { id: 'd10', name: 'Infrastructure', parentId: 'd1', headCount: 2, managerId: 'e21', code: 'ENG-INF', color: '#7C3AED' },
  { id: 'd11', name: 'QA & Security', parentId: 'd1', headCount: 2, managerId: 'e23', code: 'ENG-QS', color: '#7C3AED' },
  { id: 'd12', name: 'Talent Acquisition', parentId: 'd2', headCount: 2, managerId: 'e4', code: 'HRP-TA', color: '#06b6d4' },
  { id: 'd13', name: 'People Ops', parentId: 'd2', headCount: 2, managerId: 'e16', code: 'HRP-PO', color: '#06b6d4' },
]

export const teams = [
  { id: 'tm1', name: 'Platform Core', departmentId: 'd8', leadId: 'e2', memberIds: ['e2', 'e3', 'e8', 'e22'] },
  { id: 'tm2', name: 'Mobile Apps', departmentId: 'd9', leadId: 'e6', memberIds: ['e6', 'e20'] },
  { id: 'tm3', name: 'DevOps & Infra', departmentId: 'd10', leadId: 'e21', memberIds: ['e21', 'e26'] },
  { id: 'tm4', name: 'QA', departmentId: 'd11', leadId: 'e23', memberIds: ['e23'] },
  { id: 'tm5', name: 'Security', departmentId: 'd11', leadId: 'e28', memberIds: ['e28'] },
  { id: 'tm6', name: 'Recruitment', departmentId: 'd12', leadId: 'e4', memberIds: ['e4', 'e10'] },
  { id: 'tm7', name: 'HR Ops', departmentId: 'd13', leadId: 'e16', memberIds: ['e16', 'e17'] },
  { id: 'tm8', name: 'FP&A', departmentId: 'd3', leadId: 'e5', memberIds: ['e5', 'e18'] },
  { id: 'tm9', name: 'Payroll', departmentId: 'd3', leadId: 'e19', memberIds: ['e19'] },
  { id: 'tm10', name: 'Growth', departmentId: 'd4', leadId: 'e7', memberIds: ['e7', 'e24'] },
  { id: 'tm11', name: 'Brand & Design', departmentId: 'd4', leadId: 'e25', memberIds: ['e25'] },
  { id: 'tm12', name: 'Core Product', departmentId: 'd6', leadId: 'e11', memberIds: ['e11', 'e13'] },
  { id: 'tm13', name: 'UX Design', departmentId: 'd6', leadId: 'e12', memberIds: ['e12'] },
  { id: 'tm14', name: 'IT Support', departmentId: 'd5', leadId: 'e9', memberIds: ['e9', 'e26'] },
  { id: 'tm15', name: 'Enterprise Sales', departmentId: 'd7', leadId: 'e14', memberIds: ['e14', 'e27'] },
  { id: 'tm16', name: 'Customer Success', departmentId: 'd7', leadId: 'e15', memberIds: ['e15'] },
]

export const locations = [
  { id: 'loc1', name: 'HQ - Kuala Lumpur', country: 'Malaysia', address: 'Level 28, Menara Maxis, KLCC, 50088 KL', legalEntityId: 'le1', employees: 20, type: 'headquarters' },
  { id: 'loc2', name: 'Singapore Office', country: 'Singapore', address: '1 Raffles Place, #40-02, Singapore 048616', legalEntityId: 'le2', employees: 5, type: 'regional' },
  { id: 'loc3', name: 'Remote - Malaysia', country: 'Malaysia', address: 'Distributed', legalEntityId: 'le1', employees: 3, type: 'remote' },
]

export const jobFamilies = [
  {
    id: 'jf1', name: 'Engineering', code: 'ENG', headCount: 12,
    levels: [
      { id: 'jl1', code: 'L1', title: 'Associate Engineer', rank: 1 },
      { id: 'jl2', code: 'L2', title: 'Junior Engineer', rank: 2 },
      { id: 'jl3', code: 'L3', title: 'Engineer', rank: 3 },
      { id: 'jl4', code: 'L4', title: 'Senior Engineer', rank: 4 },
      { id: 'jl5', code: 'L5', title: 'Staff Engineer', rank: 5 },
      { id: 'jl6', code: 'L6', title: 'Principal Engineer', rank: 6 },
      { id: 'jl7', code: 'L7', title: 'Distinguished Engineer', rank: 7 },
    ],
    requiredSkills: [
      { skillId: 's1', skillName: 'React', minProficiency: 3 },
      { skillId: 's4', skillName: 'TypeScript', minProficiency: 3 },
      { skillId: 's3', skillName: 'PostgreSQL', minProficiency: 2 },
      { skillId: 's6', skillName: 'Docker', minProficiency: 2 },
    ],
  },
  {
    id: 'jf2', name: 'Human Resources', code: 'HR', headCount: 4,
    levels: [
      { id: 'jl8', code: 'L1', title: 'HR Coordinator', rank: 1 },
      { id: 'jl9', code: 'L2', title: 'HR Associate', rank: 2 },
      { id: 'jl10', code: 'L3', title: 'HR Specialist', rank: 3 },
      { id: 'jl11', code: 'L4', title: 'HR Business Partner', rank: 4 },
      { id: 'jl12', code: 'L5', title: 'HR Manager', rank: 5 },
    ],
    requiredSkills: [
      { skillId: 's13', skillName: 'HR Operations', minProficiency: 3 },
      { skillId: 's16', skillName: 'Recruitment', minProficiency: 2 },
      { skillId: 's10', skillName: 'Communication', minProficiency: 4 },
    ],
  },
  {
    id: 'jf3', name: 'Finance', code: 'FIN', headCount: 3,
    levels: [
      { id: 'jl13', code: 'L1', title: 'Finance Associate', rank: 1 },
      { id: 'jl14', code: 'L2', title: 'Finance Analyst', rank: 2 },
      { id: 'jl15', code: 'L3', title: 'Senior Analyst', rank: 3 },
      { id: 'jl16', code: 'L4', title: 'Finance Manager', rank: 4 },
      { id: 'jl17', code: 'L5', title: 'Finance Director', rank: 5 },
    ],
    requiredSkills: [
      { skillId: 's15', skillName: 'Financial Analysis', minProficiency: 3 },
      { skillId: 's14', skillName: 'Payroll Processing', minProficiency: 2 },
    ],
  },
  {
    id: 'jf4', name: 'Marketing', code: 'MKT', headCount: 3,
    levels: [
      { id: 'jl18', code: 'L1', title: 'Marketing Coordinator', rank: 1 },
      { id: 'jl19', code: 'L2', title: 'Marketing Specialist', rank: 2 },
      { id: 'jl20', code: 'L3', title: 'Marketing Manager', rank: 3 },
      { id: 'jl21', code: 'L4', title: 'Marketing Lead', rank: 4 },
      { id: 'jl22', code: 'L5', title: 'Marketing Director', rank: 5 },
    ],
    requiredSkills: [
      { skillId: 's10', skillName: 'Communication', minProficiency: 3 },
      { skillId: 's11', skillName: 'Problem Solving', minProficiency: 2 },
    ],
  },
  {
    id: 'jf5', name: 'Product', code: 'PRD', headCount: 3,
    levels: [
      { id: 'jl23', code: 'L1', title: 'Associate PM', rank: 1 },
      { id: 'jl24', code: 'L2', title: 'Product Manager', rank: 2 },
      { id: 'jl25', code: 'L3', title: 'Senior PM', rank: 3 },
      { id: 'jl26', code: 'L4', title: 'Head of Product', rank: 4 },
    ],
    requiredSkills: [
      { skillId: 's17', skillName: 'Project Management', minProficiency: 3 },
      { skillId: 's18', skillName: 'Agile / Scrum', minProficiency: 3 },
      { skillId: 's19', skillName: 'Stakeholder Management', minProficiency: 3 },
    ],
  },
  {
    id: 'jf6', name: 'Sales', code: 'SLS', headCount: 3,
    levels: [
      { id: 'jl27', code: 'L1', title: 'Sales Development Rep', rank: 1 },
      { id: 'jl28', code: 'L2', title: 'Account Executive', rank: 2 },
      { id: 'jl29', code: 'L3', title: 'Senior AE', rank: 3 },
      { id: 'jl30', code: 'L4', title: 'Sales Lead', rank: 4 },
      { id: 'jl31', code: 'L5', title: 'Sales Director', rank: 5 },
    ],
    requiredSkills: [
      { skillId: 's10', skillName: 'Communication', minProficiency: 4 },
      { skillId: 's19', skillName: 'Stakeholder Management', minProficiency: 3 },
    ],
  },
  {
    id: 'jf7', name: 'Operations', code: 'OPS', headCount: 2,
    levels: [
      { id: 'jl32', code: 'L1', title: 'Ops Associate', rank: 1 },
      { id: 'jl33', code: 'L2', title: 'Ops Coordinator', rank: 2 },
      { id: 'jl34', code: 'L3', title: 'Ops Specialist', rank: 3 },
      { id: 'jl35', code: 'L4', title: 'Ops Manager', rank: 4 },
    ],
    requiredSkills: [
      { skillId: 's11', skillName: 'Problem Solving', minProficiency: 3 },
      { skillId: 's12', skillName: 'Team Collaboration', minProficiency: 3 },
    ],
  },
]

export const legalEntities = [
  { id: 'le1', name: 'NEXUS Technologies Sdn Bhd', country: 'Malaysia', countryCode: 'MY', regNo: '202001012345', currency: 'MYR', status: 'active', employees: 23 },
  { id: 'le2', name: 'NEXUS Singapore Pte Ltd', country: 'Singapore', countryCode: 'SG', regNo: '202012345A', currency: 'SGD', status: 'active', employees: 5 },
  { id: 'le3', name: 'NEXUS Indonesia PT', country: 'Indonesia', countryCode: 'ID', regNo: '2020-012345', currency: 'IDR', status: 'pending', employees: 0 },
]

export const costCenters = [
  { id: 'cc1', code: 'CC-ENG', name: 'Engineering', owner: 'James Rajan', budget: 'MYR 850,000', utilised: 62 },
  { id: 'cc2', code: 'CC-HR', name: 'Human Resources', owner: 'Ravi Kumar', budget: 'MYR 320,000', utilised: 45 },
  { id: 'cc3', code: 'CC-FIN', name: 'Finance', owner: 'Priya Devi', budget: 'MYR 280,000', utilised: 70 },
  { id: 'cc4', code: 'CC-MKT', name: 'Marketing', owner: 'Nurul Ain', budget: 'MYR 400,000', utilised: 88 },
  { id: 'cc5', code: 'CC-OPS', name: 'Operations', owner: 'Tan Wei Lin', budget: 'MYR 180,000', utilised: 31 },
  { id: 'cc6', code: 'CC-PRD', name: 'Product', owner: 'Chen Wei', budget: 'MYR 220,000', utilised: 54 },
  { id: 'cc7', code: 'CC-SLS', name: 'Sales', owner: 'Daniel Foo', budget: 'MYR 600,000', utilised: 76 },
]
