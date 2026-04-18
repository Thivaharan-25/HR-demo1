import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { employees } from '../../mock/data/employees'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend } from '../../mock/data/analytics'
import { leaveRequests } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const dotColor: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-amber-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}
const pillColor: Record<string, string> = {
  critical: 'bg-red-500/20 border-red-500/40 text-red-400',
  high: 'bg-red-500/20 border-red-500/40 text-red-400',
  medium: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  low: 'border border-white/20 text-white/50',
}
const dotSeverity: Record<string, string> = {
  critical: 'bg-red-400', high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-gray-400',
}

const managerEvents = [
  { name: 'Team Sync', date: 'Apr 22' },
  { name: 'All-Hands Meeting', date: 'Apr 25' },
  { name: 'Q2 Planning', date: 'May 5' },
]

export function ManagerDashboard() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)
  const userId = useAuthStore((s) => s.user?.id)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [trendTab, setTrendTab] = useState('productivity')

  const team = employees.filter(e => e.managerId === userId)
  const teamIds = new Set(team.map(e => e.id))
  const teamExceptions = [...exceptionEvents, ...liveExceptions].filter(
    e => !e.resolved && teamIds.has(e.employeeId) && !dismissed.includes(e.id)
  )
  const teamOnline = team.filter(e => presenceStatuses[e.id] === 'online').length
  const pendingLeave = leaveRequests.filter(l => l.status === 'pending' && teamIds.has(l.employeeId))

  return (
    <div className="space-y-5">
      {/* Zone 1 — Exception Alert Strip */}
      {teamExceptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {teamExceptions.map(ex => (
            <div
              key={ex.id}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-outfit whitespace-nowrap flex-shrink-0', pillColor[ex.severity])}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', dotSeverity[ex.severity])} />
              <span>{ex.type} — {employees.find(e => e.id === ex.employeeId)?.name ?? ex.employeeId}</span>
              <button onClick={() => setDismissed(d => [...d, ex.id])} className="ml-1 hover:opacity-70">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone 2 — KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Team Size', value: team.length, delta: null, color: 'text-white' },
          { label: 'Team Present', value: teamOnline, delta: '+1', deltaPos: true, color: 'text-green-400' },
          { label: 'Team Exceptions', value: teamExceptions.length, delta: null, color: 'text-red-400', glow: teamExceptions.length > 0 },
          { label: 'Pending Approvals', value: pendingLeave.length, delta: null, color: 'text-amber-400' },
        ].map(card => (
          <GlassCard key={card.label} glow={card.glow}>
            <div className="flex items-start justify-between">
              <div className="text-white/50 text-xs font-outfit">{card.label}</div>
              {card.delta && (
                <span className={cn('text-xs font-geist font-semibold', card.deltaPos ? 'text-green-400' : 'text-red-400')}>
                  {card.delta}
                </span>
              )}
            </div>
            <div className={cn('text-3xl font-geist font-bold mt-1', card.color)}>{card.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Zone 3 — Pending Actions */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Pending Actions</div>
          <div className="space-y-2.5">
            {pendingLeave.map(req => {
              const emp = employees.find(e => e.id === req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-white/80 text-xs flex-1 font-outfit">
                    {emp?.name} · {req.type} ({req.days}d)
                  </span>
                  <button className="text-xs px-2 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 font-outfit hover:bg-violet-600/30">
                    Approve
                  </button>
                </div>
              )
            })}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-white/80 text-xs flex-1 font-outfit">Skill validation · Aisha Noor</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/40 font-outfit">View</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-white/80 text-xs flex-1 font-outfit">Skill validation · Ravi Kumar</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/40 font-outfit">View</span>
            </div>
          </div>
        </GlassCard>

        {/* Zone 5 — Trends Chart */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/70 font-outfit font-semibold text-sm">Team Trends</div>
            <div className="flex gap-1">
              {['productivity', 'attendance', 'leave'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTrendTab(tab)}
                  className={cn(
                    'px-3 py-0.5 rounded-full text-xs font-outfit capitalize transition-all',
                    trendTab === tab
                      ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                      : 'text-white/40 hover:text-white/60'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#ffffff40', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#ffffff40', fontSize: 10 }} domain={[60, 100]} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #ffffff15', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="avg" stroke="#7C3AED" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Zone 4 — Team Live Bar */}
        <GlassCard className="col-span-2">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Team Live</div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {team.map(emp => (
              <div key={emp.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full bg-white/10" />
                  <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d1a]', dotColor[presenceStatuses[emp.id] ?? 'offline'])} />
                </div>
                <div className="text-white/60 text-[10px] font-outfit max-w-[52px] truncate text-center">{emp.name.split(' ')[0]}</div>
                <div className="text-white/30 text-[9px] capitalize">{presenceStatuses[emp.id] ?? 'offline'}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Zone 6 — Events */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Upcoming Events</div>
          <div className="space-y-2">
            {managerEvents.map(ev => (
              <div key={ev.name} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="text-white/80 text-xs font-outfit flex-1">{ev.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 font-geist">{ev.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
