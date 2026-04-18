import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'

const overtimeRequests = [
  { id: 'ot1', employeeId: 'e3', date: '2026-04-17', hours: 2.5, reason: 'Production incident hotfix', compensationType: 'time-off', status: 'approved', approvedBy: 'e2' },
  { id: 'ot2', employeeId: 'e6', date: '2026-04-16', hours: 3, reason: 'Mobile app release build', compensationType: 'paid', status: 'pending', approvedBy: null },
  { id: 'ot3', employeeId: 'e8', date: '2026-04-15', hours: 4, reason: 'Backend migration weekend work', compensationType: 'paid', status: 'approved', approvedBy: 'e2' },
  { id: 'ot4', employeeId: 'e4', date: '2026-04-14', hours: 1.5, reason: 'Year-end HR audit preparation', compensationType: 'time-off', status: 'pending', approvedBy: null },
]

const totalApprovedHours = overtimeRequests.filter(o => o.status === 'approved').reduce((sum, o) => sum + o.hours, 0)

const statusColor: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export function OvertimeTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Approvals', value: overtimeRequests.filter(o => o.status === 'pending').length, color: 'text-amber-400' },
          { label: 'Approved This Month', value: `${totalApprovedHours}h`, color: 'text-green-400' },
          { label: 'Total Requests', value: overtimeRequests.length, color: 'text-white/85' },
        ].map(s => (
          <GlassCard key={s.label} className="!py-3">
            <div className="text-white/35 text-[11px] font-outfit uppercase tracking-wider">{s.label}</div>
            <div className={`text-xl font-geist font-semibold mt-1 ${s.color}`}>{s.value}</div>
          </GlassCard>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="text-white/40 text-sm font-outfit">Overtime Requests</div>
        <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
          + Log Overtime
        </button>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Employee</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Hours</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Reason</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Compensation</th>
              <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {overtimeRequests.map(ot => {
              const emp = employees.find(e => e.id === ot.employeeId)
              const approver = employees.find(e => ot.approvedBy != null && e.id === ot.approvedBy)
              return (
                <tr key={ot.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full border border-white/10" />
                      <span className="text-white/80 text-sm font-outfit">{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/55 text-sm font-geist">{ot.date}</td>
                  <td className="px-4 py-3 text-violet-400 text-sm font-geist font-semibold">{ot.hours}h</td>
                  <td className="px-4 py-3 text-white/40 text-xs max-w-[160px] truncate">{ot.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${ot.compensationType === 'paid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                      {ot.compensationType === 'paid' ? 'Paid' : 'Time Off'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor[ot.status]}`}>{ot.status}</span>
                      {approver && <div className="text-white/20 text-[10px] mt-0.5">by {approver.name.split(' ')[0]}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {ot.status === 'pending' && (
                      <button className="text-xs px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors">Approve</button>
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
