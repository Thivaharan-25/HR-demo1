import { useState, useMemo } from 'react'
import { skillCategories, employeeSkills } from '../../mock/data/skills'
import { employees } from '../../mock/data/employees'
import { GlassCard } from '../../components/ui/GlassCard'
import { ChevronDown, ChevronRight, Search, CheckCircle2, Clock, XCircle, Users, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

type Tab = 'taxonomy' | 'employees' | 'gaps'

const statusConfig = {
  validated: { label: 'Validated', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: CheckCircle2 },
  pending:   { label: 'Pending',   color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
  rejected:  { label: 'Rejected',  color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',     icon: XCircle },
}

const categoryColors: Record<string, string> = {
  sc1: '#7C3AED', sc2: '#f59e0b', sc3: '#06b6d4', sc4: '#10b981', sc5: '#ec4899',
}

function ProficiencyDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-2 h-2 rounded-full transition-all',
            i < level ? 'bg-violet-500' : 'bg-white/[0.08]'
          )}
        />
      ))}
    </div>
  )
}

function ProficiencyLabel({ level }: { level: number }) {
  const labels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
  const colors = ['', 'text-white/30', 'text-sky-400/70', 'text-sky-400', 'text-violet-400', 'text-violet-300']
  return <span className={cn('text-[10px] font-medium', colors[level])}>{labels[level]}</span>
}

