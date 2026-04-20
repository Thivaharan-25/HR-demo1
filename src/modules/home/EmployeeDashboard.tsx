import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend, productivityScores } from '../../mock/data/analytics'
import { leaveRequests, leaveBalances } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { X, Zap, CalendarDays, Bell, Clock } from 'lucide-react'
import { cn } from '../../lib/utils'

const pillColor: Record<string, string> = {
  critical: 'bg-red-500/20 border-red-500/40 text-red-400',
  high: 'bg-red-500/20 border-red-500/40 text-red-400',
  medium: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
  low: 'border border-white/20 text-white/50',
}
const dotSeverity: Record<string, string> = {
  critical: 'bg-red-400', high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-gray-400',
}
const statusDot: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-amber-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}
const statusLabel: Record<string, string> = {
  online: 'Online', break: 'On Break', offline: 'Offline', 'clocked-out': 'Clocked Out',
}

const myEvents = [
  { name: 'Team Sync', date: 'Apr 22', color: 'bg-violet-400' },
  { name: 'All-Hands Meeting', date: 'Apr 25', color: 'bg-sky-400' },
  { name: 'Performance Reviews', date: 'May 20', color: 'bg-amber-400' },
]

export function EmployeeDashboard() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)
  const user = useAuthStore((s) => s.user)
  const userId = user?.id ?? 'e3'
  const [dismissed, setDismissed] = useState<string[]>([])
  const [trendTab, setTrendTab] = useState('productivity')

  const myExceptions = [...exceptionEvents, ...liveExceptions].filter(
    e => !e.resolved && e.employeeId === userId && !dismissed.includes(e.id)
  )
  const score = productivityScores.find(p => p.employeeId === userId)
  const annualBalance = leaveBalances.find(b => b.employeeId === userId && b.type === 'Annual')
  const myLeave = leaveRequests.filter(l => l.employeeId === userId && l.status === 'pending')
  const myStatus = presenceStatuses[userId] ?? 'offline'

  const activeHours = score?.activeHours ?? 0
  const activeH = Math.floor(activeHours)
  const activeM = Math.round((activeHours - activeH) * 60)

  const trendKey = trendTab === 'productivity' ? 'avg' : 'attendance'

  return (
    <div className="space-y-5 animate-fade-up">
      {/* My Alert Strip */}
      {myExceptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {myExceptions.map(ex => (
            <div
              key={ex.id}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap flex-shrink-0', pillColor[ex.severity])}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', dotSeverity[ex.severity])} />
              <span>{ex.type}</span>
              <button onClick={() => setDismissed(d => [...d, ex.id])} className="ml-1 hover:opacity-70">
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-600/15 to-violet-900/10 border border-violet-500/20 p-5 flex items-center justify-between">
        <div>
          <div className="text-white/50 text-sm mb-1">Good morning,</div>
          <div className="text-white text-xl font-bold">{user?.name ?? 'Aisha Noor'} 👋</div>
          <div className="text-white/40 text-sm mt-1">{user?.jobTitle} · Engineering Platform</div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={cn('w-2 h-2 rounded-full', statusDot[myStatus])} />
          <span className="text-white/60">{statusLabel[myStatus]}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Zap,
            label: 'Productivity',
            value: `${score?.score ?? '—'}%`,
            sub: `${activeH}h ${activeM}m active today`,
            color: 'text-violet-400',
            iconBg: 'bg-violet-500/15 text-violet-400',
          },
          {
            icon: CalendarDays,
            label: 'Leave Balance',
            value: annualBalance?.remaining ?? '—',
            sub: `${annualBalance?.used ?? 0} used · ${annualBalance?.pending ?? 0} pending`,
            color: 'text-green-400',
            iconBg: 'bg-green-500/15 text-green-400',
          },
          {
            icon: Clock,
            label: 'Next Event',
            value: 'Apr 22',
            sub: 'Team Sync',
            color: 'text-amber-400',
            iconBg: 'bg-amber-500/15 text-amber-400',
          },
          {
            icon: Bell,
            label: 'Pending Actions',
            value: myLeave.length + 1,
            sub: myLeave.length > 0 ? `${myLeave.length} leave request${myLeave.length > 1 ? 's' : ''}` : '1 document to review',
            color: 'text-white',
            iconBg: 'bg-white/5 text-white/40',
          },
        ].map(card => {
          const Icon = card.icon
          return (
            <GlassCard key={card.label} className="hover:border-white/[0.14] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                  <Icon size={15} />
                </div>
              </div>
              <div className={cn('text-3xl font-bold font-geist mt-1', card.color)}>{card.value}</div>
              <div className="text-white/40 text-[11px] mt-1">{card.label}</div>
              <div className="text-white/25 text-[10px] mt-0.5">{card.sub}</div>
            </GlassCard>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Pending Actions */}
        <GlassCard className="col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">My Actions</div>
            {(myLeave.length + 1) > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                {myLeave.length + 1}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {myLeave.map(req => (
              <div key={req.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <CalendarDays size={12} className="text-amber-400" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-xs font-medium">{req.type} Leave</div>
                  <div className="text-white/35 text-[10px]">{req.startDate} · {req.days}d</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 shrink-0">Pending</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.025] border border-white/[0.05]">
              <span className="w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Bell size={12} className="text-violet-400" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-white/80 text-xs font-medium">Policy v2</div>
                <div className="text-white/35 text-[10px]">Acknowledgement required</div>
              </div>
              <button className="text-[10px] px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:bg-violet-600/35 transition-colors shrink-0">View</button>
            </div>
          </div>
        </GlassCard>

        {/* My Trends */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">My Trends</div>
            <div className="flex gap-1 p-0.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
              {[
                { key: 'productivity', label: 'Productivity' },
                { key: 'attendance', label: 'Attendance' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTrendTab(tab.key)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs transition-all',
                    trendTab === tab.key
                      ? 'bg-violet-600/25 text-violet-300 border border-violet-500/30'
                      : 'text-white/35 hover:text-white/60'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="empGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#ffffff30', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#ffffff30', fontSize: 9 }} domain={[60, 100]} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#131220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Area type="monotone" dataKey={trendKey} stroke="#7C3AED" strokeWidth={2} fill="url(#empGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Leave Balances + Upcoming Events */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="col-span-2">
          <div className="text-white/70 font-semibold text-sm mb-4">Leave Balances</div>
          <div className="space-y-3">
            {leaveBalances.filter(b => b.employeeId === userId).map(bal => (
              <div key={`${bal.employeeId}-${bal.type}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/65 text-xs">{bal.type} Leave</span>
                  <span className="text-white/50 text-xs font-geist">
                    <span className="text-white font-medium">{bal.remaining}</span> / {bal.entitled} days
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${(bal.remaining / bal.entitled) * 100}%` }}
                  />
                </div>
                {bal.pending > 0 && (
                  <div className="text-amber-400/60 text-[10px] mt-1">{bal.pending} day{bal.pending > 1 ? 's' : ''} pending</div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="col-span-1">
          <div className="text-white/70 font-semibold text-sm mb-4">Upcoming Events</div>
          <div className="space-y-2.5">
            {myEvents.map(ev => (
              <div key={ev.name} className="flex items-center gap-2.5">
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', ev.color)} />
                <span className="text-white/75 text-xs flex-1 leading-tight">{ev.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/35 font-geist shrink-0">{ev.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
