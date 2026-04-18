import { useSearchParams, useNavigate } from 'react-router-dom'
import { departments, teams } from '../../mock/data/org'
import { employees } from '../../mock/data/employees'
import { GlassCard } from '../../components/ui/GlassCard'

type OrgTab = 'chart' | 'departments' | 'teams' | 'job-families' | 'legal-entities' | 'cost-centers'

const jobFamilies = [
  { id: 'jf1', name: 'Engineering', code: 'ENG', levels: ['L1','L2','L3','L4','L5','L6','L7'], headCount: 5 },
  { id: 'jf2', name: 'Human Resources', code: 'HR', levels: ['L1','L2','L3','L4','L5'], headCount: 2 },
  { id: 'jf3', name: 'Finance', code: 'FIN', levels: ['L1','L2','L3','L4','L5'], headCount: 1 },
  { id: 'jf4', name: 'Marketing', code: 'MKT', levels: ['L1','L2','L3','L4','L5'], headCount: 1 },
  { id: 'jf5', name: 'Operations', code: 'OPS', levels: ['L1','L2','L3'], headCount: 1 },
]

const legalEntities = [
  { id: 'le1', name: 'NEXUS Technologies Sdn Bhd', country: 'Malaysia', regNo: '202001012345', currency: 'MYR', status: 'active' },
  { id: 'le2', name: 'NEXUS Singapore Pte Ltd', country: 'Singapore', regNo: '202012345A', currency: 'SGD', status: 'active' },
  { id: 'le3', name: 'NEXUS Indonesia PT', country: 'Indonesia', regNo: '2020-012345', currency: 'IDR', status: 'pending' },
]

const costCenters = [
  { id: 'cc1', code: 'CC-ENG', name: 'Engineering', owner: 'James Rajan', budget: 'MYR 850,000', utilised: 62 },
  { id: 'cc2', code: 'CC-HR', name: 'Human Resources', owner: 'Ravi Kumar', budget: 'MYR 320,000', utilised: 45 },
  { id: 'cc3', code: 'CC-FIN', name: 'Finance', owner: 'Priya Devi', budget: 'MYR 280,000', utilised: 70 },
  { id: 'cc4', code: 'CC-MKT', name: 'Marketing', owner: 'Nurul Ain', budget: 'MYR 400,000', utilised: 88 },
  { id: 'cc5', code: 'CC-OPS', name: 'Operations', owner: 'Tan Wei Lin', budget: 'MYR 180,000', utilised: 31 },
]

const tabLabels: Record<OrgTab, string> = {
  chart: 'Org Chart',
  departments: 'Departments',
  teams: 'Teams',
  'job-families': 'Job Families',
  'legal-entities': 'Legal Entities',
  'cost-centers': 'Cost Centers',
}

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
          {(Object.keys(tabLabels) as OrgTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-[13px] font-outfit transition-all ${
                tab === t
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tabLabels[t]}
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

      {tab === 'job-families' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
              + Add Job Family
            </button>
          </div>
          <GlassCard className="p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Family</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Levels</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Headcount</th>
                </tr>
              </thead>
              <tbody>
                {jobFamilies.map(jf => (
                  <tr key={jf.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white/85 text-sm font-outfit">{jf.name}</td>
                    <td className="px-4 py-3 text-violet-400 text-sm font-geist">{jf.code}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {jf.levels.map(l => (
                          <span key={l} className="text-[11px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40 font-geist">{l}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/55 text-sm">{jf.headCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {tab === 'legal-entities' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
              + Add Legal Entity
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {legalEntities.map(le => (
              <GlassCard key={le.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="font-outfit font-semibold text-white/90 text-sm leading-snug">{le.name}</div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ml-2 shrink-0 ${le.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {le.status}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-white/35">Country</span><span className="text-white/65">{le.country}</span></div>
                  <div className="flex justify-between"><span className="text-white/35">Reg No.</span><span className="text-white/65 font-geist">{le.regNo}</span></div>
                  <div className="flex justify-between"><span className="text-white/35">Currency</span><span className="text-white/65 font-geist">{le.currency}</span></div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {tab === 'cost-centers' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
              + Add Cost Center
            </button>
          </div>
          <GlassCard className="p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Owner</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Budget</th>
                  <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Utilised</th>
                </tr>
              </thead>
              <tbody>
                {costCenters.map(cc => (
                  <tr key={cc.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-violet-400 text-sm font-geist">{cc.code}</td>
                    <td className="px-4 py-3 text-white/85 text-sm font-outfit">{cc.name}</td>
                    <td className="px-4 py-3 text-white/55 text-sm">{cc.owner}</td>
                    <td className="px-4 py-3 text-white/55 text-sm font-geist">{cc.budget}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${cc.utilised}%` }} />
                        </div>
                        <span className="text-white/50 text-xs font-geist w-8 text-right">{cc.utilised}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
