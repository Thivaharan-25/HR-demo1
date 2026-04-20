import { useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { employees } from '../../../mock/data/employees'
import { useLiveStore } from '../../../store/liveStore'
import { GlassCard } from '../../../components/ui/GlassCard'
import { EmployeeDetailPage } from './EmployeeDetailPage'
import { Search, LayoutGrid, List, Plus, ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'

const statusColor: Record<string, string> = {
  online: 'text-green-400',
  break: 'text-amber-400',
  offline: 'text-white/30',
  'clocked-out': 'text-red-400',
}
const statusDot: Record<string, string> = {
  online: 'bg-green-400',
  break: 'bg-amber-400',
  offline: 'bg-white/20',
  'clocked-out': 'bg-red-400',
}

const departments = ['All', ...Array.from(new Set(employees.map(e => e.department))).sort()]
const employmentTypes = ['All Types', 'full-time', 'part-time', 'contract']

function EmployeeList() {
  const presenceStatuses = useLiveStore((s) => s.presenceStatuses)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [empType, setEmpType] = useState('All Types')
  const [view, setView] = useState<'table' | 'grid'>('table')

  const filtered = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = !search || [emp.name, emp.jobTitle, emp.email, emp.department, emp.team]
        .some(v => v.toLowerCase().includes(search.toLowerCase()))
      const matchDept = dept === 'All' || emp.department === dept
      const matchType = empType === 'All Types' || emp.employmentType === empType
      return matchSearch && matchDept && matchType
    })
  }, [search, dept, empType])

  const onlineCnt = filtered.filter(e => presenceStatuses[e.id] === 'online').length

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-white/35 text-sm mt-0.5">
            {filtered.length} of {employees.length} employees · {onlineCnt} online
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-sm font-medium transition-colors shadow-[0_0_16px_rgba(124,58,237,0.3)]">
          <Plus size={15} /> Add Employee
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, title, department…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dept filter */}
        <div className="relative">
          <select
            value={dept}
            onChange={e => setDept(e.target.value)}
            className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 pr-8 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
          >
            {departments.map(d => (
              <option key={d} value={d} className="bg-[#131220]">{d}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        {/* Employment type filter */}
        <div className="relative">
          <select
            value={empType}
            onChange={e => setEmpType(e.target.value)}
            className="appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 pr-8 text-white/70 text-sm focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer capitalize"
          >
            {employmentTypes.map(t => (
              <option key={t} value={t} className="bg-[#131220] capitalize">{t}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>

        <div className="flex-1" />

        {/* View toggle */}
        <div className="flex items-center gap-0.5 p-0.5 bg-white/[0.04] border border-white/[0.07] rounded-lg">
          <button
            onClick={() => setView('table')}
            className={cn('p-1.5 rounded-md transition-colors', view === 'table' ? 'bg-violet-600/25 text-violet-300' : 'text-white/30 hover:text-white/60')}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={cn('p-1.5 rounded-md transition-colors', view === 'grid' ? 'bg-violet-600/25 text-violet-300' : 'text-white/30 hover:text-white/60')}
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Department quick-filter chips */}
      <div className="flex gap-2 flex-wrap">
        {departments.map(d => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              dept === d
                ? 'bg-violet-600/25 text-violet-300 border border-violet-500/35'
                : 'bg-white/[0.03] border border-white/[0.07] text-white/40 hover:text-white/65 hover:border-white/[0.12]'
            )}
          >
            {d}
            {d !== 'All' && (
              <span className="ml-1.5 text-[10px] opacity-60">
                {employees.filter(e => e.department === d).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <GlassCard className="py-12 text-center">
          <div className="text-white/30 text-sm">No employees match your filters</div>
          <button onClick={() => { setSearch(''); setDept('All'); setEmpType('All Types') }} className="mt-3 text-violet-400 text-xs hover:underline">
            Clear filters
          </button>
        </GlassCard>
      )}

      {/* Table view */}
      {view === 'table' && filtered.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="text-left px-4 py-3 text-white/35 text-xs font-medium uppercase tracking-wide">Employee</th>
                <th className="text-left px-4 py-3 text-white/35 text-xs font-medium uppercase tracking-wide hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3 text-white/35 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">Job Title</th>
                <th className="text-left px-4 py-3 text-white/35 text-xs font-medium uppercase tracking-wide hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-white/35 text-xs font-medium uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr
                  key={emp.id}
                  onClick={() => navigate(emp.id)}
                  className={cn(
                    'group cursor-pointer transition-colors',
                    i !== filtered.length - 1 && 'border-b border-white/[0.04]',
                    'hover:bg-white/[0.025]'
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-white/10 group-hover:border-violet-500/30 transition-colors" />
                        <span className={cn('absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0d0d1a]', statusDot[presenceStatuses[emp.id] ?? 'offline'])} />
                      </div>
                      <div>
                        <div className="text-white/85 text-sm font-medium group-hover:text-white transition-colors">{emp.name}</div>
                        <div className="text-white/35 text-xs">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-white/60 text-sm">{emp.department}</div>
                    <div className="text-white/30 text-xs">{emp.team}</div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-sm hidden lg:table-cell">{emp.jobTitle}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full border',
                      emp.workLocation === 'Remote'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        : 'bg-white/[0.04] text-white/40 border-white/[0.08]'
                    )}>
                      {emp.workLocation}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn('flex items-center gap-1.5 text-xs font-medium capitalize', statusColor[presenceStatuses[emp.id] ?? 'offline'])}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[presenceStatuses[emp.id] ?? 'offline'])} />
                      {presenceStatuses[emp.id] ?? 'offline'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Grid view */}
      {view === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(emp => (
            <div
              key={emp.id}
              onClick={() => navigate(emp.id)}
              className="group cursor-pointer rounded-2xl bg-white/[0.025] border border-white/[0.07] p-4 hover:bg-white/[0.05] hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.08)] transition-all duration-200 text-center"
            >
              <div className="relative inline-block mb-3">
                <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full border border-white/10 group-hover:border-violet-500/30 transition-colors mx-auto" />
                <span className={cn('absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d1a]', statusDot[presenceStatuses[emp.id] ?? 'offline'])} />
              </div>
              <div className="text-white/85 text-sm font-medium truncate group-hover:text-white transition-colors">{emp.name}</div>
              <div className="text-violet-400/70 text-[11px] mt-0.5 truncate">{emp.jobTitle}</div>
              <div className="text-white/30 text-[10px] mt-1 truncate">{emp.department}</div>
              <div className={cn('mt-2 text-[10px] font-medium capitalize', statusColor[presenceStatuses[emp.id] ?? 'offline'])}>
                {presenceStatuses[emp.id] ?? 'offline'}
              </div>
              {emp.workLocation === 'Remote' && (
                <span className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Remote</span>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="text-white/20 text-xs text-center">
          Showing {filtered.length} employee{filtered.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export function EmployeesPage() {
  return (
    <Routes>
      <Route index element={<EmployeeList />} />
      <Route path=":id" element={<EmployeeDetailPage />} />
    </Routes>
  )
}
