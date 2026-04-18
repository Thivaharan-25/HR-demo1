import { employees } from '../../../mock/data/employees'
import { biometricEvents } from '../../../mock/data/presence'
import { useLiveStore } from '../../../store/liveStore'
import { GlassCard } from '../../../components/ui/GlassCard'

const statusColor: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-yellow-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}

export function OnlineStatusTab() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)

  const grouped = {
    online: employees.filter(e => presenceStatuses[e.id] === 'online'),
    break: employees.filter(e => presenceStatuses[e.id] === 'break'),
    offline: employees.filter(e => ['offline', 'clocked-out'].includes(presenceStatuses[e.id] ?? '')),
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(grouped) as [string, typeof employees][]).map(([status, emps]) => (
          <GlassCard key={status}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${statusColor[status] ?? 'bg-gray-500'}`} />
              <span className="text-white/70 font-outfit capitalize">{status}</span>
              <span className="text-white/40 text-sm ml-auto">{emps.length}</span>
            </div>
            {emps.map(emp => (
              <div key={emp.id} className="flex items-center gap-2 mb-2">
                <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full" />
                <span className="text-white/80 text-sm">{emp.name}</span>
              </div>
            ))}
          </GlassCard>
        ))}
      </div>
      {liveExceptions.length > 0 && (
        <GlassCard glow>
          <div className="font-outfit font-semibold text-white/70 mb-3">Live Alerts</div>
          {liveExceptions.slice(0, 5).map(ex => (
            <div key={ex.id} className="flex items-start gap-3 mb-3 p-2 rounded-lg bg-white/5">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                ex.severity === 'critical' ? 'bg-red-400' :
                ex.severity === 'high' ? 'bg-orange-400' :
                ex.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <div>
                <div className="text-white text-sm">{ex.type}</div>
                <div className="text-white/40 text-xs">{ex.message}</div>
              </div>
            </div>
          ))}
        </GlassCard>
      )}
      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-3">Biometric Events</div>
        {biometricEvents.map((ev, i) => {
          const emp = employees.find(e => e.id === ev.employeeId)
          return (
            <div key={i} className="flex items-center gap-3 mb-2">
              <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full" />
              <span className="text-white/70 text-sm">{emp?.name}</span>
              <span className="text-white/40 text-xs capitalize">{ev.type}</span>
              <span className={`ml-auto text-xs font-geist ${ev.result === 'verified' ? 'text-green-400' : 'text-red-400'}`}>
                {ev.result}
              </span>
            </div>
          )
        })}
      </GlassCard>
    </div>
  )
}
