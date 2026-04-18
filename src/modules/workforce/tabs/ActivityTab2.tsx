import { useState } from 'react'
import { employees } from '../../../mock/data/employees'
import { productivityScores } from '../../../mock/data/analytics'
import { activityFeed } from '../../../mock/data/activity'
import { GlassCard } from '../../../components/ui/GlassCard'
import { cn } from '../../../lib/utils'

const categoryColors: Record<string, string> = {
  productive: 'bg-green-500/30 border-green-500/20',
  neutral: 'bg-white/10 border-white/[0.07]',
  unproductive: 'bg-red-500/30 border-red-500/20',
}

export function ActivityTab2() {
  const [selectedEmp, setSelectedEmp] = useState('e1')
  const [date, setDate] = useState('2026-04-18')

  const score = productivityScores.find(p => p.employeeId === selectedEmp)
  const activity = activityFeed.filter(a => a.employeeId === selectedEmp)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          {employees.map(e => <option key={e.id} value={e.id} className="bg-[#12111a]">{e.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
      </div>

      {score && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Productive Hrs', value: `${score.activeHours}h`, color: 'text-green-400' },
            { label: 'Idle Hrs', value: `${score.idleHours}h`, color: 'text-amber-400' },
            { label: 'Top App', value: score.topApp, color: 'text-white' },
            { label: 'Productivity', value: `${score.score}%`, color: 'text-violet-400' },
          ].map(({ label, value, color }) => (
            <GlassCard key={label}>
              <div className="text-white/40 text-xs font-outfit">{label}</div>
              <div className={cn('text-xl font-geist font-bold mt-1', color)}>{value}</div>
            </GlassCard>
          ))}
        </div>
      )}

      {activity.length > 0 && (
        <GlassCard>
          <div className="text-white/50 text-sm font-outfit font-semibold mb-4">App Usage Timeline</div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {activity.map((entry, i) => {
              const width = Math.max(60, Math.min(200, entry.duration))
              return (
                <div key={i} className={cn('flex-shrink-0 rounded-lg border p-2', categoryColors[entry.category])}
                  style={{ width }}>
                  <div className="text-white text-xs font-medium truncate">{entry.appName}</div>
                  <div className="text-white/40 text-[10px] mt-1">{entry.duration}m</div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <div className="text-white/50 text-sm font-outfit font-semibold mb-4">Screenshots</div>
        <div className="flex gap-3 flex-wrap">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-32 h-20 bg-white/[0.02] border border-white/[0.07] rounded-lg flex items-center justify-center text-white/20 text-xs">
              Screenshot {i}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
