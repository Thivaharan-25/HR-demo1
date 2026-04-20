import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  departments, teams, jobFamilies, legalEntities, costCenters, locations,
} from '../../mock/data/org'
import { employees } from '../../mock/data/employees'
import { GlassCard } from '../../components/ui/GlassCard'
import {
  ChevronRight, ChevronDown, Plus, Search, MapPin,
  Users, Building2, Briefcase, Globe, BarChart2, Layers,
  CheckCircle2, Clock, TrendingUp,
} from 'lucide-react'
import { cn } from '../../lib/utils'

type OrgTab = 'chart' | 'departments' | 'teams' | 'job-families' | 'legal-entities' | 'locations' | 'cost-centers'

const tabConfig: Array<{ id: OrgTab; label: string; icon: React.ElementType }> = [
  { id: 'chart', label: 'Org Chart', icon: Users },
  { id: 'departments', label: 'Departments', icon: Layers },
  { id: 'teams', label: 'Teams', icon: Users },
  { id: 'job-families', label: 'Job Families', icon: Briefcase },
  { id: 'legal-entities', label: 'Legal Entities', icon: Globe },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'cost-centers', label: 'Cost Centers', icon: BarChart2 },
]

// ─── Department Tree ─────────────────────────────────────────────────────────

function DepartmentNode({
  dept,
  children,
  depth = 0,
}: {
  dept: typeof departments[0]
  children?: React.ReactNode
  depth?: number
}) {
  const [expanded, setExpanded] = useState(depth < 1)
  const manager = employees.find(e => e.id === dept.managerId)
  const hasChildren = !!children

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all group cursor-pointer',
          'hover:bg-white/[0.04]',
          depth > 0 && 'ml-6'
        )}
        onClick={() => hasChildren && setExpanded(v => !v)}
      >
        {/* Expand chevron */}
        <span className="w-4 shrink-0">
          {hasChildren ? (
            expanded ? <ChevronDown size={13} className="text-white/30" /> : <ChevronRight size={13} className="text-white/30" />
          ) : null}
        </span>

        {/* Color dot */}
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />

        {/* Name */}
        <span className="text-white/85 text-sm font-medium flex-1">{dept.name}</span>

        {/* Code badge */}
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30 font-geist">{dept.code}</span>

        {/* Head count */}
        <span className="text-white/35 text-xs font-geist w-6 text-right">{dept.headCount}</span>

        {/* Manager avatar */}
        {manager && (
          <img src={manager.avatar} alt={manager.name} title={manager.name}
            className="w-6 h-6 rounded-full border border-white/10 opacity-60 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {expanded && hasChildren && (
        <div className="border-l border-white/[0.06] ml-7">
          {children}
        </div>
      )}
    </div>
  )
}

