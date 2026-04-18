import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { GlassCard } from '../../components/ui/GlassCard'
import { wmsBridgeLogs } from '../../mock/data/wms-bridge'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'

type SettingsTab = 'general' | 'monitoring' | 'integrations' | 'branding' | 'alerts'

const tabLabels: Record<SettingsTab, string> = {
  general: 'General',
  monitoring: 'Monitoring',
  integrations: 'Integrations',
  branding: 'Branding',
  alerts: 'Alert Rules',
}

export function SettingsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = (searchParams.get('tab') ?? 'general') as SettingsTab

  const wmsSyncLog = useLiveStore((s) => s.wmsSyncLog)
  const { tenantName, tenantColor, updateBranding } = useAuthStore()
  const [brandName, setBrandName] = useState(tenantName)
  const [brandColor, setBrandColor] = useState(tenantColor)

  const setTab = (t: SettingsTab) => {
    if (t === 'general') navigate('/settings')
    else navigate(`/settings?tab=${t}`)
  }

  const allBridgeLogs = [...wmsSyncLog, ...wmsBridgeLogs]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-outfit font-semibold text-white">Settings</h1>
        <div className="flex gap-1.5 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          {(Object.keys(tabLabels) as SettingsTab[]).map(t => (
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

      {tab === 'general' && (
        <div className="grid grid-cols-2 gap-4">
          <GlassCard>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-4">Tenant Info</div>
            <div className="space-y-4">
              {[
                { label: 'Tenant Name', value: tenantName },
                { label: 'Plan', value: 'Full Suite' },
                { label: 'Timezone', value: 'Asia/Kuala_Lumpur (UTC+8)' },
                { label: 'White-label Mode', value: 'Enabled', highlight: true },
                { label: 'Region', value: 'ap-southeast-1' },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">{f.label}</span>
                  <span className={`text-sm font-outfit ${f.highlight ? 'text-violet-400' : 'text-white/75'}`}>{f.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-4">Modules Enabled</div>
            <div className="space-y-2">
              {['Core HR', 'Leave Management', 'Workforce Monitoring', 'Activity Tracking', 'Identity Verification', 'Exception Engine', 'Org Structure', 'Calendar'].map(m => (
                <div key={m} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="text-white/60 text-sm">{m}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'monitoring' && (
        <GlassCard>
          <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-5">Monitoring Configuration</div>
          <div className="space-y-4">
            {[
              { label: 'Screenshot Capture', sub: 'Every 5 minutes during active sessions', enabled: true },
              { label: 'App Usage Tracking', sub: 'Foreground application monitoring', enabled: true },
              { label: 'Biometric Verification', sub: 'Fingerprint and face verification at clock-in', enabled: true },
              { label: 'Idle Detection', sub: 'Flag inactivity beyond 10 minutes', enabled: true },
              { label: 'Screen Recording', sub: 'Continuous recording — requires consent', enabled: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
                <div>
                  <div className="text-white/75 text-sm font-outfit">{item.label}</div>
                  <div className="text-white/30 text-xs mt-0.5">{item.sub}</div>
                </div>
                <div className={`w-10 h-[22px] rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-violet-600' : 'bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${item.enabled ? 'right-[3px]' : 'left-[3px]'}`} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'People Sync', dir: 'HR → WMS', status: 'Connected', desc: 'Employee records → Workforce system' },
              { name: 'Availability', dir: 'HR → WMS', status: 'Connected', desc: 'Leave + schedules → Shift planning' },
              { name: 'Work Activity', dir: 'WMS → HR', status: 'Connected', desc: 'Clock-in/out + presence → HR records' },
              { name: 'Skills Profile Read', dir: 'HR → WMS', status: 'Connected', desc: 'Competency data → Task assignment' },
            ].map(b => (
              <GlassCard key={b.name}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white/85 text-sm font-outfit font-semibold">{b.name}</div>
                    <div className="text-white/35 text-xs mt-1">{b.desc}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shrink-0 ml-2">
                    {b.status}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-white/25 text-xs font-geist">{b.dir}</span>
                </div>
              </GlassCard>
            ))}
          </div>
          <GlassCard>
            <div className="font-outfit font-medium text-white/50 text-sm mb-4">Live Sync Log</div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {allBridgeLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-white/65 text-sm font-outfit flex-1">{log.bridgeName}</span>
                  <span className="text-white/25 text-xs">
                    {(log as { direction?: string }).direction ?? ''}
                  </span>
                  <span className="text-white/30 text-xs font-geist ml-auto shrink-0">
                    {log.recordCount} rec · {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'branding' && (
        <div className="grid grid-cols-2 gap-6">
          <GlassCard>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-5">White-label Branding</div>
            <div className="space-y-5">
              <div>
                <label className="text-white/50 text-sm block mb-2 font-outfit">Company Name</label>
                <input
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white/85 text-sm outline-none focus:border-violet-500/50 transition-colors font-outfit"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2 font-outfit">Primary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={e => setBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-white/15 bg-transparent cursor-pointer"
                  />
                  <span className="text-white/40 text-sm font-geist">{brandColor}</span>
                </div>
              </div>
              <button
                onClick={() => updateBranding(brandName, brandColor)}
                className="w-full py-2.5 bg-violet-600 rounded-lg text-white text-sm font-outfit hover:bg-violet-700 transition-colors"
              >
                Apply Branding
              </button>
              <p className="text-white/25 text-xs leading-relaxed">
                Applies to topbar name, accent color, and logo — demonstrating ONEVO's white-label capability.
              </p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-5">Preview</div>
            <div className="rounded-xl overflow-hidden border border-white/[0.07]">
              <div className="h-10 flex items-center px-4 border-b border-white/[0.06]" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <span className="text-sm font-outfit font-semibold" style={{ color: brandColor }}>{brandName || 'Your Company'}</span>
              </div>
              <div className="flex">
                <div className="w-12 bg-white/[0.02] h-32 flex flex-col items-center pt-2 gap-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-7 h-7 rounded-lg" style={{ backgroundColor: i === 1 ? brandColor + '30' : 'rgba(255,255,255,0.03)' }} />
                  ))}
                </div>
                <div className="flex-1 p-3 bg-white/[0.01]">
                  <div className="h-3 w-24 rounded bg-white/10 mb-2" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.06]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'alerts' && (
        <GlassCard>
          <div className="text-white/35 text-xs font-outfit uppercase tracking-wider mb-5">Exception Rules</div>
          <div className="space-y-2">
            {[
              { rule: 'Late Clock-In', threshold: '> 30 min after shift start', severity: 'low', active: true },
              { rule: 'Unproductive App Usage', threshold: '> 15 min during work hours', severity: 'medium', active: true },
              { rule: 'Biometric Failure', threshold: '3 consecutive failures', severity: 'high', active: true },
              { rule: 'No Clock-In', threshold: '60 min after shift start', severity: 'critical', active: true },
              { rule: 'Extended Break', threshold: '> 45 min break duration', severity: 'low', active: false },
            ].map(r => (
              <div key={r.rule} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                <div className="flex-1">
                  <div className="text-white/80 text-sm font-outfit">{r.rule}</div>
                  <div className="text-white/30 text-xs mt-0.5">{r.threshold}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  r.severity === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  r.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  r.severity === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {r.severity}
                </span>
                <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${r.active ? 'bg-violet-600' : 'bg-white/10'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-all ${r.active ? 'right-[3px]' : 'left-[3px]'}`} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
