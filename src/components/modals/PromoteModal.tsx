import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { employees } from '../../mock/data/employees'
import { cn } from '../../lib/utils'

interface Props {
  employeeId: string
  onClose: () => void
}

const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7']
const grades = ['SG-1', 'SG-2', 'SG-3', 'SG-4', 'SG-5', 'SG-6', 'SG-7']
const departments = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations']
const stepLabels = ['New Level', 'Salary', 'Role', 'Confirm']

export function PromoteModal({ employeeId, onClose }: Props) {
  const emp = employees.find(e => e.id === employeeId)
  if (!emp) return null

  const currentIdx = levels.indexOf(emp.jobLevel ?? 'L1')
  const defaultNextLevel = levels[Math.min(currentIdx + 1, 6)]
  const defaultNextGrade = grades[Math.min(currentIdx + 1, 6)]

  const [step, setStep] = useState(1)
  const [newLevel, setNewLevel] = useState(defaultNextLevel)
  const [newGrade, setNewGrade] = useState(defaultNextGrade)
  const [gradeNote, setGradeNote] = useState('')
  const [newTitle, setNewTitle] = useState(emp.jobTitle)
  const [newDept, setNewDept] = useState(emp.department)
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [confirmed, setConfirmed] = useState(false)

  function handleConfirm() {
    setConfirmed(true)
    setTimeout(onClose, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[480px] bg-[#12111a] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <div className="text-white font-outfit font-semibold">Promote Employee</div>
            <div className="text-white/40 text-xs mt-0.5">{emp.name}</div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.05]">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-geist font-bold transition-colors',
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/30'
              )}>
                {step > i + 1 ? <Check size={12} /> : i + 1}
              </div>
              <span className={cn('text-xs font-outfit', step === i + 1 ? 'text-white/70' : 'text-white/25')}>{label}</span>
              {i < stepLabels.length - 1 && <div className="w-6 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {confirmed ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check size={32} className="text-green-400" />
              </div>
              <div className="text-white font-outfit font-semibold text-lg">Promotion confirmed!</div>
              <div className="text-white/40 text-sm text-center">Effective {effectiveDate}. The employee record has been updated.</div>
            </div>
          ) : step === 1 ? (
            <>
              <div>
                <div className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-1">Current Level</div>
                <div className="text-white font-geist text-lg">{emp.jobLevel ?? 'L1'}</div>
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">New Job Level</label>
                <select value={newLevel} onChange={e => setNewLevel(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                  {levels.map(l => <option key={l} value={l} className="bg-[#12111a]">{l}</option>)}
                </select>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div>
                <div className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-1">Current Grade</div>
                <div className="text-white font-geist text-lg">{emp.salaryGrade ?? 'SG-1'}</div>
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">New Salary Grade</label>
                <input value={newGrade} onChange={e => setNewGrade(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">Adjustment Note (optional)</label>
                <textarea value={gradeNote} onChange={e => setGradeNote(e.target.value)} rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
              </div>
            </>
          ) : step === 3 ? (
            <>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">New Job Title</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">Department</label>
                <select value={newDept} onChange={e => setNewDept(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                  {departments.map(d => <option key={d} value={d} className="bg-[#12111a]">{d}</option>)}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
                <div className="text-white/40 text-xs font-outfit uppercase tracking-wide mb-2">Promotion Summary</div>
                {[
                  ['Level', `${emp.jobLevel ?? 'L1'} → ${newLevel}`],
                  ['Salary Grade', `${emp.salaryGrade ?? 'SG-1'} → ${newGrade}`],
                  ['Job Title', newTitle],
                  ['Department', newDept],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/50 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-white/60 text-sm font-outfit block mb-2">Effective Date</label>
                <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
              </div>
            </>
          )}
        </div>

        {/* Footer buttons */}
        {!confirmed && (
          <div className="px-6 py-4 border-t border-white/[0.08] flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="border border-white/[0.12] text-white/60 hover:text-white hover:border-white/20 px-4 py-2 rounded-lg text-sm transition-colors">
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg text-sm font-outfit transition-colors">
                Next
              </button>
            ) : (
              <button onClick={handleConfirm}
                className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-lg text-sm font-outfit transition-colors flex-1">
                Confirm Promotion
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
