import { useSearchParams, useNavigate } from 'react-router-dom'
import { departments, teams } from '../../mock/data/org'
import { employees } from '../../mock/data/employees'
import { GlassCard } from '../../components/ui/GlassCard'

type OrgTab = 'chart' | 'departments' | 'teams'

export function OrgPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = (searchParams.get('tab') ?? 'chart') as OrgTab

  const setTab = (t: OrgTab) => {
    if (t === 'chart') navigate('/org')
    else navigate(`/org?tab=${t}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-outfit font-semibold text-white">Organization</h1>
        <div className="flex gap-1.5 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          {(['chart', 'departments', 'teams'] as OrgTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-outfit capitalize transition-all ${
                tab === t
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t === 'chart' ? 'Org Chart' : t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'chart' && (
        <GlassCard>
          <div className="font-outfit font-medium text-white/50 text-sm mb-6">Reporting Structure</div>
          <div className="flex flex-col items-center gap-4 overflow-x-auto pb-2">
            {employees.filter(e => !e.managerId).map(ceo => (
              <div key={ceo.id} className="flex flex-col items-center">
                <div className="flex flex-col items-center px-5 py-3 rounded-xl border border-violet-500/40 bg-violet-600/[0.08] shadow-[0_0_16px_rgba(124,58,237,0.1)]">
                  <img src={ceo.avatar} alt={ceo.name} className="w-12 h-12 rounded-full mb-2 border border-violet-500/30" />
                  <div className="text-white font-outfit text-sm font-semibold">{ceo.name}</div>
                  <div className="text-violet-400 text-xs mt-0.5">{ceo.jobTitle}</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex gap-8 flex-wrap justify-center">
                  {employees.filter(e => e.managerId === ceo.id).map(mgr => (
                    <div key={mgr.id} className="flex flex-col items-center">
                      <div className="flex flex-col items-center px-4 py-3 rounded-xl border border-white/[0.09] bg-white/[0.03]">
                        <img src={mgr.avatar} alt={mgr.name} className="w-10 h-10 rounded-full mb-2 border border-white/15" />
                        <div className="text-white/85 text-sm font-outfit">{mgr.name}</div>
                        <div className="text-white/35 text-xs mt-0.5">{mgr.jobTitle}</div>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="flex gap-2 flex-wrap justify-center">
                        {employees.filter(e => e.managerId === mgr.id).map(rep => (
                          <div key={rep.id} className="flex flex-col items-center px-3 py-2 rounded-lg border border-white/[0.07] bg-white/[0.02]">
                            <img src={rep.avatar} alt={rep.name} className="w-8 h-8 rounded-full mb-1 border border-white/10" />
                            <div className="text-white/55 text-[11px] text-center font-outfit">{rep.name.split(' ')[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'departments' && (
        <div className="grid grid-cols-3 gap-4">
          {departments.map(d => {
            const manager = employees.find(e => e.id === d.managerId)
            return (
              <GlassCard key={d.id}>
                <div className="font-outfit font-semibold text-white text-sm">{d.name}</div>
                <div className="text-white/35 text-xs mt-1">{d.headCount} employees</div>
                {manager && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                    <img src={manager.avatar} alt={manager.name} className="w-6 h-6 rounded-full border border-white/15" />
                    <div>
                      <div className="text-white/60 text-xs font-outfit">{manager.name}</div>
                      <div className="text-white/25 text-[11px]">Head</div>
                    </div>
                  </div>
                )}
              </GlassCard>
            )
          })}
        </div>
      )}

      {tab === 'teams' && (
        <div className="grid grid-cols-3 gap-4">
          {teams.map(t => {
            const dept = departments.find(d => d.id === t.departmentId)
            return (
              <GlassCard key={t.id}>
                <div className="font-outfit font-semibold text-white text-sm">{t.name}</div>
                <div className="text-white/30 text-xs mt-0.5">{dept?.name}</div>
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
                  {t.memberIds.map(mid => {
                    const emp = employees.find(e => e.id === mid)
                    return <img key={mid} src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full border border-white/15" title={emp?.name} />
                  })}
                  <span className="text-white/30 text-xs ml-1">{t.memberIds.length} members</span>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
