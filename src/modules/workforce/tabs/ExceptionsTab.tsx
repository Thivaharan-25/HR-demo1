import { useState } from 'react'
import { exceptionEvents } from '../../../mock/data/exceptions'
import { employees } from '../../../mock/data/employees'
import { useLiveStore } from '../../../store/liveStore'
import { cn } from '../../../lib/utils'
import type { ExceptionEvent } from '../../../mock/types'

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-amber-500/20 text-amber-400',
  low: 'bg-white/10 text-white/50',
}

export function ExceptionsTab() {
  const liveExceptions = useLiveStore(s => s.liveExceptions)
  const [severityFilter, setSeverityFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [resolved, setResolved] = useState<string[]>([])

  const allExceptions: ExceptionEvent[] = [
    ...exceptionEvents.map(e => ({ ...e, resolved: resolved.includes(e.id) || e.resolved })),
    ...liveExceptions.map(e => ({ ...e, resolved: resolved.includes(e.id) || e.resolved })),
  ]

  const filtered = allExceptions.filter(ex => {
    if (severityFilter !== 'All' && ex.severity !== severityFilter.toLowerCase()) return false
    if (statusFilter === 'Open' && ex.resolved) return false
    if (statusFilter === 'Resolved' && !ex.resolved) return false
    return true
  })

  function resolve(id: string) {
    setResolved(prev => [...prev, id])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(s => (
            <option key={s} value={s} className="bg-[#12111a]">{s}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
          {['All', 'Open', 'Resolved'].map(s => (
            <option key={s} value={s} className="bg-[#12111a]">{s}</option>
          ))}
        </select>
        <div className="text-white/30 text-sm">{filtered.length} exception{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-white/30 text-xs uppercase tracking-wide">
              {['Type', 'Employee', 'Severity', 'Time', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(ex => {
              const emp = employees.find(e => e.id === ex.employeeId)
              const isResolved = ex.resolved
              return (
                <tr key={ex.id} className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white/80">{ex.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={emp?.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-white/70">{emp?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', severityColors[ex.severity])}>
                      {ex.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 font-geist text-xs">
                    {new Date(ex.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', isResolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                      {isResolved ? 'Resolved' : 'Open'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!isResolved && (
                      <button onClick={() => resolve(ex.id)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">No exceptions match filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
