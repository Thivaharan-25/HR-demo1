import { useState } from 'react'
import { employees } from '../../../mock/data/employees'
import { cn } from '../../../lib/utils'

const clockData = [
  { employeeId: 'e1', clockIn: '08:58', clockOut: 'Active', breakMins: 0, totalHours: 7.2, statusType: 'on-time' },
  { employeeId: 'e2', clockIn: '09:02', clockOut: 'Active', breakMins: 0, totalHours: 6.5, statusType: 'on-time' },
  { employeeId: 'e3', clockIn: '09:00', clockOut: 'Active', breakMins: 15, totalHours: 7.0, statusType: 'on-time' },
  { employeeId: 'e4', clockIn: '09:45', clockOut: 'Active', breakMins: 30, totalHours: 5.0, statusType: 'late' },
  { employeeId: 'e5', clockIn: '—', clockOut: '—', breakMins: 0, totalHours: 0, statusType: 'absent' },
  { employeeId: 'e6', clockIn: '08:55', clockOut: 'Active', breakMins: 0, totalHours: 6.8, statusType: 'on-time' },
  { employeeId: 'e7', clockIn: '09:01', clockOut: 'Active', breakMins: 0, totalHours: 6.9, statusType: 'on-time' },
  { employeeId: 'e8', clockIn: '—', clockOut: '18:00', breakMins: 60, totalHours: 8.0, statusType: 'clocked-out' },
  { employeeId: 'e9', clockIn: '08:30', clockOut: 'Active', breakMins: 30, totalHours: 7.5, statusType: 'on-time' },
  { employeeId: 'e10', clockIn: '09:15', clockOut: 'Active', breakMins: 0, totalHours: 6.0, statusType: 'on-time' },
]

const statusBadge: Record<string, string> = {
  'on-time': 'bg-green-500/20 text-green-400',
  late: 'bg-amber-500/20 text-amber-400',
  absent: 'bg-red-500/20 text-red-400',
  'clocked-out': 'bg-white/10 text-white/40',
}

const statusLabel: Record<string, string> = {
  'on-time': 'On Time', late: 'Late', absent: 'Absent', 'clocked-out': 'Clocked Out',
}

const depts = ['All', ...new Set(employees.map(e => e.department))]

export function PresenceTab() {
  const [dept, setDept] = useState('All')

  const filtered = clockData.filter(row => {
    if (dept === 'All') return true
    const emp = employees.find(e => e.id === row.employeeId)
    return emp?.department === dept
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={dept} onChange={e => setDept(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          {depts.map(d => <option key={d} value={d} className="bg-[#12111a]">{d}</option>)}
        </select>
        <div className="text-white/30 text-sm">{filtered.length} employees</div>
      </div>
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-white/30 text-xs uppercase tracking-wide">
              {['Employee', 'Department', 'Clock-In', 'Clock-Out', 'Break', 'Total Hours', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => {
              const emp = employees.find(e => e.id === row.employeeId)
              return (
                <tr key={row.employeeId} className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={emp?.avatar} alt="" className="w-7 h-7 rounded-full" />
                      <span className="text-white/80">{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50">{emp?.department}</td>
                  <td className="px-4 py-3 text-white/70 font-geist">{row.clockIn}</td>
                  <td className={cn('px-4 py-3 font-geist', row.clockOut === 'Active' ? 'text-green-400' : 'text-white/50')}>{row.clockOut}</td>
                  <td className="px-4 py-3 text-white/40 font-geist">{row.breakMins ? `${row.breakMins}m` : '—'}</td>
                  <td className="px-4 py-3 text-white font-geist">{row.totalHours ? `${row.totalHours}h` : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', statusBadge[row.statusType])}>
                      {statusLabel[row.statusType]}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