function DepartmentTree() {
  const rootDepts = departments.filter(d => !d.parentId)
  const childOf = (pid: string) => departments.filter(d => d.parentId === pid)

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="text-white/70 font-semibold text-sm">Department Hierarchy</div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs">{departments.length} departments</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
      {/* Table headers */}
      <div className="flex items-center gap-3 px-3 mb-2">
        <span className="w-4" />
        <span className="w-2" />
        <span className="text-white/25 text-[10px] uppercase tracking-wider flex-1">Name</span>
        <span className="text-white/25 text-[10px] uppercase tracking-wider w-16 text-right">Code</span>
        <span className="text-white/25 text-[10px] uppercase tracking-wider w-6 text-right">HC</span>
        <span className="text-white/25 text-[10px] uppercase tracking-wider w-6">Head</span>
      </div>
      <div className="space-y-0.5">
        {rootDepts.map(d => (
          <DepartmentNode key={d.id} dept={d} depth={0}>
            {childOf(d.id).length > 0 &&
              childOf(d.id).map(child => (
                <DepartmentNode key={child.id} dept={child} depth={1} />
              ))
            }
          </DepartmentNode>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Teams ────────────────────────────────────────────────────────────────────

function TeamsView() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')

  const rootDepts = departments.filter(d => !d.parentId)
  const filtered = useMemo(() => teams.filter(t => {
    const dept = departments.find(d => d.id === t.departmentId)
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All' || dept?.name === deptFilter
    return matchSearch && matchDept
  }), [search, deptFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-white/80 text-sm placeholder-white/25 focus:outline-none focus:border-violet-500/50 transition-colors" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white/60 text-sm focus:outline-none">
          <option value="All" className="bg-[#12111a]">All Departments</option>
          {rootDepts.map(d => <option key={d.id} value={d.name} className="bg-[#12111a]">{d.name}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors ml-auto">
          <Plus size={13} /> New Team
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map(t => {
          const dept = departments.find(d => d.id === t.departmentId)
          const lead = employees.find(e => e.id === t.leadId)
          const memberEmps = t.memberIds.map(id => employees.find(e => e.id === id)).filter(Boolean)

          return (
            <GlassCard key={t.id} className="hover:border-white/[0.14] transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white/90 font-semibold text-sm">{t.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dept?.color ?? '#7C3AED' }} />
                    <div className="text-white/35 text-xs">{dept?.name}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/35 font-geist">
                  {t.memberIds.length} members
                </span>
              </div>

              {lead && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/[0.06]">
                  <img src={lead.avatar} alt={lead.name} className="w-6 h-6 rounded-full border border-white/15" />
                  <div>
                    <div className="text-white/55 text-xs">{lead.name}</div>
                    <div className="text-white/25 text-[10px]">Team Lead</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 flex-wrap">
                {memberEmps.slice(0, 6).map(emp => emp && (
                  <img key={emp.id} src={emp.avatar} alt={emp.name} title={emp.name}
                    className="w-7 h-7 rounded-full border border-white/10 hover:border-violet-500/40 transition-colors" />
                ))}
                {memberEmps.length > 6 && (
                  <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-[9px] text-white/30">
                    +{memberEmps.length - 6}
                  </div>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <GlassCard className="py-10 text-center text-white/30 text-sm">No teams match your filter</GlassCard>
      )}
    </div>
  )
}

// ─── Job Families ─────────────────────────────────────────────────────────────

function JobFamiliesView() {
  const [expanded, setExpanded] = useState<string | null>('jf1')

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
          <Plus size={12} /> Add Job Family
        </button>
      </div>
      {jobFamilies.map(jf => (
        <GlassCard key={jf.id} className="p-0 overflow-hidden">
          {/* Header row */}
          <button
            className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.03] transition-colors text-left"
            onClick={() => setExpanded(expanded === jf.id ? null : jf.id)}
          >
            <span className="w-5 shrink-0">
              {expanded === jf.id
                ? <ChevronDown size={14} className="text-white/40" />
                : <ChevronRight size={14} className="text-white/30" />}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-white/85 font-semibold text-sm">{jf.name}</div>
              <div className="text-white/30 text-xs mt-0.5">{jf.levels.length} levels · {jf.headCount} employees</div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded font-geist bg-white/[0.05] text-white/35">{jf.code}</span>
            <span className="text-white/30 text-xs">{jf.requiredSkills.length} req. skills</span>
          </button>

          {expanded === jf.id && (
            <div className="border-t border-white/[0.06] px-4 py-4 space-y-4 bg-white/[0.01]">
              {/* Levels */}
              <div>
                <div className="text-white/35 text-[11px] uppercase tracking-wider mb-2.5">Job Levels</div>
                <div className="flex gap-2 flex-wrap">
                  {jf.levels.map(level => (
                    <div key={level.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
                      <span className="text-[10px] font-geist text-violet-400 font-bold">{level.code}</span>
                      <span className="text-white/60 text-xs">{level.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <div className="text-white/35 text-[11px] uppercase tracking-wider mb-2.5">Required Skills</div>
                <div className="flex gap-2 flex-wrap">
                  {jf.requiredSkills.map(rs => (
                    <div key={rs.skillId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/[0.08] border border-violet-500/20">
                      <span className="text-violet-300 text-xs font-medium">{rs.skillName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-geist">
                        L{rs.minProficiency}+
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  )
}

// ─── Legal Entities ───────────────────────────────────────────────────────────

function LegalEntitiesView() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
          <Plus size={12} /> Add Entity
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {legalEntities.map(le => (
          <GlassCard key={le.id} className="hover:border-white/[0.14] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-sm font-bold text-white/40">
                {le.countryCode}
              </div>
              <span className={cn(
                'text-[11px] px-2 py-0.5 rounded-full border',
                le.status === 'active'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              )}>
                {le.status}
              </span>
            </div>
            <div className="font-semibold text-white/90 text-sm leading-snug mb-3">{le.name}</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/30">Country</span>
                <span className="text-white/65">{le.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Reg No.</span>
                <span className="text-white/65 font-geist">{le.regNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Currency</span>
                <span className="text-white/65 font-geist">{le.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Employees</span>
                <span className="text-white/65 font-geist">{le.employees}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

// ─── Locations ────────────────────────────────────────────────────────────────

function LocationsView() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
          <Plus size={12} /> Add Location
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {locations.map(loc => (
          <GlassCard key={loc.id} className="hover:border-white/[0.14] transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className={cn(
                'w-9 h-9 rounded-xl border flex items-center justify-center shrink-0',
                loc.type === 'headquarters'
                  ? 'bg-violet-500/15 border-violet-500/25 text-violet-400'
                  : loc.type === 'regional'
                  ? 'bg-sky-500/15 border-sky-500/25 text-sky-400'
                  : 'bg-white/[0.05] border-white/10 text-white/30'
              )}>
                {loc.type === 'remote' ? <Globe size={15} /> : <Building2 size={15} />}
              </div>
              <div>
                <div className="text-white/85 font-semibold text-sm">{loc.name}</div>
                <div className="text-white/35 text-xs capitalize mt-0.5">{loc.type}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/30">Country</span>
                <span className="text-white/65">{loc.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Employees</span>
                <span className="text-white/65 font-geist">{loc.employees}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] text-white/25 text-[10px] leading-relaxed">{loc.address}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

// ─── Cost Centers ─────────────────────────────────────────────────────────────

function CostCentersView() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors">
          <Plus size={12} /> Add Cost Center
        </button>
      </div>
      <GlassCard className="p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.07]">
              {['Code', 'Name', 'Owner', 'Budget', 'Utilised'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-white/30 text-[11px] uppercase tracking-wider font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {costCenters.map((cc, i) => (
              <tr key={cc.id} className={cn('hover:bg-white/[0.02] transition-colors', i !== costCenters.length - 1 && 'border-b border-white/[0.04]')}>
                <td className="px-4 py-3 text-violet-400 text-sm font-geist">{cc.code}</td>
                <td className="px-4 py-3 text-white/80 text-sm font-medium">{cc.name}</td>
                <td className="px-4 py-3 text-white/50 text-sm">{cc.owner}</td>
                <td className="px-4 py-3 text-white/50 text-sm font-geist">{cc.budget}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-700',
                          cc.utilised > 80 ? 'bg-red-500' : cc.utilised > 60 ? 'bg-amber-500' : 'bg-violet-500'
                        )}
                        style={{ width: `${cc.utilised}%` }}
                      />
                    </div>
                    <span className={cn('text-xs font-geist w-8 text-right',
                      cc.utilised > 80 ? 'text-red-400' : cc.utilised > 60 ? 'text-amber-400' : 'text-white/50'
                    )}>{cc.utilised}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}

// ─── Org Chart ────────────────────────────────────────────────────────────────

function OrgChartView() {
  const roots = employees.filter(e => !e.managerId)
  const getReports = (id: string) => employees.filter(e => e.managerId === id)

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/70 font-semibold text-sm">Reporting Structure</div>
        <span className="text-white/25 text-xs">{employees.length} employees</span>
      </div>
      <div className="overflow-x-auto pb-2">
        {roots.map(root => (
          <div key={root.id} className="flex flex-col items-center">
            {/* Root */}
            <div className="flex flex-col items-center px-5 py-3.5 rounded-2xl border border-violet-500/40 bg-violet-600/[0.07] shadow-[0_0_20px_rgba(124,58,237,0.1)]">
              <img src={root.avatar} alt={root.name} className="w-12 h-12 rounded-full mb-2 border-2 border-violet-500/40" />
              <div className="text-white font-semibold text-sm">{root.name}</div>
              <div className="text-violet-400 text-[11px] mt-0.5">{root.jobTitle}</div>
            </div>

            <div className="w-px h-8 bg-white/10" />

            {/* Direct reports */}
            <div className="flex gap-6 flex-wrap justify-center">
              {getReports(root.id).map(mgr => (
                <div key={mgr.id} className="flex flex-col items-center">
                  <div className="flex flex-col items-center px-4 py-3 rounded-xl border border-white/[0.10] bg-white/[0.03] hover:border-white/[0.18] transition-colors">
                    <img src={mgr.avatar} alt={mgr.name} className="w-10 h-10 rounded-full mb-2 border border-white/15" />
                    <div className="text-white/85 text-xs font-semibold whitespace-nowrap">{mgr.name}</div>
                    <div className="text-white/35 text-[10px] mt-0.5 whitespace-nowrap max-w-[100px] truncate text-center">{mgr.jobTitle}</div>
                  </div>

                  {getReports(mgr.id).length > 0 && (
                    <>
                      <div className="w-px h-5 bg-white/10" />
                      <div className="flex gap-2 flex-wrap justify-center max-w-[240px]">
                        {getReports(mgr.id).slice(0, 4).map(rep => (
                          <div key={rep.id} className="flex flex-col items-center px-2.5 py-2 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:border-white/[0.12] transition-colors">
                            <img src={rep.avatar} alt={rep.name} className="w-7 h-7 rounded-full mb-1 border border-white/10" />
                            <div className="text-white/45 text-[10px] text-center">{rep.name.split(' ')[0]}</div>
                          </div>
                        ))}
                        {getReports(mgr.id).length > 4 && (
                          <div className="flex flex-col items-center justify-center px-2.5 py-2 rounded-lg border border-white/[0.06] bg-white/[0.015]">
                            <div className="text-white/30 text-[10px]">+{getReports(mgr.id).length - 4}</div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function OrgPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = (searchParams.get('tab') ?? 'chart') as OrgTab

  const setTab = (t: OrgTab) => {
    if (t === 'chart') navigate('/org')
    else navigate(`/org?tab=${t}`)
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Organization</h1>
          <p className="text-white/35 text-sm mt-0.5">
            {employees.length} employees · {departments.filter(d => !d.parentId).length} departments · {teams.length} teams
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] w-fit">
        {tabConfig.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              tab === id
                ? 'bg-violet-600/25 text-violet-300 border border-violet-500/35'
                : 'text-white/35 hover:text-white/65'
            )}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'chart' && <OrgChartView />}
      {tab === 'departments' && <DepartmentTree />}
      {tab === 'teams' && <TeamsView />}
      {tab === 'job-families' && <JobFamiliesView />}
      {tab === 'legal-entities' && <LegalEntitiesView />}
      {tab === 'locations' && <LocationsView />}
      {tab === 'cost-centers' && <CostCentersView />}
    </div>
  )
}
