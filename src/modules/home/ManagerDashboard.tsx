import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { employees } from '../../mock/data/employees'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend } from '../../mock/data/analytics'
import { leaveRequests } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Users, Wifi, AlertTriangle, CalendarX, X, TrendingUp } from 'lucide-react'
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
  { name: 'Team Sync', date: 'Apr 22', color: 'bg-violet-400' },
  { name: 'All-Hands Meeting', date: 'Apr 25', color: 'bg-sky-400' },
  { name: '1-on-1 Reviews', date: 'May 2', color: 'bg-emerald-400' },
  { name: 'Q2 Planning', date: 'May 5', color: 'bg-amber-400' },
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
  const teamOnBreak = team.filter(e => presenceStatuses[e.id] === 'break').length
  const pendingLeave = leaveRequests.filter(l => l.status === 'pending' && teamIds.has(l.employeeId))

  const trendKey = trendTab === 'productivity' ? 'avg' : trendTab === 'attendance' ? 'attendance' : 'leave'
  const trendColor = trendTab === 'leave' ? '#f59e0b' : '#7C3AED'
  const trendDomain = trendTab === 'leave' ? [0, 10] : [60, 100]

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Exception Alert Strip */}
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: 'Team Size',
            value: team.length,
            sub: `${team.filter(e => e.employmentType === 'full-time').length} full-time`,
            color: 'text-white',
            iconBg: 'bg-violet-500/15 text-violet-400',
          },
          {
            icon: Wifi,
            label: 'Team Present',
            value: teamOnline,
            sub: `${teamOnBreak} on break`,
            delta: team.length > 0 ? `${Math.round((teamOnline / team.length) * 100)}% present` : null,
            deltaPos: true,
            color: 'text-green-400',
            iconBg: 'bg-green-500/15 text-green-400',
          },
          {
            icon: AlertTriangle,
            label: 'Team Exceptions',
            value: teamExceptions.length,
            sub: teamExceptions.length > 0 ? 'Requires attention' : 'All clear',
            color: teamExceptions.length > 0 ? 'text-red-400' : 'text-white/50',
            glow: teamExceptions.length > 0,
            iconBg: teamExceptions.length > 0 ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-white/30',
          },
          {
            icon: CalendarX,
            label: 'Pending Approvals',
            value: pendingLeave.length,
            sub: 'Leave requests',
            color: 'text-amber-400',
            iconBg: 'bg-amber-500/15 text-amber-400',
          },
        ].map(card => {
          const Icon = card.icon
          return (
            <GlassCard key={card.label} glow={card.glow} className="hover:border-white/[0.14] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                  <Icon size={15} />
                </div>
                {card.delta && (
                  <div className="flex items-center gap-1 text-[11px] font-medium text-green-400">
                    <TrendingUp size={11} />{card.delta}
                  </div>
                )}
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
            <div className="text-white/70 font-semibold text-sm">Pending Actions</div>
            {(pendingLeave.length + 2) > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                {pendingLeave.length + 2}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {pendingLeave.map(req => {
              const emp = employees.find(e => e.id === req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                  <img src={emp?.avatar} alt="" className="w-7 h-7 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-xs font-medium truncate">{emp?.name}</div>
                    <div className="text-white/35 text-[10px]">{req.type} · {req.days}d</div>
                  </div>
                  <button className="text-[10px] px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:bg-violet-600/35 transition-colors shrink-0">
                    Approve
                  </button>
                </div>
              )
            })}
            {[
              { label: 'Skill validation · Aisha Noor', initials: 'SK' },
              { label: 'Skill validation · Ravi Kumar', initials: 'SK' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                <span className="w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 text-[10px] font-bold">
                  {item.initials}
                </span>
                <div className="flex-1 min-w-0 text-white/55 text-xs truncate">{item.label}</div>
                <button className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/35 hover:text-white/60 transition-colors shrink-0">View</button>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Team Trends */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Team Trends</div>
            <div className="flex gap-1 p-0.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
              {[
                { id: 'productivity', label: 'Productivity' },
                { id: 'attendance', label: 'Attendance' },
                { id: 'leave', label: 'Leave' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTrendTab(tab.id)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs capitalize transition-all',
                    trendTab === tab.id
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
                <linearGradient id="manGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#ffffff30', fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: '#ffffff30', fontSize: 9 }} domain={trendDomain} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#131220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 11 }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
              />
              <Area type="monotone" dataKey={trendKey} stroke={trendColor} strokeWidth={2} fill="url(#manGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Team Live */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Team Live</div>
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />{teamOnline} online
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {team.map(emp => (
              <div key={emp.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full bg-white/10 border border-white/10" />
                  <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d1a]', dotColor[presenceStatuses[emp.id] ?? 'offline'])} />
                </div>
                <div className="text-white/60 text-[10px] font-outfit max-w-[56px] truncate text-center">{emp.name.split(' ')[0]}</div>
                <div className="text-white/25 text-[9px] capitalize">{presenceStatuses[emp.id] ?? 'offline'}</div>
              </div>
            ))}
            {team.length === 0 && (
              <div className="text-white/30 text-sm">No team members</div>
            )}
          </div>
        </GlassCard>

        {/* Events */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-semibold text-sm mb-4">Upcoming Events</div>
          <div className="space-y-2.5">
            {managerEvents.map(ev => (
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
