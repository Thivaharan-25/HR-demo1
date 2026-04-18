import { useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { employees } from '../../../mock/data/employees'
import { employeeSkills, skillCategories } from '../../../mock/data/skills'
import { leaveBalances, leaveRequests } from '../../../mock/data/leave'
import { activityTimeline, dependents } from '../../../mock/data/activityTimeline'
import { companyDocuments, employeeDocuments } from '../../../mock/data/documents'
import { GlassCard } from '../../../components/ui/GlassCard'
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react'

// Salary lookup by grade
const salaryByGrade: Record<string, { base: string; allowances: { name: string; amount: string }[]; bank: string }> = {
  'SG-1': { base: 'MYR 2,500', allowances: [{ name: 'Transport', amount: 'MYR 150' }], bank: 'Maybank ****1234' },
  'SG-2': { base: 'MYR 3,500', allowances: [{ name: 'Transport', amount: 'MYR 200' }], bank: 'CIMB ****5678' },
  'SG-3': { base: 'MYR 4,500', allowances: [{ name: 'Transport', amount: 'MYR 200' }, { name: 'Meal', amount: 'MYR 300' }], bank: 'Maybank ****9012' },
  'SG-4': { base: 'MYR 6,000', allowances: [{ name: 'Transport', amount: 'MYR 300' }, { name: 'Meal', amount: 'MYR 400' }, { name: 'Housing', amount: 'MYR 500' }], bank: 'CIMB ****3456' },
  'SG-5': { base: 'MYR 8,500', allowances: [{ name: 'Transport', amount: 'MYR 400' }, { name: 'Meal', amount: 'MYR 500' }, { name: 'Housing', amount: 'MYR 800' }], bank: 'Maybank ****7890' },
  'SG-6': { base: 'MYR 12,000', allowances: [{ name: 'Transport', amount: 'MYR 500' }, { name: 'Housing', amount: 'MYR 1,500' }, { name: 'Phone', amount: 'MYR 200' }], bank: 'RHB ****2345' },
  'SG-7': { base: 'MYR 18,000', allowances: [{ name: 'Housing', amount: 'MYR 2,500' }, { name: 'Phone', amount: 'MYR 300' }, { name: 'Vehicle', amount: 'MYR 1,200' }], bank: 'Maybank ****6789' },
}

// Mock qualifications per employee
const qualifications: Record<string, { education: { degree: string; institution: string; field: string; year: string }[]; certifications: { name: string; issuer: string; obtained: string; expiry: string }[] }> = {
  e2: {
    education: [{ degree: 'B.Sc', institution: 'Universiti Malaya', field: 'Computer Science', year: '2014' }],
    certifications: [{ name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', obtained: '2022-03', expiry: '2025-03' }],
  },
  e3: {
    education: [{ degree: 'B.Eng', institution: 'UTM', field: 'Software Engineering', year: '2020' }],
    certifications: [
      { name: 'Azure Developer Associate', issuer: 'Microsoft', obtained: '2023-06', expiry: '2025-06' },
      { name: 'Certified Scrum Developer', issuer: 'Scrum Alliance', obtained: '2022-11', expiry: '2024-11' },
    ],
  },
  e5: {
    education: [{ degree: 'B.Acc', institution: 'Universiti Kebangsaan Malaysia', field: 'Accountancy', year: '2018' }],
    certifications: [{ name: 'ACCA', issuer: 'ACCA Global', obtained: '2021-09', expiry: '2027-09' }],
  },
  e7: {
    education: [{ degree: 'BBA', institution: 'Universiti Putra Malaysia', field: 'Marketing', year: '2019' }],
    certifications: [{ name: 'Google Analytics Certified', issuer: 'Google', obtained: '2024-01', expiry: '2026-01' }],
  },
}

// Mock alerts per employee
const alertsMap: Record<string, { type: string; message: string; severity: 'warning' | 'info' }[]> = {
  e9: [{ type: 'Contract Expiry', message: 'Contract expires in 30 days — 2026-05-31', severity: 'warning' }],
  e3: [{ type: 'Pending Review', message: 'Q1 2026 performance review awaiting completion', severity: 'info' }],
  e4: [{ type: 'Probation Ending', message: 'Probation period ends 2026-05-05 (18 days)', severity: 'warning' }],
}

function tenure(hireDate: string): string {
  const start = new Date(hireDate)
  const now = new Date('2026-04-18')
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  const yrs = Math.floor(months / 12)
  const mos = months % 12
  return yrs > 0 ? `${yrs}y ${mos}m` : `${mos}m`
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <GlassCard className="overflow-hidden !p-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white/75 text-sm font-outfit font-semibold">{title}</span>
        {open ? <ChevronDown size={15} className="text-white/30" /> : <ChevronRight size={15} className="text-white/30" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t border-white/[0.05]">{children}</div>}
    </GlassCard>
  )
}

export function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const emp = employees.find(e => e.id === id)
  if (!emp) return <div className="text-white/50">Employee not found</div>

  const manager = employees.find(e => e.id === emp.managerId)
  const skills = employeeSkills.filter(s => s.employeeId === id)
  const balance = leaveBalances.filter(b => b.employeeId === id)
  const myLeaveRequests = leaveRequests.filter(l => l.employeeId === id)
  const timeline = activityTimeline.filter(t => t.employeeId === id)
  const myDependents = dependents.filter(d => d.employeeId === id)
  const empDocs = employeeDocuments.filter(ed => ed.employeeId === id)
    .map(ed => ({ ...ed, doc: companyDocuments.find(d => d.id === ed.documentId) }))
    .filter(ed => ed.doc)
  const qual = qualifications[id ?? ''] ?? { education: [], certifications: [] }
  const alerts = alertsMap[id ?? ''] ?? []
  const comp = salaryByGrade[emp.salaryGrade ?? 'SG-3'] ?? salaryByGrade['SG-3']
  const totalLeaveRemaining = balance.reduce((sum, b) => sum + b.remaining, 0)
  const salaryBand = emp.salaryGrade

  const statusDot: Record<string, string> = {
    online: 'bg-green-400', break: 'bg-yellow-400', offline: 'bg-gray-500', 'clocked-out': 'bg-red-400',
  }
  const timelineIcon: Record<string, string> = {
    hired: '🎉', promoted: '⬆️', skill_added: '🎓', leave: '🏖️', transfer: '🔄',
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Back to Employees
      </button>

      {/* Identity Card */}
      <GlassCard>
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-full border-2 border-violet-500/40" />
            <span className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0d0d1a] ${statusDot[emp.status] ?? 'bg-gray-500'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-outfit font-bold text-white">{emp.name}</h1>
                <div className="text-violet-400 font-outfit mt-0.5">{emp.jobTitle}</div>
                <div className="text-white/40 text-sm mt-1">{emp.department} · {emp.team} · {emp.email}</div>
                <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                  <span>Hired {emp.hireDate}</span>
                  {manager && <><span>·</span><span>Reports to <span className="text-white/55">{manager.name}</span></span></>}
                  <span>·</span><span className="capitalize">{emp.employmentType}</span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-outfit capitalize shrink-0 ${emp.status === 'online' ? 'bg-green-500/10 text-green-400 border-green-500/20' : emp.status === 'break' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/[0.04] text-white/40 border-white/[0.08]'}`}>
                {emp.status}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Facts Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Tenure', value: emp.hireDate ? tenure(emp.hireDate) : 'N/A' },
          { label: 'Leave Balance', value: `${totalLeaveRemaining} days` },
          { label: 'Salary Band', value: salaryBand },
          { label: 'Level', value: emp.jobLevel },
        ].map(fact => (
          <GlassCard key={fact.label} className="!py-3">
            <div className="text-white/35 text-[11px] font-outfit uppercase tracking-wider">{fact.label}</div>
            <div className="text-white/85 font-geist font-semibold mt-1">{fact.value}</div>
          </GlassCard>
        ))}
      </div>

      {/* Alerts / Action Items */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${alert.severity === 'warning' ? 'bg-amber-500/[0.05] border-amber-500/30' : 'bg-blue-500/[0.05] border-blue-500/30'}`}>
              <span className="text-base">{alert.severity === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <div>
                <div className={`text-sm font-outfit font-semibold ${alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>{alert.type}</div>
                <div className="text-white/50 text-xs mt-0.5">{alert.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employment Details */}
      <Section title="Employment Details" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-2">
          {[
            { label: 'Department', value: emp.department },
            { label: 'Team', value: emp.team },
            { label: 'Job Level', value: emp.jobLevel },
            { label: 'Salary Grade', value: emp.salaryGrade },
            { label: 'Employment Type', value: emp.employmentType },
            { label: 'Work Location', value: emp.workLocation },
            { label: 'Shift', value: emp.shift },
            { label: 'Phone', value: emp.phone ?? '—' },
            { label: 'Start Date', value: emp.hireDate },
            { label: 'Manager', value: manager?.name ?? 'No manager' },
          ].map(f => (
            <div key={f.label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04]">
              <span className="text-white/40 text-sm">{f.label}</span>
              <span className="text-white/75 text-sm font-outfit capitalize">{f.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Pay & Benefits */}
      <Section title="Pay & Benefits">
        <div className="space-y-4 mt-2">
          <div>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Base Salary</div>
            <div className="text-white/85 text-lg font-geist font-semibold">{comp.base} <span className="text-white/35 text-sm font-normal">/ month</span></div>
          </div>
          <div>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Allowances</div>
            <div className="space-y-2">
              {comp.allowances.map(a => (
                <div key={a.name} className="flex justify-between items-center">
                  <span className="text-white/55 text-sm">{a.name} Allowance</span>
                  <span className="text-white/75 text-sm font-geist">{a.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-2">Bank Details</div>
            <div className="flex items-center gap-2">
              <span className="text-white/55 text-sm">Payment Account</span>
              <span className="ml-auto text-white/55 text-sm font-geist">{comp.bank}</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/30">masked</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Skills & Qualifications */}
      <Section title="Skills & Qualifications">
        <div className="space-y-5 mt-2">
          {skills.length > 0 && (
            <div>
              <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Declared Skills</div>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => {
                  const cat = skillCategories.flatMap(c => c.skills).find(sk => sk.id === s.skillId)
                  return (
                    <span key={s.skillId} className={`text-xs px-2.5 py-1 rounded-full border ${s.status === 'validated' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {cat?.name} · {s.status}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
          {qual.education.length > 0 && (
            <div>
              <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Education</div>
              <div className="space-y-2">
                {qual.education.map((e, i) => (
                  <div key={i} className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="text-white/80 text-sm font-outfit">{e.degree} — {e.field}</div>
                    <div className="text-white/40 text-xs mt-0.5">{e.institution} · {e.year}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {qual.certifications.length > 0 && (
            <div>
              <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Certifications</div>
              <div className="space-y-2">
                {qual.certifications.map((c, i) => (
                  <div key={i} className="flex items-start justify-between px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div>
                      <div className="text-white/80 text-sm font-outfit">{c.name}</div>
                      <div className="text-white/40 text-xs mt-0.5">{c.issuer}</div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="text-white/35 text-xs">Obtained {c.obtained}</div>
                      <div className="text-white/25 text-xs">Expires {c.expiry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {skills.length === 0 && qual.education.length === 0 && qual.certifications.length === 0 && (
            <div className="text-white/30 text-sm">No qualifications recorded</div>
          )}
        </div>
      </Section>

      {/* Documents */}
      <Section title="Documents">
        {empDocs.length === 0 ? (
          <div className="text-white/30 text-sm mt-2">No documents assigned</div>
        ) : (
          <div className="space-y-2 mt-2">
            {empDocs.map(ed => (
              <div key={ed.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-base">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-sm font-outfit truncate">{ed.doc?.title}</div>
                  <div className="text-white/30 text-xs">{ed.doc?.category} · {ed.doc?.fileSize}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${ed.status === 'acknowledged' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ed.status === 'pending_acknowledgement' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/[0.04] text-white/30 border-white/[0.06]'}`}>
                  {ed.status === 'pending_acknowledgement' ? 'Pending' : ed.status === 'acknowledged' ? 'Acknowledged' : 'No action'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Dependents */}
      <Section title="Dependents & Emergency Contacts">
        {myDependents.length === 0 ? (
          <div className="text-white/30 text-sm mt-2">No dependents recorded</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-2">
            {myDependents.map(dep => (
              <div key={dep.id} className="px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className="text-white/80 text-sm font-outfit">{dep.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{dep.relationship} · DOB {dep.dob}</div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Leave */}
      <Section title="Leave">
        <div className="space-y-4 mt-2">
          {balance.length > 0 && (
            <div>
              <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Balances</div>
              <div className="space-y-2">
                {balance.map(b => (
                  <div key={b.type} className="flex items-center gap-3">
                    <span className="text-white/55 text-sm flex-1">{b.type}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.08]">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${(b.remaining / b.entitled) * 100}%` }} />
                    </div>
                    <span className="text-white/55 text-sm font-geist w-20 text-right">{b.remaining} / {b.entitled} days</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {myLeaveRequests.length > 0 && (
            <div>
              <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-3">Recent Requests</div>
              <div className="space-y-2">
                {myLeaveRequests.slice(0, 3).map(req => (
                  <div key={req.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-white/70 text-sm flex-1">{req.type} Leave · {req.days} days</span>
                    <span className="text-white/30 text-xs">{req.startDate}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${req.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {balance.length === 0 && myLeaveRequests.length === 0 && (
            <div className="text-white/30 text-sm">No leave data</div>
          )}
        </div>
      </Section>

      {/* Activity Timeline */}
      <Section title="Activity Timeline">
        {timeline.length === 0 ? (
          <div className="text-white/30 text-sm mt-2">No activity recorded</div>
        ) : (
          <div className="space-y-3 mt-2">
            {timeline.map(entry => (
              <div key={entry.id} className="flex items-start gap-3">
                <span className="text-base shrink-0">{timelineIcon[entry.type] ?? '•'}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-sm font-outfit">{entry.title}</div>
                  <div className="text-white/40 text-xs mt-0.5">{entry.description}</div>
                </div>
                <span className="text-white/25 text-xs font-geist shrink-0">{entry.date}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
