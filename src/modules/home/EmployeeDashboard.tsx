import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { exceptionEvents } from '../../mock/data/exceptions'
import { weeklyTrend, productivityScores } from '../../mock/data/analytics'
import { leaveRequests, leaveBalances } from '../../mock/data/leave'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
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
const statusColor: Record<string, string> = {
  online: 'bg-green-400', break: 'bg-amber-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
}
const statusLabel: Record<string, string> = {
  online: 'You are Online', break: 'On Break', offline: 'Offline', 'clocked-out': 'Clocked Out',
}

const myEvents = [
  { name: 'Team Sync', date: 'Apr 22' },
  { name: 'All-Hands Meeting', date: 'Apr 25' },
  { name: 'Performance Reviews', date: 'May 20' },
]

export function EmployeeDashboard() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const liveExceptions = useLiveStore((s) => s.liveExceptions)
  const userId = useAuthStore((s) => s.user?.id) ?? 'e3'
  const [dismissed, setDismissed] = useState<string[]>([])
  const [trendTab, setTrendTab] = useState('productivity')

  const myExceptions = [...exceptionEvents, ...liveExceptions].filter(
    e => !e.resolved && e.employeeId === userId && !dismissed.includes(e.id)
  )
  const score = productivityScores.find(p => p.employeeId === userId)
  const balance = leaveBalances.find(b => b.employeeId === userId && b.type === 'Annual')
  const myLeave = leaveRequests.filter(l => l.employeeId === userId && l.status === 'pending')
  const myStatus = presenceStatuses[userId] ?? 'offline'

  const activeHours = score?.activeHours ?? 0
  const activeH = Math.floor(activeHours)
  const activeM = Math.round((activeHours - activeH) * 60)

  return (
    <div className="space-y-5">
      {/* Zone 1 — My Alert Strip */}
      {myExceptions.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {myExceptions.map(ex => (
            <div
              key={ex.id}
              className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-outfit whitespace-nowrap flex-shrink-0', pillColor[ex.severity])}
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

      {/* Zone 2 — KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <GlassCard>
          <div className="text-white/50 text-xs font-outfit">Productivity</div>
          <div className="text-3xl font-geist font-bold text-violet-400 mt-1">{score?.score ?? '—'}%</div>
        </GlassCard>
        <GlassCard>
          <div className="text-white/50 text-xs font-outfit">Leave Balance</div>
          <div className="text-3xl font-geist font-bold text-green-400 mt-1">{balance?.remaining ?? '—'}</div>
          <div className="text-white/30 text-[10px] mt-0.5 font-outfit">days annual remaining</div>
        </GlassCard>
        <GlassCard>
          <div className="text-white/50 text-xs font-outfit">Next Event</div>
          <div className="text-3xl font-geist font-bold text-amber-400 mt-1">1</div>
          <div className="text-white/30 text-[10px] mt-0.5 font-outfit">Team Sync · Apr 22</div>
        </GlassCard>
        <GlassCard>
          <div className="text-white/50 text-xs font-outfit">Pending Actions</div>
          <div className="text-3xl font-geist font-bold text-white mt-1">{myLeave.length + 1}</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Zone 3 — My Pending Actions */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Pending Actions</div>
          <div className="space-y-2.5">
            {myLeave.map(req => (
              <div key={req.id} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-white/80 text-xs flex-1 font-outfit">
                  {req.type} Leave · {req.startDate}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/40 font-outfit">Pending</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
              <span className="text-white/80 text-xs flex-1 font-outfit">Document acknowledgement · Policy v2</span>
              <span className="text-xs px-2 py-0.5 rounded-full border border-white/20 text-white/40 font-outfit">View</span>
            </div>
          </div>
        </GlassCard>

        {/* Zone 5 — My Trends */}
        <GlassCard className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-white/70 font-outfit font-semibold text-sm">My Trends</div>
            <div className="flex gap-1">
              {[{ key: 'productivity', label: 'My Productivity' }, { key: 'attendance', label: 'My Attendance' }].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setTrendTab(tab.key)}
                  className={cn(
                    'px-3 py-0.5 rounded-full text-xs font-outfit transition-all',
                    trendTab === tab.key
                      ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30'
                      : 'text-white/40 hover:text-white/60'
                  )}
                >
                  {tab.label}
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
        {/* Zone 4 — Personal Clock-In Status */}
        <GlassCard className="col-span-2">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">My Status</div>
          <div className="flex items-center gap-4">
            <span className={cn('w-5 h-5 rounded-full flex-shrink-0', statusColor[myStatus])} />
            <div>
              <div className="text-white font-outfit font-semibold">{statusLabel[myStatus] ?? myStatus}</div>
              <div className="text-white/40 text-sm font-geist mt-0.5">
                Today: {activeH}h {activeM}m active
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Zone 6 — My Events */}
        <GlassCard className="col-span-1">
          <div className="text-white/70 font-outfit font-semibold text-sm mb-3">Upcoming Events</div>
          <div className="space-y-2">
            {myEvents.map(ev => (
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
