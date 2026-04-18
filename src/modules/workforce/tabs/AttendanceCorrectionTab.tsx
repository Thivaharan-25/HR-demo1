import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'

const corrections = [
  { id: 'ac1', employeeId: 'e4', date: '2026-04-15', clockIn: '09:00', clockOut: '18:00', original: 'Missing clock-out', reason: 'Forgot to clock out — was at client site', status: 'pending', submittedAt: '2026-04-16' },
  { id: 'ac2', employeeId: 'e8', date: '2026-04-14', clockIn: '08:45', clockOut: '18:15', original: 'Missing clock-in', reason: 'Biometric reader offline at main entrance', status: 'approved', submittedAt: '2026-04-15' },
  { id: 'ac3', employeeId: 'e6', date: '2026-04-12', clockIn: '10:00', clockOut: '19:00', original: 'Incorrect time recorded', reason: 'System recorded wrong time — was working from 10:00', status: 'pending', submittedAt: '2026-04-13' },
  { id: 'ac4', employeeId: 'e3', date: '2026-04-10', clockIn: '09:05', clockOut: '18:30', original: 'Missing entry', reason: 'NFC card not reading at new terminal', status: 'rejected', submittedAt: '2026-04-11' },
]

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function AttendanceCorrectionTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-white/40 text-sm font-outfit">{corrections.filter(c => c.status === 'pending').length} pending corrections</div>
        <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
          + Submit Correction
        </button>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Employee</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Corrected Time</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Original Issue</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {corrections.map(c => {
              const emp = employees.find(e => e.id === c.employeeId)
              return (
                <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full border border-white/10" />
                      <span className="text-white/80 text-sm font-outfit">{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/55 text-sm font-geist">{c.date}</td>
                  <td className="px-4 py-3 text-white/55 text-sm font-geist">{c.clockIn} – {c.clockOut}</td>
                  <td className="px-4 py-3 text-white/40 text-xs max-w-[180px] truncate">{c.original}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {c.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">Approve</button>
                        <button className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
