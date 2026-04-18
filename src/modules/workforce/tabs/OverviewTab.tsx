import { employees } from '../../../mock/data/employees'
import { productivityScores } from '../../../mock/data/analytics'
import { useLiveStore } from '../../../store/liveStore'
import { GlassCard } from '../../../components/ui/GlassCard'
import { cn } from '../../../lib/utils'

const dotColors: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-amber-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}

function fmtHours(h: number) {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  return `${hrs}h ${mins}m`
}

export function OverviewTab() {
  const presenceStatuses = useLiveStore(s => s.presenceStatuses)

  return (
    <div className="grid grid-cols-5 gap-3">
      {employees.map(emp => {
        const status = presenceStatuses[emp.id] ?? 'offline'
        const score = productivityScores.find(p => p.employeeId === emp.id)
        return (
          <GlassCard key={emp.id} className="flex flex-col gap-2">
            <div className="relative w-10 h-10">
              <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full" />
              <div className={cn('absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12111a]', dotColors[status])} />
            </div>
            <div>
              <div className="text-white text-xs font-medium truncate">{emp.name}</div>
              <div className="text-white/40 text-[10px] truncate">{emp.department}</div>
            </div>
            <div className="text-white/50 text-[10px] truncate">{score?.topApp ?? 'Idle'}</div>
            <div className="text-white/40 text-[10px] font-geist">{score ? fmtHours(score.activeHours) : '—'}</div>
            {score && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">Productive</span>
                  <span className="text-white/50 font-geist">{score.score}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${score.score}%` }} />
                </div>
              </div>
            )}
          </GlassCard>
        )
      })}
    </div>
  )
}
