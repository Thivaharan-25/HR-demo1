export const departments = [
  { id: 'd1', name: 'Engineering', headCount: 6, managerId: 'e2' },
  { id: 'd2', name: 'HR', headCount: 2, managerId: 'e4' },
  { id: 'd3', name: 'Finance', headCount: 1, managerId: 'e5' },
  { id: 'd4', name: 'Marketing', headCount: 1, managerId: 'e7' },
  { id: 'd5', name: 'Operations', headCount: 1, managerId: 'e9' },
]

export const teams = [
  { id: 'tm1', name: 'Platform', departmentId: 'd1', memberIds: ['e1', 'e2', 'e3'] },
  { id: 'tm2', name: 'Mobile', departmentId: 'd1', memberIds: ['e6'] },
  { id: 'tm3', name: 'Backend', departmentId: 'd1', memberIds: ['e8'] },
]
