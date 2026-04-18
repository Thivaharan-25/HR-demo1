import { useParams, useNavigate } from 'react-router-dom'
import { employees } from '../../../mock/data/employees'
import { employeeSkills, skillCategories } from '../../../mock/data/skills'
import { leaveBalances } from '../../../mock/data/leave'
import { GlassCard } from '../../../components/ui/GlassCard'
import { ArrowLeft } from 'lucide-react'

export function EmployeeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const emp = employees.find(e => e.id === id)
  if (!emp) return <div className="text-white/50">Employee not found</div>

  const skills = employeeSkills.filter(s => s.employeeId === id)
  const balance = leaveBalances.filter(b => b.employeeId === id)

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center gap-6">
        <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-full border-2 border-violet-500/50" />
        <div>
          <h1 className="text-2xl font-outfit font-bold text-white">{emp.name}</h1>
          <div className="text-violet-400">{emp.jobTitle}</div>
          <div className="text-white/40 text-sm mt-1">{emp.department} · {emp.team} · {emp.email}</div>
          <div className="text-white/30 text-xs mt-1 capitalize">{emp.employmentType}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-3">Leave Balances</div>
          {balance.length === 0
            ? <div className="text-white/30 text-sm">No data</div>
            : balance.map(b => (
              <div key={b.type} className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">{b.type}</span>
                <span className="text-white font-geist text-sm">{b.remaining} / {b.entitled} days</span>
              </div>
            ))
          }
        </GlassCard>
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-3">Skills</div>
          {skills.length === 0
            ? <div className="text-white/30 text-sm">No skills declared</div>
            : skills.map(s => {
              const cat = skillCategories.flatMap(c => c.skills).find(sk => sk.id === s.skillId)
              return (
                <div key={s.skillId} className="flex justify-between mb-2 items-center">
                  <span className="text-white/70 text-sm">{cat?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'validated' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {s.status}
                  </span>
                </div>
              )
            })
          }
        </GlassCard>
      </div>
    </div>
  )
}
