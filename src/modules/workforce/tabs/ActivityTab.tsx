import { activityFeed, screenshots } from '../../../mock/data/activity'
import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'

const categoryColor: Record<string, string> = {
  productive: 'bg-green-500/20 text-green-400',
  neutral: 'bg-blue-500/20 text-blue-400',
  unproductive: 'bg-red-500/20 text-red-400',
}

export function ActivityTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-3">App Usage Feed</div>
          {activityFeed.map((entry, i) => {
            const emp = employees.find(e => e.id === entry.employeeId)
            return (
              <div key={i} className="flex items-center gap-3 mb-3">
                <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white text-sm">{emp?.name} · <span className="text-violet-400">{entry.appName}</span></div>
                  <div className="text-white/40 text-xs">{entry.duration} min</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor[entry.category]}`}>
                  {entry.category}
                </span>
              </div>
            )
          })}
        </GlassCard>
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-3">Screenshots</div>
          <div className="grid grid-cols-2 gap-2">
            {screenshots.map((s, i) => {
              const emp = employees.find(e => e.id === s.employeeId)
              return (
                <div key={i} className="rounded-lg overflow-hidden border border-white/10">
                  <img src={s.url} alt="screenshot" className="w-full" />
                  <div className="p-2 bg-white/5">
                    <div className="text-white/60 text-xs">{emp?.name}</div>
                    <div className="text-white/30 text-xs font-geist">{new Date(s.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
