import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, DollarSign, FileText, Zap,
  CalendarDays, Heart, Activity, AlertTriangle,
  MapPin, Clock, ChevronLeft, ChevronDown, MoreHorizontal, Users,
} from 'lucide-react'
import { useAuthStore } from '../../../store/authStore'
import { PromoteModal } from '../../../components/modals/PromoteModal'
import { OffboardModal } from '../../../components/modals/OffboardModal'
import { GlassCard } from '../../../components/ui/GlassCard'
import { cn } from '../../../lib/utils'
import { employees } from '../../../mock/data/employees'
import { employeeSkills, skillCategories } from '../../../mock/data/skills'
import { leaveRequests, leaveBalances } from '../../../mock/data/leave'
import { exceptionEvents } from '../../../mock/data/exceptions'
import { employeeDocuments, companyDocuments } from '../../../mock/data/documents'
import { activityTimeline, dependents } from '../../../mock/data/activityTimeline'

// ---------- Helpers ----------

function ProficiencyBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-3 h-1.5 rounded-sm ${i <= level ? 'bg-violet-400' : 'bg-white/10'}`} />
      ))}
    </div>
  )
}

const statusColors: Record<string, string> = {
  online: 'bg-green-500/20 text-green-400 border-green-500/30',
  break: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  offline: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'clocked-out': 'bg-red-500/20 text-red-400 border-red-500/30',
}

const statusDotColors: Record<string, string> = {
  online: 'bg-green-400',
  break: 'bg-amber-400',
  offline: 'bg-gray-400',
  'clocked-out': 'bg-red-400',
}

const statusLabels: Record<string, string> = {
  online: 'Online',
  break: 'On Break',
  offline: 'Offline',
  'clocked-out': 'Clocked Out',
}

const severityColors: Record<string, string> = {
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  high: 'bg-red-500/20 text-red-400 border-red-500/30',
  critical: 'bg-red-700/30 text-red-300 border-red-600/40',
}

const skillStatusColors: Record<string, string> = {
  validated: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const docStatusConfig: Record<string, { label: string; cls: string }> = {
  pending_acknowledgement: { label: 'Pending Acknowledgement', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  acknowledged: { label: 'Acknowledged', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  no_action: { label: 'No Action', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
}

const leaveStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

const activityTypeColors: Record<string, string> = {
  hired: 'border-l-violet-400',
  promoted: 'border-l-green-400',
  leave: 'border-l-amber-400',
  skill_added: 'border-l-blue-400',
  transferred: 'border-l-cyan-400',
  offboarded: 'border-l-red-400',
}

const primaryTabs = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'employment', label: 'Employment', Icon: Briefcase },
  { id: 'pay', label: 'Pay & Benefits', Icon: DollarSign },
  { id: 'documents', label: 'Documents', Icon: FileText },
]

const moreTabs = [
  { id: 'skills', label: 'Skills', Icon: Zap },
  { id: 'leave', label: 'Leave', Icon: CalendarDays },
  { id: 'dependents', label: 'Dependents', Icon: Heart },
  { id: 'activity', label: 'Activity', Icon: Activity },
  { id: 'alerts', label: 'Alerts', Icon: AlertTriangle },
]

// ---------- Main Component ----------

export function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { personaKey, user, permissions } = useAuthStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [showOffboardModal, setShowOffboardModal] = useState(false)
  const [acknowledgedDocs, setAcknowledgedDocs] = useState<string[]>([])
  const [validatedSkills, setValidatedSkills] = useState<string[]>([])
  const [addingSkill, setAddingSkill] = useState(false)
  const [newSkillId, setNewSkillId] = useState('')

  const moreMenuRef = useRef<HTMLDivElement>(null)
  const actionsMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setShowMoreMenu(false)
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target as Node)) setShowActionsMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const emp = employees.find(e => e.id === id)
  if (!emp) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg font-outfit">Employee not found</div>
      </div>
    )
  }

  const manager = employees.find(e => e.id === emp.managerId)
  const directReports = employees.filter(e => e.managerId === emp.id)
  const empSkills = employeeSkills.filter(s => s.employeeId === emp.id)
  const empLeave = leaveRequests.filter(l => l.employeeId === emp.id).slice(0, 5)
  const empBalances = leaveBalances.filter(b => b.employeeId === emp.id)
  const empDocs = employeeDocuments.filter(d => d.employeeId === emp.id)
  const empExceptions = exceptionEvents.filter(e => e.employeeId === emp.id)
  const empTimeline = activityTimeline.filter(a => a.employeeId === emp.id)
  const empDependents = dependents.filter(d => d.employeeId === emp.id)

  const isOwnProfile = user?.id === emp.id
  const canEdit = permissions.includes('employees:write')
  const canValidateSkills = permissions.includes('skills:validate')

  const tenureYears = emp.hireDate
    ? Math.floor((Date.now() - new Date(emp.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : null

  const allSkills = skillCategories.flatMap(c => c.skills)
  const getSkillName = (skillId: string) => allSkills.find(s => s.id === skillId)?.name ?? skillId

  const getEffectiveDocStatus = (empDoc: typeof empDocs[0]) =>
    acknowledgedDocs.includes(empDoc.id) ? 'acknowledged' : empDoc.status

  const getSkillKey = (s: typeof empSkills[0]) => `${s.employeeId}-${s.skillId}`
  const getEffectiveSkillStatus = (s: typeof empSkills[0]) =>
    validatedSkills.includes(getSkillKey(s)) ? 'validated' : s.status

  const isMoreTabActive = moreTabs.some(t => t.id === activeTab)
  const activeMoreTab = moreTabs.find(t => t.id === activeTab)

  // ---------- Tab Content ----------
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Dense profile grid — replaces summary + 4 sparse cards */}
            <GlassCard>
              <p className="text-white/30 text-xs font-outfit uppercase tracking-wider mb-4">Profile</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { label: 'Department', value: emp.department },
                  { label: 'Team', value: emp.team },
                  { label: 'Email', value: emp.email },
                  { label: 'Phone', value: emp.phone ?? '—' },
                  { label: 'Employee ID', value: emp.id.toUpperCase() },
                  { label: 'Type', value: emp.employmentType },
                  { label: 'Hire Date', value: emp.hireDate ?? '—' },
                  { label: 'Shift', value: emp.shift ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-baseline gap-3">
                    <span className="text-white/30 text-xs font-outfit uppercase tracking-wide w-24 shrink-0">{label}</span>
                    <span className="text-white/80 font-geist text-sm truncate capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Reporting line */}
            <GlassCard>
              <p className="text-white/30 text-xs font-outfit uppercase tracking-wider mb-4">Reporting</p>
              <div className="flex items-start gap-10">
                <div>
                  <p className="text-white/30 text-xs font-outfit mb-2">Reports to</p>
                  {manager ? (
                    <div className="flex items-center gap-2.5">
                      <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full border border-white/10" />
                      <div>
                        <p className="text-white text-sm font-outfit">{manager.name}</p>
                        <p className="text-white/40 text-xs">{manager.jobTitle}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">No manager assigned</p>
                  )}
                </div>

                {directReports.length > 0 && (
                  <div>
                    <p className="text-white/30 text-xs font-outfit mb-2">{directReports.length} Direct Report{directReports.length !== 1 ? 's' : ''}</p>
                    <div className="flex items-center -space-x-2">
                      {directReports.slice(0, 5).map(dr => (
                        <img
                          key={dr.id}
                          src={dr.avatar}
                          alt={dr.name}
                          title={dr.name}
                          className="w-8 h-8 rounded-full border-2 border-black"
                        />
                      ))}
                      {directReports.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-white/10 flex items-center justify-center">
                          <span className="text-white/60 text-xs">+{directReports.length - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )

      case 'employment':
        return (
          <div className="space-y-4">
            <GlassCard>
              <h3 className="font-outfit font-semibold text-white mb-4">Employment Details</h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                {[
                  { label: 'Job Title', value: emp.jobTitle },
                  { label: 'Employment Type', value: emp.employmentType },
                  { label: 'Work Location', value: emp.workLocation ?? '—' },
                  { label: 'Shift', value: emp.shift ?? '—' },
                  { label: 'Department', value: emp.department },
                  { label: 'Team', value: emp.team },
                  { label: 'Job Level', value: emp.jobLevel ?? '—' },
                  { label: 'Hire Date', value: emp.hireDate ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-1">{label}</p>
                    <p className="text-white font-geist capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="font-outfit font-semibold text-white mb-3">Reporting Line</h3>
              {manager ? (
                <div className="flex items-center gap-3">
                  <img src={manager.avatar} alt={manager.name} className="w-9 h-9 rounded-full border border-white/10" />
                  <div>
                    <p className="text-white font-outfit text-sm">{manager.name}</p>
                    <p className="text-white/50 text-xs">{manager.jobTitle}</p>
                  </div>
                </div>
              ) : (
                <p className="text-white/40 text-sm">No manager assigned</p>
              )}
            </GlassCard>
          </div>
        )

      case 'pay':
        return (
          <div className="space-y-4">
            <GlassCard>
              <h3 className="font-outfit font-semibold text-white mb-4">Pay Details</h3>
              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <p className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-1">Salary Grade</p>
                  <p className="text-white font-geist">{emp.salaryGrade ?? '—'}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-1">Job Level</p>
                  <p className="text-white font-geist">{emp.jobLevel ?? '—'}</p>
                </div>
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="font-outfit font-semibold text-white mb-4">Benefits</h3>
              <div className="space-y-2">
                {['Health Insurance', 'Dental', 'Vision'].map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <span className="text-green-400 text-sm">✓</span>
                    <span className="text-white/80 font-outfit text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )

      case 'documents':
        return (
          <div className="space-y-3">
            <h3 className="font-outfit font-semibold text-white">Documents</h3>
            {empDocs.length === 0 ? (
              <p className="text-white/40 text-sm">No documents assigned</p>
            ) : (
              empDocs.map(empDoc => {
                const doc = companyDocuments.find(d => d.id === empDoc.documentId)
                if (!doc) return null
                const effectiveStatus = getEffectiveDocStatus(empDoc)
                const statusCfg = docStatusConfig[effectiveStatus] ?? docStatusConfig.no_action
                const isPending = effectiveStatus === 'pending_acknowledgement'
                return (
                  <GlassCard key={empDoc.id} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-outfit text-sm truncate">{doc.title}</span>
                        <span className="text-white/30 text-xs font-geist shrink-0">{doc.fileSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-outfit rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {doc.category}
                        </span>
                        <span className={cn('px-2 py-0.5 text-xs font-outfit rounded border', statusCfg.cls)}>
                          {statusCfg.label}
                        </span>
                        {empDoc.acknowledgedAt && (
                          <span className="text-white/30 text-xs font-geist">{empDoc.acknowledgedAt}</span>
                        )}
                      </div>
                    </div>
                    {isPending && (
                      <button
                        onClick={() => setAcknowledgedDocs(prev => [...prev, empDoc.id])}
                        className="shrink-0 px-3 py-1.5 text-xs font-outfit bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                  </GlassCard>
                )
              })
            )}
          </div>
        )

      case 'skills': {
        const isOwnSkills = isOwnProfile && personaKey === 'employee'
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit font-semibold text-white">Skills</h3>
              {isOwnSkills && (
                <button
                  onClick={() => setAddingSkill(v => !v)}
                  className="px-3 py-1.5 text-xs font-outfit bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                >
                  + Add Skill
                </button>
              )}
            </div>

            {isOwnSkills && addingSkill && (
              <GlassCard className="flex items-center gap-3">
                <select
                  value={newSkillId}
                  onChange={e => setNewSkillId(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-outfit focus:outline-none focus:border-violet-500/50"
                >
                  <option value="">Select a skill…</option>
                  {skillCategories.map(cat => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.skills.map(sk => (
                        <option key={sk.id} value={sk.id}>{sk.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <button
                  onClick={() => setAddingSkill(false)}
                  className="px-3 py-1.5 text-xs font-outfit text-white/50 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </GlassCard>
            )}

            {empSkills.length === 0 ? (
              <p className="text-white/40 text-sm">No skills recorded</p>
            ) : (
              empSkills.map(sk => {
                const effectiveStatus = getEffectiveSkillStatus(sk)
                const isPending = effectiveStatus === 'pending'
                const statusCls = skillStatusColors[effectiveStatus] ?? skillStatusColors.pending
                return (
                  <GlassCard key={sk.skillId} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-white font-outfit text-sm">{getSkillName(sk.skillId)}</span>
                        <span className={cn('px-2 py-0.5 text-xs font-outfit rounded border capitalize', statusCls)}>
                          {effectiveStatus}
                        </span>
                      </div>
                      <ProficiencyBar level={sk.proficiency} />
                      {sk.notes && (
                        <p className="text-white/40 text-xs mt-1.5 italic">{sk.notes}</p>
                      )}
                    </div>
                    {canValidateSkills && isPending && (
                      <button
                        onClick={() => setValidatedSkills(prev => [...prev, getSkillKey(sk)])}
                        className="shrink-0 px-3 py-1.5 text-xs font-outfit bg-green-600/30 hover:bg-green-600/50 text-green-300 border border-green-500/30 rounded-lg transition-colors"
                      >
                        Validate
                      </button>
                    )}
                  </GlassCard>
                )
              })
            )}
          </div>
        )
      }

      case 'leave':
        return (
          <div className="space-y-4">
            {empBalances.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {empBalances.map(bal => (
                  <GlassCard key={`${bal.employeeId}-${bal.type}`}>
                    <p className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-2">{bal.type} Leave</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold font-geist text-white">{bal.remaining}</span>
                      <span className="text-white/40 text-sm font-geist mb-0.5">/ {bal.entitled} days</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${(bal.remaining / bal.entitled) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs font-geist text-white/30">
                      <span>Used: {bal.used}</span>
                      {bal.pending > 0 && <span className="text-amber-400">Pending: {bal.pending}</span>}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
            <GlassCard className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.07]">
                <h3 className="font-outfit font-semibold text-white text-sm">Recent Leave Requests</h3>
              </div>
              {empLeave.length === 0 ? (
                <p className="text-white/40 text-sm p-4">No leave requests</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      {['Type', 'Start', 'End', 'Days', 'Status'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-white/30 text-xs font-outfit uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empLeave.map(lr => (
                      <tr key={lr.id} className="border-b border-white/[0.03] last:border-0">
                        <td className="px-4 py-3 text-white/80 font-outfit text-sm">{lr.type}</td>
                        <td className="px-4 py-3 text-white/60 font-geist text-sm">{lr.startDate}</td>
                        <td className="px-4 py-3 text-white/60 font-geist text-sm">{lr.endDate}</td>
                        <td className="px-4 py-3 text-white font-geist text-sm">{lr.days}</td>
                        <td className="px-4 py-3">
                          <span className={cn('px-2 py-0.5 rounded text-xs font-outfit capitalize', leaveStatusColors[lr.status])}>
                            {lr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </GlassCard>
          </div>
        )

      case 'dependents':
        return (
          <div className="space-y-3">
            <h3 className="font-outfit font-semibold text-white">Dependents</h3>
            {empDependents.length === 0 ? (
              <p className="text-white/40 text-sm">No dependents recorded</p>
            ) : (
              <GlassCard className="p-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      {['Name', 'Relationship', 'Date of Birth'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {empDependents.map(dep => (
                      <tr key={dep.id} className="border-b border-white/[0.03] last:border-0">
                        <td className="px-4 py-3 text-white font-outfit text-sm">{dep.name}</td>
                        <td className="px-4 py-3 text-white/60 font-outfit text-sm">{dep.relationship}</td>
                        <td className="px-4 py-3 text-white/60 font-geist text-sm">{dep.dob}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            )}
          </div>
        )

      case 'activity':
        return (
          <div className="space-y-3">
            <h3 className="font-outfit font-semibold text-white">Activity Timeline</h3>
            {empTimeline.length === 0 ? (
              <p className="text-white/40 text-sm">No activity recorded</p>
            ) : (
              <div className="space-y-2">
                {empTimeline.map(entry => (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex gap-4 pl-4 border-l-2 py-3 rounded-r-xl bg-white/[0.02] pr-4',
                      activityTypeColors[entry.type] ?? 'border-l-white/20'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-outfit text-sm font-medium">{entry.title}</p>
                      <p className="text-white/50 text-sm mt-0.5">{entry.description}</p>
                    </div>
                    <span className="text-white/30 text-xs font-geist shrink-0 mt-0.5">{entry.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'alerts':
        return (
          <div className="space-y-3">
            <h3 className="font-outfit font-semibold text-white">Alerts & Exceptions</h3>
            {empExceptions.length === 0 ? (
              <GlassCard>
                <p className="text-white/40 text-sm text-center py-4">No active alerts</p>
              </GlassCard>
            ) : (
              empExceptions.map(ex => (
                <GlassCard key={ex.id} className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('px-2 py-0.5 text-xs font-outfit rounded border capitalize', severityColors[ex.severity])}>
                        {ex.severity}
                      </span>
                      <span className="text-white/60 text-sm font-outfit">{ex.type}</span>
                      {ex.resolved && (
                        <span className="px-2 py-0.5 text-xs font-outfit rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm">{ex.message}</p>
                    <p className="text-white/30 text-xs font-geist mt-1">
                      {new Date(ex.timestamp).toLocaleString()}
                    </p>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )

      default:
        return null
    }
  }

  // ---------- Render ----------
  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Compact header band ── */}
      <GlassCard className="shrink-0 flex items-center gap-3 py-3 px-4 mb-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white/30 hover:text-white/60 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-outfit">Back</span>
        </button>

        <div className="w-px h-5 bg-white/10 shrink-0" />

        {/* Avatar + status dot */}
        <div className="relative shrink-0">
          <img
            src={emp.avatar}
            alt={emp.name}
            className="w-9 h-9 rounded-full border-2 border-violet-500/50"
          />
          <span className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black',
            statusDotColors[emp.status] ?? 'bg-gray-400'
          )} />
        </div>

        {/* Name + title + status */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-outfit font-semibold text-sm truncate">{emp.name}</span>
            <span className={cn(
              'px-2 py-0.5 text-xs font-outfit border rounded-full shrink-0',
              statusColors[emp.status] ?? statusColors.offline
            )}>
              {statusLabels[emp.status] ?? emp.status}
            </span>
          </div>
          <p className="text-violet-400 text-xs font-outfit truncate">{emp.jobTitle}</p>
        </div>

        {/* Quick facts strip */}
        <div className="hidden md:flex items-center gap-4 ml-3 pl-3 border-l border-white/[0.07]">
          {emp.workLocation && (
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-geist">
              <MapPin className="w-3 h-3 text-violet-400/60 shrink-0" />
              {emp.workLocation}
            </div>
          )}
          {tenureYears !== null && (
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-geist">
              <Clock className="w-3 h-3 text-violet-400/60 shrink-0" />
              {tenureYears}yr tenure
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/40 text-xs font-geist">
            <Users className="w-3 h-3 text-violet-400/60 shrink-0" />
            {directReports.length} report{directReports.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {(canEdit || personaKey === 'manager') && !isOwnProfile && (
            <button className="px-3 py-1.5 text-xs font-outfit text-white/50 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
              Edit
            </button>
          )}
          {canEdit && (
            <>
              <button
                onClick={() => setShowPromoteModal(true)}
                className="px-3 py-1.5 text-xs font-outfit bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                Promote
              </button>
              {/* Offboard hidden in "..." menu */}
              <div className="relative" ref={actionsMenuRef}>
                <button
                  onClick={() => setShowActionsMenu(v => !v)}
                  className="p-1.5 text-white/40 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showActionsMenu && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => { setShowOffboardModal(true); setShowActionsMenu(false) }}
                      className="w-full px-4 py-2.5 text-left text-sm font-outfit text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Offboard
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </GlassCard>

      {/* ── Tab bar ── */}
      <div className="shrink-0 flex items-center gap-1 mb-4">
        {primaryTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-outfit whitespace-nowrap transition-colors',
              activeTab === id
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}

        {/* More dropdown */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(v => !v)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-outfit whitespace-nowrap transition-colors',
              isMoreTabActive
                ? 'bg-violet-600/30 text-violet-300 border border-violet-500/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            )}
          >
            {isMoreTabActive && activeMoreTab ? (
              <>
                <activeMoreTab.Icon className="w-3.5 h-3.5" />
                {activeMoreTab.label}
              </>
            ) : (
              'More'
            )}
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showMoreMenu && 'rotate-180')} />
          </button>

          {showMoreMenu && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              {moreTabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setShowMoreMenu(false) }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm font-outfit transition-colors',
                    activeTab === id
                      ? 'text-violet-300 bg-violet-600/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {renderTab()}
      </div>

      {showPromoteModal && <PromoteModal employeeId={emp.id} onClose={() => setShowPromoteModal(false)} />}
      {showOffboardModal && <OffboardModal employeeId={emp.id} onClose={() => setShowOffboardModal(false)} />}
    </div>
  )
}
