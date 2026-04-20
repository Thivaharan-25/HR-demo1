import { useState } from 'react'
import { employees } from '../../../mock/data/employees'
import { productivityScores } from '../../../mock/data/analytics'
import { activityFeed, appUsageSummary, screenshots } from '../../../mock/data/activity'
import { GlassCard } from '../../../components/ui/GlassCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Monitor, Clock, Zap, Coffee, Camera, ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

const categoryConfig: Record<string, { color: string; bar: string; label: string }> = {
  productive: { color: 'text-green-400', bar: '#22c55e', label: 'Productive' },
  neutral: { color: 'text-sky-400', bar: '#06b6d4', label: 'Neutral' },
  unproductive: { color: 'text-red-400', bar: '#ef4444', label: 'Unproductive' },
}

function HourBlock({ status }: { status: 'active' | 'idle' | 'break' | 'absent' }) {
  const styles: Record<string, string> = {
    active: 'bg-green-500/60 border-green-500/30',
    idle: 'bg-amber-500/40 border-amber-500/30',
    break: 'bg-sky-500/40 border-sky-500/30',
    absent: 'bg-white/[0.03] border-white/[0.06]',
  }
  return <div className={cn('h-6 flex-1 rounded border', styles[status])} title={status} />
}

export function ActivityTab2() {
  const [selectedEmp, setSelectedEmp] = useState('e1')
  const [date, setDate] = useState('2026-04-18')
  const [activeScreen, setActiveScreen] = useState<string | null>(null)

  const score = productivityScores.find(p => p.employeeId === selectedEmp)
  const empScreenshots = screenshots.filter(s => s.employeeId === selectedEmp)
  const appUsage = appUsageSummary[selectedEmp] ?? activityFeed.filter(a => a.employeeId === selectedEmp).map(a => ({
    app: a.appName, minutes: a.duration, category: a.category,
  }))

  const totalMins = appUsage.reduce((s, a) => s + a.minutes, 0)
  const productiveMins = appUsage.filter(a => a.category === 'productive').reduce((s, a) => s + a.minutes, 0)
  const unproductiveMins = appUsage.filter(a => a.category === 'unproductive').reduce((s, a) => s + a.minutes, 0)

  const emp = employees.find(e => e.id === selectedEmp)

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2">
          <img src={emp?.avatar} alt="" className="w-6 h-6 rounded-full" />
          <select
            value={selectedEmp}
            onChange={e => setSelectedEmp(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none"
          >
            {employees.map(e => <option key={e.id} value={e.id} className="bg-[#12111a]">{e.name}</option>)}
          </select>
        </div>
        <input
          type="date" value={date} onChange={e => setDate(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
        />
        <div className="ml-auto text-white/25 text-xs">{emp?.department} · {emp?.team}</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Zap, label: 'Productivity Score', value: score ? `${score.score}%` : '—', sub: 'Today', color: 'text-violet-400', bg: 'bg-violet-500/15 text-violet-400' },
          { icon: Clock, label: 'Active Time', value: score ? `${score.activeHours}h` : '—', sub: `${Math.round((productiveMins / Math.max(totalMins, 1)) * 100)}% productive`, color: 'text-green-400', bg: 'bg-green-500/15 text-green-400' },
          { icon: Coffee, label: 'Idle Time', value: score ? `${score.idleHours}h` : '—', sub: 'Auto-detected breaks', color: 'text-amber-400', bg: 'bg-amber-500/15 text-amber-400' },
          { icon: Monitor, label: 'Top App', value: score?.topApp ?? '—', sub: `${appUsage[0]?.minutes ?? 0}m tracked`, color: 'text-white/80', bg: 'bg-white/5 text-white/40' },
        ].map(card => {
          const Icon = card.icon
          return (
            <GlassCard key={card.label} className="hover:border-white/[0.14] transition-all">
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-3', card.bg)}>
                <Icon size={13} />
              </div>
              <div className={cn('text-2xl font-bold font-geist', card.color)}>{card.value}</div>
              <div className="text-white/40 text-[11px] mt-0.5">{card.label}</div>
              <div className="text-white/25 text-[10px]">{card.sub}</div>
            </GlassCard>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* App Usage Chart */}
        <GlassCard className="col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">App Usage Breakdown</div>
            <div className="flex gap-3 text-[10px]">
              {Object.entries(categoryConfig).map(([k, v]) => (
                <div key={k} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.bar }} />
                  <span className="text-white/35">{v.label}</span>
                </div>
              ))}
            </div>
          </div>
          {appUsage.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={appUsage} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fill: '#ffffff25', fontSize: 9 }} axisLine={false} tickLine={false} unit="m" />
                <YAxis type="category" dataKey="app" tick={{ fill: '#ffffff55', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  contentStyle={{ background: '#131220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 }}
                  formatter={(val: number, _name: string, entry: { payload?: { category: string } }) => [`${val}m`, entry.payload?.category ?? '']}
                />
                <Bar dataKey="minutes" radius={3}>
                  {appUsage.map((entry, i) => (
                    <Cell key={i} fill={categoryConfig[entry.category]?.bar ?? '#7C3AED'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-white/25 text-sm">No app data for this employee</div>
          )}
        </GlassCard>

        {/* App list */}
        <GlassCard className="col-span-2">
          <div className="text-white/70 font-semibold text-sm mb-4">Time by App</div>
          <div className="space-y-2.5">
            {appUsage.slice(0, 6).map((entry, i) => {
              const pct = Math.round((entry.minutes / Math.max(totalMins, 1)) * 100)
              const cfg = categoryConfig[entry.category]
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/70 text-xs truncate">{entry.app}</span>
                    <span className="text-white/40 text-[10px] font-geist shrink-0 ml-2">{entry.minutes}m</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cfg?.bar }} />
                  </div>
                </div>
              )
            })}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
              <span className="text-white/25">Total tracked</span>
              <span className="text-white/45 font-geist">{totalMins}m</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Hourly timeline */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="text-white/70 font-semibold text-sm">Activity Timeline</div>
          <div className="flex gap-3 text-[10px]">
            {[
              { label: 'Active', color: 'bg-green-500/60' },
              { label: 'Idle', color: 'bg-amber-500/40' },
              { label: 'Break', color: 'bg-sky-500/40' },
              { label: 'Absent', color: 'bg-white/[0.03]' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1">
                <span className={cn('w-3 h-2 rounded', l.color)} />
                <span className="text-white/35">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1">
          {Array.from({ length: 24 }, (_, h) => {
            let status: 'active' | 'idle' | 'break' | 'absent' = 'absent'
            if (h >= 9 && h <= 17) {
              if (h === 13) status = 'break'
              else if (h === 12 || h === 17) status = 'idle'
              else status = 'active'
            }
            return (
              <div key={h} className="flex flex-col items-center gap-1 flex-1">
                <HourBlock status={status} />
                {h % 3 === 0 && <span className="text-[8px] text-white/20 font-geist">{h}:00</span>}
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Screenshots */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white/70 font-semibold text-sm">
            <Camera size={14} className="text-white/30" />
            Screenshots
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/30 font-geist">{empScreenshots.length}</span>
          </div>
          <span className="text-white/25 text-xs">Scheduled & random captures</span>
        </div>

        {empScreenshots.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {empScreenshots.map(ss => (
              <div
                key={ss.id}
                onClick={() => setActiveScreen(activeScreen === ss.id ? null : ss.id)}
                className={cn(
                  'group relative rounded-xl overflow-hidden cursor-pointer border transition-all',
                  activeScreen === ss.id
                    ? 'border-violet-500/50 shadow-[0_0_12px_rgba(124,58,237,0.2)]'
                    : 'border-white/[0.08] hover:border-white/[0.18]'
                )}
              >
                <img src={ss.url} alt={ss.app} className="w-full h-20 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                  <div className="text-white text-[10px] font-medium truncate">{ss.app}</div>
                  <div className="text-white/50 text-[9px] font-geist">
                    {new Date(ss.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/50 text-white/60 capitalize">{ss.trigger}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center text-white/20 text-sm border border-dashed border-white/[0.07] rounded-xl">
            No screenshots available
          </div>
        )}
      </GlassCard>
    </div>
  )
}
