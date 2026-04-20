import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { employees } from '../../mock/data/employees'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend, departmentStats, headcountTrend } from '../../mock/data/analytics'
import { leaveRequests } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts'
import { Users, Wifi, AlertTriangle, CalendarX, X, TrendingUp, TrendingDown } from 'lucide-react'
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

const companyEvents = [
  { name: 'All-Hands Meeting', date: 'Apr 25', color: 'bg-violet-400' },
  { name: 'Q2 Planning', date: 'May 5', color: 'bg-sky-400' },
  { name: 'Team Building Day', date: 'May 16', color: 'bg-emerald-400' },
  { name: 'Performance Reviews', date: 'May 20', color: 'bg-amber-400' },
  { name: 'NEXUS Hackathon', date: 'Jun 1', color: 'bg-violet-400' },
]

const kpiIcons = {
  headcount: Users,
  online: Wifi,
  exceptions: AlertTriangle,
  leave: CalendarX,
}

export function AdminDashboard() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [trendTab, setTrendTab] = useState('productivity')

  const allExceptions = [...exceptionEvents, ...liveExceptions].filter(e => !e.resolved && !dismissed.includes(e.id))
  const online = employees.filter(e => presenceStatuses[e.id] === 'online').length
  const onBreak = employees.filter(e => presenceStatuses[e.id] === 'break').length
  const openExceptions = allExceptions.length
  const pendingLeave = leaveRequests.filter(l => l.status === 'pending')

  const trendKey = trendTab === 'productivity' ? 'avg' : trendTab === 'attendance' ? 'attendance' : 'leave'
  const trendColor = trendTab === 'leave' ? '#f59e0b' : '#7C3AED'
  const trendDomain = trendTab === 'leave' ? [0, 10] : [60, 100]

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Exception Alert Strip */}
      {allExceptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {allExceptions.map(ex => (
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
            key: 'headcount',
            label: 'Total Headcount',
            value: employees.length,
            sub: `${employees.filter(e => e.employmentType === 'full-time').length} FT · ${employees.filter(e => e.employmentType === 'contract').length} contract`,
            delta: '+2 this month',
            deltaPos: true,
            color: 'text-white',
            iconBg: 'bg-violet-500/15 text-violet-400',
          },
          {
            key: 'online',
            label: 'Online Now',
            value: online,
            sub: `${onBreak} on break · ${employees.length - online - onBreak} offline`,
            delta: `${Math.round((online / employees.length) * 100)}% present`,
            deltaPos: true,
            color: 'text-green-400',
            iconBg: 'bg-green-500/15 text-green-400',
          },
          {
            key: 'exceptions',
            label: 'Open Exceptions',
            value: openExceptions,
            sub: openExceptions > 0 ? `${allExceptions.filter(e => e.severity === 'critical' || e.severity === 'high').length} high severity` : 'All clear',
            delta: null,
            color: openExceptions > 0 ? 'text-red-400' : 'text-white/50',
            glow: openExceptions > 0,
            iconBg: openExceptions > 0 ? 'bg-red-500/15 text-red-400' : 'bg-white/5 text-white/30',
          },
          {
            key: 'leave',
            label: 'Pending Leave',
            value: pendingLeave.length,
            sub: `${leaveRequests.filter(l => l.status === 'approved').length} approved this month`,
            delta: null,
            color: 'text-amber-400',
            iconBg: 'bg-amber-500/15 text-amber-400',
          },
        ].map(card => {
          const Icon = kpiIcons[card.key as keyof typeof kpiIcons]
          return (
            <GlassCard key={card.label} glow={card.glow} className="group hover:border-white/[0.14] transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                  <Icon size={15} />
                </div>
                {card.delta && (
                  <div className={cn('flex items-center gap-1 text-[11px] font-medium', card.deltaPos ? 'text-green-400' : 'text-red-400')}>
                    {card.deltaPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {card.delta}
                  </div>
                )}
              </div>
              <div className={cn('text-3xl font-bold font-geist mt-1', card.color)}>{card.value}</div>
              <div className="text-white/40 text-[11px] mt-1 font-outfit">{card.label}</div>
              <div className="text-white/25 text-[10px] mt-0.5">{card.sub}</div>
            </GlassCard>
          )
        })}
      </div>

      {/* Row 2: Pending Actions + Trends */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pending Actions */}
        <GlassCard className="col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Pending Actions</div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
              {pendingLeave.length + 2} total
            </span>
          </div>
          <div className="space-y-3">
            {pendingLeave.slice(0, 3).map(req => {
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
              { label: 'Skill validation · Fatimah Zahra', type: 'skill' },
              { label: 'Document ACK · Jason Teo', type: 'doc' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                <span className="w-7 h-7 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 text-[10px] font-bold">
                  {item.type === 'skill' ? 'SK' : 'DC'}
                </span>
                <div className="flex-1 min-w-0 text-white/60 text-xs truncate">{item.label}</div>
                <button className="text-[10px] px-2 py-1 rounded-lg border border-white/10 text-white/35 hover:text-white/60 transition-colors shrink-0">View</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 text-violet-400/70 text-xs hover:text-violet-400 transition-colors text-center pt-2 border-t border-white/[0.05]">
            View all actions →
          </button>
        </GlassCard>

        {/* Trends Chart */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Workforce Trends</div>
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
                    'px-3 py-1 rounded-md text-xs font-outfit capitalize transition-all',
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
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey={trendKey} stroke={trendColor} strokeWidth={2} fill="url(#trendGrad)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Row 3: Workforce Live + Events */}
      <div className="grid grid-cols-3 gap-4">
        {/* Workforce Live */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Workforce Live</div>
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> {online} online
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block ml-1" /> {onBreak} on break
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {employees.slice(0, 14).map(emp => (
              <div key={emp.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative">
                  <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full bg-white/10" />
                  <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d1a]', dotColor[presenceStatuses[emp.id] ?? 'offline'])} />
                </div>
                <div className="text-white/55 text-[10px] font-outfit max-w-[48px] truncate text-center">{emp.name.split(' ')[0]}</div>
              </div>
            ))}
            {employees.length > 14 && (
              <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-white/35 text-[10px] font-bold">+{employees.length - 14}</span>
                </div>
                <div className="text-white/30 text-[10px]">more</div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Upcoming Events */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-semibold text-sm mb-4">Upcoming Events</div>
          <div className="space-y-2.5">
            {companyEvents.map(ev => (
              <div key={ev.name} className="flex items-center gap-2.5">
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', ev.color)} />
                <span className="text-white/75 text-xs font-outfit flex-1 leading-tight">{ev.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/35 font-geist shrink-0">{ev.date}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 4: Dept breakdown + Active Alerts */}
      <div className="grid grid-cols-3 gap-4">
        {/* Dept breakdown */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/70 font-semibold text-sm">Department Overview</div>
            <span className="text-white/25 text-xs">{employees.length} total employees</span>
          </div>
          <div className="space-y-2.5">
            {[
              { dept: 'Engineering', count: employees.filter(e => e.department === 'Engineering').length },
              { dept: 'HR', count: employees.filter(e => e.department === 'HR').length },
              { dept: 'Finance', count: employees.filter(e => e.department === 'Finance').length },
              { dept: 'Marketing', count: employees.filter(e => e.department === 'Marketing').length },
              { dept: 'Product', count: employees.filter(e => e.department === 'Product').length },
              { dept: 'Operations', count: employees.filter(e => e.department === 'Operations').length },
              { dept: 'Sales', count: employees.filter(e => e.department === 'Sales').length },
            ].map(({ dept, count }) => (
              <div key={dept} className="flex items-center gap-3">
                <span className="text-white/50 text-xs w-24 shrink-0 font-outfit">{dept}</span>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${(count / employees.length) * 100}%` }}
                  />
                </div>
                <span className="text-white/40 text-xs font-geist w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Active Alerts */}
        {allExceptions.length > 0 ? (
          <GlassCard className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/70 font-semibold text-sm">Active Alerts</div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                {allExceptions.length} open
              </span>
            </div>
            <div className="space-y-2.5">
              {allExceptions.slice(0, 4).map(ex => {
                const emp = employees.find(e => e.id === ex.employeeId)
                const severity = ex.severity === 'critical' || ex.severity === 'high' ? 'high' : ex.severity
                const colors = {
                  high: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                  medium: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  low: { dot: 'bg-gray-400', text: 'text-white/40', bg: 'bg-white/[0.03] border-white/[0.07]' },
                }
                const c = colors[severity as keyof typeof colors] ?? colors.low
                return (
                  <div key={ex.id} className={cn('flex items-start gap-2.5 p-2.5 rounded-lg border', c.bg)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full mt-1 shrink-0', c.dot)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white/75 text-xs font-medium">{ex.type}</div>
                      <div className="text-white/35 text-[10px] mt-0.5">{emp?.name}</div>
                    </div>
                    <button onClick={() => setDismissed(d => [...d, ex.id])} className="text-white/20 hover:text-white/50 transition-colors shrink-0">
                      <X size={11} />
                    </button>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="col-span-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
              <ShieldCheck size={18} className="text-green-400" />
            </div>
            <div className="text-white/70 text-sm font-medium">All Clear</div>
            <div className="text-white/30 text-xs mt-1">No active exceptions</div>
          </GlassCard>
        )}
      </div>
    </div>
  )
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  )
}
