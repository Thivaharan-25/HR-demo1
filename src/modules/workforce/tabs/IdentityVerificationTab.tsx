import { employees } from '../../../mock/data/employees'
import { biometricEvents } from '../../../mock/data/presence'
import { GlassCard } from '../../../components/ui/GlassCard'

const verificationLog = [
  { id: 'iv1', employeeId: 'e3', method: 'Face Recognition', result: 'verified', confidence: 98.2, device: 'BIO-001', capturedAt: '2026-04-18 08:55', liveness: true },
  { id: 'iv2', employeeId: 'e2', method: 'Fingerprint', result: 'verified', confidence: 99.1, device: 'BIO-001', capturedAt: '2026-04-18 08:47', liveness: true },
  { id: 'iv3', employeeId: 'e8', method: 'Fingerprint', result: 'failed', confidence: 42.3, device: 'BIO-004', capturedAt: '2026-04-18 08:30', liveness: false },
  { id: 'iv4', employeeId: 'e8', method: 'Fingerprint', result: 'failed', confidence: 38.7, device: 'BIO-004', capturedAt: '2026-04-18 08:31', liveness: false },
  { id: 'iv5', employeeId: 'e8', method: 'NFC Card', result: 'verified', confidence: 100, device: 'BIO-003', capturedAt: '2026-04-18 08:32', liveness: true },
  { id: 'iv6', employeeId: 'e6', method: 'Face Recognition', result: 'verified', confidence: 95.6, device: 'BIO-001', capturedAt: '2026-04-18 09:10', liveness: true },
  { id: 'iv7', employeeId: 'e4', method: 'Fingerprint', result: 'verified', confidence: 97.8, device: 'BIO-001', capturedAt: '2026-04-18 09:05', liveness: true },
  { id: 'iv8', employeeId: 'e9', method: 'NFC Card', result: 'verified', confidence: 100, device: 'BIO-003', capturedAt: '2026-04-18 09:02', liveness: true },
]

const statusSummary = {
  verified: verificationLog.filter(v => v.result === 'verified').length,
  failed: verificationLog.filter(v => v.result === 'failed').length,
  pending: employees.length - new Set(verificationLog.filter(v => v.result === 'verified').map(v => v.employeeId)).size,
}

export function IdentityVerificationTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Verified Today', value: statusSummary.verified, color: 'text-green-400' },
          { label: 'Failed Attempts', value: statusSummary.failed, color: 'text-red-400' },
          { label: 'Not Yet Clocked In', value: statusSummary.pending, color: 'text-white/55' },
        ].map(s => (
          <GlassCard key={s.label} className="!py-3">
            <div className="text-white/35 text-[11px] font-outfit uppercase tracking-wider">{s.label}</div>
            <div className={`text-xl font-geist font-semibold mt-1 ${s.color}`}>{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-4 text-sm">Employee Verification Status</div>
        <div className="grid grid-cols-2 gap-2">
          {employees.map(emp => {
            const latest = verificationLog.filter(v => v.employeeId === emp.id).sort((a, b) => b.capturedAt.localeCompare(a.capturedAt))[0]
            return (
              <div key={emp.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${latest?.result === 'verified' ? 'bg-green-500/[0.03] border-green-500/15' : latest ? 'bg-red-500/[0.03] border-red-500/15' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full border border-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="text-white/80 text-sm font-outfit">{emp.name}</div>
                  {latest ? (
                    <div className="text-white/30 text-xs">{latest.method} · {latest.capturedAt.split(' ')[1]}</div>
                  ) : (
                    <div className="text-white/25 text-xs">Not clocked in</div>
                  )}
                </div>
                {latest ? (
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-outfit ${latest.result === 'verified' ? 'text-green-400' : 'text-red-400'}`}>{latest.result}</span>
                    {latest.result === 'verified' && <div className="text-white/25 text-[10px]">{latest.confidence.toFixed(1)}%</div>}
                  </div>
                ) : (
                  <span className="text-white/25 text-xs">—</span>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-4 text-sm">Verification Log</div>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {verificationLog.map(entry => {
            const emp = employees.find(e => e.id === entry.employeeId)
            return (
              <div key={entry.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${entry.result === 'verified' ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-red-500/[0.04] border-red-500/20'}`}>
                <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full border border-white/10" />
                <div className="flex-1 min-w-0">
                  <span className="text-white/75 text-sm font-outfit">{emp?.name}</span>
                  <span className="text-white/30 text-xs ml-2">{entry.method}</span>
                </div>
                <span className="text-white/25 text-xs">{entry.device}</span>
                <span className={`text-xs font-geist font-semibold ${entry.result === 'verified' ? 'text-green-400' : 'text-red-400'}`}>
                  {entry.result === 'verified' ? `${entry.confidence.toFixed(1)}%` : 'FAILED'}
                </span>
                <span className="text-white/20 text-xs font-geist w-16 text-right shrink-0">{entry.capturedAt.split(' ')[1]}</span>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {biometricEvents.length > 0 && (
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-3 text-sm">Biometric Events (Live)</div>
          <div className="space-y-2">
            {biometricEvents.slice(0, 5).map((ev, i) => {
              const emp = employees.find(e => e.id === ev.employeeId)
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <img src={emp?.avatar} alt={emp?.name} className="w-7 h-7 rounded-full" />
                  <span className="text-white/70 text-sm flex-1">{emp?.name}</span>
                  <span className="text-white/40 text-xs capitalize">{ev.type}</span>
                  <span className={`text-xs font-geist ${ev.result === 'verified' ? 'text-green-400' : 'text-red-400'}`}>{ev.result}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
