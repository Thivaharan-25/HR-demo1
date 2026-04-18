import { Routes, Route, useNavigate } from 'react-router-dom'
import { employees } from '../../../mock/data/employees'
import { useLiveStore } from '../../../store/liveStore'
import { GlassCard } from '../../../components/ui/GlassCard'
import { EmployeeDetailPage } from './EmployeeDetailPage'

const statusColor: Record<string, string> = {
  online: 'text-green-400', break: 'text-yellow-400', offline: 'text-gray-400', 'clocked-out': 'text-red-400',
}

function EmployeeList() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-outfit font-bold text-white">Employees</h1>
        <button className="px-4 py-2 bg-violet-600 rounded-lg text-white text-sm font-outfit hover:bg-violet-700 transition-colors">
          + Add Employee
        </button>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-white/40 text-sm font-outfit">Employee</th>
              <th className="text-left p-4 text-white/40 text-sm font-outfit">Department</th>
              <th className="text-left p-4 text-white/40 text-sm font-outfit">Job Title</th>
              <th className="text-left p-4 text-white/40 text-sm font-outfit">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr
                key={emp.id}
                onClick={() => navigate(emp.id)}
                className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="text-white text-sm">{emp.name}</div>
                      <div className="text-white/40 text-xs">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-white/70 text-sm">{emp.department}</td>
                <td className="p-4 text-white/70 text-sm">{emp.jobTitle}</td>
                <td className={`p-4 text-sm capitalize font-geist ${statusColor[presenceStatuses[emp.id] ?? 'offline']}`}>
                  {presenceStatuses[emp.id] ?? 'offline'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}

export function EmployeesPage() {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path=":id" element={<EmployeeDetailPage />} />
    </Routes>
  )
}