// ─── Taxonomy Tab ────────────────────────────────────────────────────────────
function TaxonomyView() {
  const [expanded, setExpanded] = useState<string[]>(['sc1'])
  const [search, setSearch] = useState('')

  const toggle = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return skillCategories
    const q = search.toLowerCase()
    return skillCategories
      .map(cat => ({
        ...cat,
        skills: cat.skills.filter(s => s.name.toLowerCase().includes(q)),
      }))
      .filter(cat => cat.name.toLowerCase().includes(q) || cat.skills.length > 0)
  }, [search])

  const totalSkills = skillCategories.reduce((s, c) => s + c.skills.length, 0)
  const coveredEmployees = new Set(employeeSkills.map(e => e.employeeId)).size
  const pendingCount = employeeSkills.filter(e => e.status === 'pending').length

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Zap,           label: 'Total Skills',         value: totalSkills,         color: 'text-violet-400', bg: 'bg-violet-500/15 text-violet-400' },
          { icon: Users,         label: 'Employees Covered',    value: coveredEmployees,    color: 'text-sky-400',    bg: 'bg-sky-500/15 text-sky-400' },
          { icon: CheckCircle2,  label: 'Validated Entries',    value: employeeSkills.filter(e => e.status === 'validated').length, color: 'text-green-400', bg: 'bg-green-500/15 text-green-400' },
          { icon: Clock,         label: 'Pending Review',       value: pendingCount,        color: 'text-amber-400',  bg: 'bg-amber-500/15 text-amber-400' },
        ].map(card => {
          const Icon = card.icon
          return (
            <GlassCard key={card.label} className="hover:border-white/[0.14] transition-all">
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-3', card.bg)}>
                <Icon size={13} />
              </div>
              <div className={cn('text-2xl font-bold font-geist', card.color)}>{card.value}</div>
              <div className="text-white/40 text-[11px] mt-0.5">{card.label}</div>
            </GlassCard>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search skills or categories…"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Category accordions */}
      <div className="space-y-2">
        {filteredCategories.map(cat => {
          const isOpen = expanded.includes(cat.id) || !!search
          const skillCount = cat.skills.length
          const employeeCount = new Set(
            employeeSkills.filter(es => cat.skills.some(s => s.id === es.skillId)).map(es => es.employeeId)
          ).size
          const accentColor = categoryColors[cat.id] ?? '#7C3AED'

          return (
            <GlassCard key={cat.id} className="p-0 overflow-hidden">
              <button
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 font-semibold text-sm">{cat.name}</div>
                  <div className="text-white/30 text-[11px] mt-0.5">{skillCount} skills · {employeeCount} employees covered</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-geist" style={{ color: accentColor, borderColor: `${accentColor}30`, backgroundColor: `${accentColor}12` }}>
                    {skillCount}
                  </span>
                  {isOpen ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.05]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                    {cat.skills.map((skill, i) => {
                      const entries = employeeSkills.filter(es => es.skillId === skill.id)
                      const avg = entries.length > 0
                        ? Math.round(entries.reduce((s, e) => s + e.proficiency, 0) / entries.length)
                        : 0
                      const validated = entries.filter(e => e.status === 'validated').length

                      return (
                        <div
                          key={skill.id}
                          className={cn(
                            'px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors',
                            i % 2 === 0 ? 'sm:border-r sm:border-white/[0.04]' : ''
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white/75 text-xs font-medium">{skill.name}</span>
                            <span className="text-white/25 text-[10px] font-geist">{entries.length} emp</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ProficiencyDots level={avg} />
                            <ProficiencyLabel level={avg} />
                            {validated > 0 && (
                              <span className="ml-auto text-[9px] text-green-400/70 flex items-center gap-0.5">
                                <CheckCircle2 size={9} />
                                {validated} verified
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

// ─── Employee Skills Tab ─────────────────────────────────────────────────────
function EmployeeSkillsView() {
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'validated' | 'pending' | 'rejected'>('all')

  const departments = useMemo(() => ['all', ...new Set(employees.map(e => e.department))], [])

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const skills = employeeSkills.filter(es => es.employeeId === emp.id)
      if (skills.length === 0) return false
      if (filterDept !== 'all' && emp.department !== filterDept) return false
      if (filterStatus !== 'all' && !skills.some(s => s.status === filterStatus)) return false
      if (search && !emp.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [search, filterDept, filterStatus])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>
        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-white/70 text-sm focus:outline-none"
        >
          {departments.map(d => <option key={d} value={d} className="bg-[#12111a]">{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
          {(['all', 'validated', 'pending', 'rejected'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                filterStatus === s ? 'bg-violet-600/30 text-violet-300' : 'text-white/30 hover:text-white/60'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Employee cards */}
      <div className="space-y-3">
        {filteredEmployees.map(emp => {
          const skills = employeeSkills.filter(es => es.employeeId === emp.id)
          const validatedCount = skills.filter(s => s.status === 'validated').length
          const pendingCount = skills.filter(s => s.status === 'pending').length
          const avgProficiency = skills.length > 0
            ? Math.round(skills.reduce((s, e) => s + e.proficiency, 0) / skills.length)
            : 0

          return (
            <GlassCard key={emp.id} className="hover:border-white/[0.14] transition-all">
              <div className="flex items-start gap-4">
                <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white/85 font-semibold text-sm">{emp.name}</span>
                    <span className="text-[10px] text-white/30 font-geist">{emp.jobLevel}</span>
                  </div>
                  <div className="text-white/35 text-xs">{emp.jobTitle} · {emp.department}</div>

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {skills.map(es => {
                      const skillName = skillCategories.flatMap(c => c.skills).find(s => s.id === es.skillId)?.name ?? es.skillId
                      const cfg = statusConfig[es.status]
                      const Icon = cfg.icon
                      return (
                        <div
                          key={es.skillId}
                          className={cn('flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px]', cfg.bg)}
                          title={`${skillName} — Proficiency ${es.proficiency}/5 (${cfg.label})`}
                        >
                          <Icon size={9} className={cfg.color} />
                          <span className={cn('font-medium', cfg.color)}>{skillName}</span>
                          <span className={cn('font-geist opacity-60', cfg.color)}>{es.proficiency}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Right: summary */}
                <div className="shrink-0 text-right space-y-1.5">
                  <div>
                    <div className="text-white/60 text-xs font-geist">{skills.length} skills</div>
                    <div className="text-white/25 text-[10px]">{validatedCount} verified · {pendingCount} pending</div>
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-white/25 text-[10px]">Avg</span>
                    <ProficiencyDots level={avgProficiency} />
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}

        {filteredEmployees.length === 0 && (
          <div className="py-12 text-center text-white/20 text-sm">No employees match your filters</div>
        )}
      </div>
    </div>
  )
}

// ─── Gap Analysis Tab ────────────────────────────────────────────────────────
interface GapRow {
  emp: (typeof employees)[0]
  skillName: string
  currentProficiency: number
  requiredProficiency: number
  gap: number
  status: 'missing' | 'below'
}

function GapAnalysisView() {
  // Build gaps: compare employee skills against a simple required set per department
  const requiredByDept: Record<string, Array<{ skillId: string; minProficiency: number }>> = {
    'Engineering': [
      { skillId: 's1', minProficiency: 3 },
      { skillId: 's4', minProficiency: 3 },
      { skillId: 's3', minProficiency: 2 },
    ],
    'HR': [
      { skillId: 's13', minProficiency: 3 },
      { skillId: 's10', minProficiency: 3 },
    ],
    'Finance': [
      { skillId: 's15', minProficiency: 3 },
      { skillId: 's14', minProficiency: 2 },
    ],
    'Product': [
      { skillId: 's17', minProficiency: 3 },
      { skillId: 's18', minProficiency: 3 },
    ],
  }

  const allSkills = skillCategories.flatMap(c => c.skills)

  const gaps: GapRow[] = useMemo(() => {
    const rows: GapRow[] = []
    employees.forEach(emp => {
      const reqs = requiredByDept[emp.department]
      if (!reqs) return
      reqs.forEach(req => {
        const empSkill = employeeSkills.find(es => es.employeeId === emp.id && es.skillId === req.skillId)
        const skillName = allSkills.find(s => s.id === req.skillId)?.name ?? req.skillId
        if (!empSkill) {
          rows.push({
            emp,
            skillName,
            currentProficiency: 0,
            requiredProficiency: req.minProficiency,
            gap: req.minProficiency,
            status: 'missing',
          })
        } else if (empSkill.proficiency < req.minProficiency) {
          rows.push({
            emp,
            skillName,
            currentProficiency: empSkill.proficiency,
            requiredProficiency: req.minProficiency,
            gap: req.minProficiency - empSkill.proficiency,
            status: 'below',
          })
        }
      })
    })
    return rows.sort((a, b) => b.gap - a.gap)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const missingCount = gaps.filter(g => g.status === 'missing').length
  const belowCount = gaps.filter(g => g.status === 'below').length

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Gaps', value: gaps.length, color: 'text-white/70', bg: 'bg-white/5 text-white/40', icon: TrendingUp },
          { label: 'Missing Skills', value: missingCount, color: 'text-red-400', bg: 'bg-red-500/15 text-red-400', icon: AlertTriangle },
          { label: 'Below Required Level', value: belowCount, color: 'text-amber-400', bg: 'bg-amber-500/15 text-amber-400', icon: ChevronDown },
        ].map(card => {
          const Icon = card.icon
          return (
            <GlassCard key={card.label} className="hover:border-white/[0.14] transition-all">
              <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center mb-3', card.bg)}>
                <Icon size={13} />
              </div>
              <div className={cn('text-2xl font-bold font-geist', card.color)}>{card.value}</div>
              <div className="text-white/40 text-[11px] mt-0.5">{card.label}</div>
            </GlassCard>
          )
        })}
      </div>

      {gaps.length === 0 ? (
        <GlassCard>
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
            <div className="text-white/60 text-sm font-medium">No skill gaps detected</div>
            <div className="text-white/25 text-xs">All employees meet their role requirements</div>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <div className="text-white/70 font-semibold text-sm">Skill Gap Report</div>
            <span className="text-white/25 text-xs">{gaps.length} gaps across {new Set(gaps.map(g => g.emp.id)).size} employees</span>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {gaps.map((row, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                <img src={row.emp.avatar} alt={row.emp.name} className="w-8 h-8 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/75 text-xs font-medium">{row.emp.name}</div>
                  <div className="text-white/30 text-[10px]">{row.emp.department}</div>
                </div>
                <div className="text-white/60 text-xs font-medium min-w-[100px]">{row.skillName}</div>

                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[9px] text-white/25 mb-1">
                      <span>Current: {row.currentProficiency}</span>
                      <span>Required: {row.requiredProficiency}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full bg-red-500/60"
                        style={{ width: `${(row.currentProficiency / 5) * 100}%` }}
                      />
                      <div
                        className="absolute top-0 h-full border-r-2 border-amber-400/60"
                        style={{ left: `${(row.requiredProficiency / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className={cn(
                  'shrink-0 px-2 py-0.5 rounded-full text-[9px] font-medium border',
                  row.status === 'missing'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                )}>
                  {row.status === 'missing' ? 'Missing' : `−${row.gap} level`}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function SkillsPage() {
  const [tab, setTab] = useState<Tab>('taxonomy')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'taxonomy', label: 'Taxonomy' },
    { key: 'employees', label: 'Employee Skills' },
    { key: 'gaps', label: 'Gap Analysis' },
  ]

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-white/35 text-sm mt-0.5">Skill taxonomy, proficiency tracking &amp; gap analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] rounded-xl text-white/60 text-sm transition-colors">
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-sm font-medium transition-colors shadow-[0_0_16px_rgba(124,58,237,0.3)]">
            <Zap size={14} />
            Add Skill
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.key
                ? 'bg-violet-600/25 text-violet-300 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.3)]'
                : 'text-white/35 hover:text-white/65'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'taxonomy' && <TaxonomyView />}
      {tab === 'employees' && <EmployeeSkillsView />}
      {tab === 'gaps' && <GapAnalysisView />}
    </div>
  )
}
