import { useState } from 'react'
import { X, Check, AlertTriangle } from 'lucide-react'
import { employees } from '../../mock/data/employees'
import { cn } from '../../lib/utils'

interface Props {
  employeeId: string
  onClose: () => void
}

interface ChecklistItem {
  id: string; group: string; task: string; owner: string; dueDate: string; checked: boolean
}

const stepLabels = ['Initiate', 'Checklist', 'Submit']
const reasons = ['Resignation', 'Redundancy', 'Contract End', 'Dismissal', 'Retirement']

export function OffboardModal({ employeeId, onClose }: Props) {
  const emp = employees.find(e => e.id === employeeId)
  if (!emp) return null

  const today = new Date().toISOString().split('T')[0]
  const [step, setStep] = useState(1)
  const [lastDay, setLastDay] = useState(today)
  const [reason, setReason] = useState(reasons[0])
  const [submitted, setSubmitted] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'c1', group: 'IT', task: 'Return laptop and accessories', owner: 'IT Team', dueDate: lastDay, checked: false },
    { id: 'c2', group: 'IT', task: 'Revoke system access', owner: 'IT Team', dueDate: lastDay, checked: false },
    { id: 'c3', group: 'HR', task: 'Conduct exit interview', owner: 'HR', dueDate: lastDay, checked: false },
    { id: 'c4', group: 'HR', task: 'Issue final documents', owner: 'HR', dueDate: lastDay, checked: false },
    { id: 'c5', group: 'Finance', task: 'Process final payroll', owner: 'Finance', dueDate: lastDay, checked: false },
    { id: 'c6', group: 'Finance', task: 'Clear outstanding expense claims', owner: 'Finance', dueDate: lastDay, checked: false },
    { id: 'c7', group: 'Manager', task: 'Knowledge transfer session', owner: 'Manager', dueDate: lastDay, checked: false },
    { id: 'c8', group: 'Manager', task: 'Handover documentation', owner: 'Manager', dueDate: lastDay, checked: false },
    { id: 'c9', group: 'Admin', task: 'Deactivate employee record', owner: 'Admin', dueDate: lastDay, checked: false },
  ])

  const toggleItem = (id: string) => setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  const groups = [...new Set(checklist.map(i => i.group))]

  const noticeDays = Math.max(0, Math.ceil((new Date(lastDay).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)))

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="bg-[#12111a] border border-white/[0.08] rounded-2xl w-full max-w-2xl mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <div className="text-white font-outfit font-semibold text-lg">Initiate Offboarding</div>
            <div className="text-white/40 text-sm mt-0.5">{emp.name} · {emp.jobTitle}</div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05]">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/30'
              )}>
                {step > i + 1 ? <Check size={12} /> : i + 1}
              </div>
              <span className={cn('text-sm font-outfit', step === i + 1 ? 'text-white/70' : 'text-white/25')}>{label}</span>
              {i < stepLabels.length - 1 && <div className="flex-1 h-px bg-white/10 w-8" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 min-h-[320px]">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-48 gap-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Check size={32} className="text-amber-400" />
              </div>
              <div className="text-white font-outfit font-semibold">Offboarding initiated</div>
              <div className="text-white/40 text-sm text-center">Employee status changed to <span className="text-amber-400">Offboarding</span></div>
            </div>
          ) : step === 1 ? (
            <>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">Last Working Day</label>
                <input type="date" value={lastDay} min={today} onChange={e => setLastDay(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
                {noticeDays > 0 && <div className="text-white/30 text-xs mt-1">{noticeDays} days notice period</div>}
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">Reason for Leaving</label>
                <select value={reason} onChange={e => setReason(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                  {reasons.map(r => <option key={r} value={r} className="bg-[#12111a]">{r}</option>)}
                </select>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex gap-2">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-red-400 text-sm">This action will begin the offboarding process. Employee status will be changed to Offboarding.</div>
              </div>
            </>
          ) : step === 2 ? (
            <div className="space-y-6">
              {groups.map(group => (
                <div key={group}>
                  <div className="text-white/30 text-xs font-outfit uppercase tracking-wide mb-3">{group}</div>
                  <div className="space-y-2">
                    {checklist.filter(i => i.group === group).map(item => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                        <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)}
                          className="mt-0.5 accent-violet-500" />
                        <div className="flex-1">
                          <div className={cn('text-sm', item.checked ? 'line-through text-white/30' : 'text-white/80')}>{item.task}</div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-0.5 rounded">{item.owner}</span>
                            <span className="text-xs text-white/30">Due: {item.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
                <div className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-2">Offboarding Summary</div>
                {[
                  ['Employee', emp.name],
                  ['Last Working Day', lastDay],
                  ['Reason', reason],
                  ['Checklist Items', `${checklist.length} tasks across ${groups.length} departments`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/50 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-white/[0.08] flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="border border-white/[0.12] text-white/60 hover:text-white hover:border-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg text-sm font-outfit transition-colors">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-outfit transition-colors flex-1">
                Initiate Offboarding
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
