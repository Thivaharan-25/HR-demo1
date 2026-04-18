import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { employees } from '../../mock/data/employees'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend } from '../../mock/data/analytics'
import { leaveRequests } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const dotColor: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-amber-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}
const dotSeverity: Record<string, string> = {
  critical: 'bg-red-400', high: 'bg-red-400', medium: 'bg-amber-400', low: 'bg-gray-400',
}
const severityLabel: Record<string, string> = {
  critical: 'Urgent', high: 'High', medium: 'Moderate', low: 'Low',
}
const badgeColor: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const companyEvents = [
  { name: 'All-Hands Meeting', date: 'Apr 25' },
  { name: 'Q2 Planning', date: 'May 5' },
  { name: 'Team Building Day', date: 'May 16' },
  { name: 'Performance Reviews', date: 'May 20' },
  { name: 'NEXUS Hackathon', date: 'Jun 1' },
]

const months: Record<string, number> = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }

function daysFromNow(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [mon, day] = dateStr.split(' ')
  const d = new Date(today.getFullYear(), months[mon], parseInt(day))
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function AdminDashboard() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [trendTab, setTrendTab] = useState('productivity')

  const allExceptions = [...exceptionEvents, ...liveExceptions].filter(e => !e.resolved && !dismissed.includes(e.id))
  const online = employees.filter(e => presenceStatuses[e.id] === 'online').length
  const pendingLeave = leaveRequests.filter(l => l.status === 'pending')

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: employees.length, delta: '+2%', deltaPos: true, color: 'text-white' },
          { label: 'Online Now', value: online, sub: `of ${employees.length}`, delta: '+5%', deltaPos: true, color: 'text-green-400' },
          { label: 'Active Issues', value: allExceptions.length, delta: null, color: 'text-red-400', glow: allExceptions.length > 0 },
          { label: 'Leave Requests', value: pendingLeave.length, delta: '-1%', deltaPos: false, color: 'text-amber-400' },
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
            <div className="flex items-baseline gap-1.5 mt-1">
              <div className={cn('text-3xl font-geist font-bold', card.color)}>{card.value}</div>
              {card.sub && <span className="text-sm text-white/30 font-outfit">{card.sub}</span>}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Current Issues */}
      {allExceptions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/50 text-xs font-outfit uppercase tracking-wider">
              Current Issues · {allExceptions.length} open
            </div>
            <button
              onClick={() => setDismissed(allExceptions.map(e => e.id))}
              className="text-xs text-white/30 hover:text-white/60 font-outfit transition-colors"
            >
              Dismiss All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {allExceptions.slice(0, 4).map(ex => {
              const emp = employees.find(e => e.id === ex.employeeId)
              const borderColor = ex.severity === 'critical' || ex.severity === 'high' ? 'border-red-500/50' : ex.severity === 'medium' ? 'border-amber-500/50' : 'border-blue-500/30'
              const bgColor = ex.severity === 'critical' || ex.severity === 'high' ? 'bg-red-500/[0.04]' : ex.severity === 'medium' ? 'bg-amber-500/[0.04]' : 'bg-blue-500/[0.04]'
              return (
                <div key={ex.id} className={cn('flex items-start gap-3 px-4 py-3 rounded-xl border', borderColor, bgColor)}>
                  <div className={cn('w-2 h-2 rounded-full mt-1 flex-shrink-0', dotSeverity[ex.severity])} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white/85 text-sm font-outfit">{ex.type}</div>
                    <div className="text-white/40 text-xs mt-0.5">{ex.message}</div>
                    {emp && <div className="text-white/30 text-xs mt-1">{emp.name} · {emp.department}</div>}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={cn('text-[11px] px-2 py-0.5 rounded-full border font-outfit', badgeColor[ex.severity])}>
                      {severityLabel[ex.severity]}
                    </span>
                    <button onClick={() => setDismissed(d => [...d, ex.id])} className="text-white/20 hover:text-white/50 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Needs Approval */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Needs Approval</div>
          <div className="space-y-2.5">
            {pendingLeave.slice(0, 3).map(req => {
              const emp = employees.find(e => e.id === req.employeeId)
              return (
                <div key={req.id} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-white/80 text-xs flex-1 font-outfit">
                    {emp?.name} · {req.type} Leave ({req.days}d)
                  </span>
                  <button className="text-xs px-2 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 font-outfit hover:bg-violet-600/30">
                    Approve
                  </button>
                </div>
              )
            })}
            <div className="text-violet-400 text-xs font-outfit pt-1 cursor-pointer hover:underline">View All →</div>
          </div>
        </GlassCard>

        {/* Weekly Trends */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/70 font-outfit font-semibold text-sm">Weekly Trends</div>
            <div className="flex gap-1">
              {['productivity', 'attendance', 'leave'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTrendTab(tab)}
                  className={cn(
                    'px-3 py-0.5 rounded-full text-xs font-outfit capitalize transition-all',
                    trendTab === tab
                      ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30 font-semibold'
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
        {/* Who's Online */}
        <GlassCard className="col-span-2">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Who's Online</div>
          <div className="flex gap-4 overflow-x-auto pb-1">
            {employees.slice(0, 10).map(emp => (
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

        {/* Upcoming Events */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Upcoming Events</div>
          <div className="space-y-2">
            {companyEvents.map(ev => {
              const days = daysFromNow(ev.date)
              return (
                <div key={ev.name} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <span className="text-white/80 text-xs font-outfit flex-1">{ev.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/40 font-geist">
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
