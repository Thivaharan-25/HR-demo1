import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'

const shifts = [
  { name: 'Standard 9-6', start: '09:00', end: '18:00', break: '1h', days: 'Mon–Fri', employees: ['e1','e2','e3','e4','e7','e8','e9','e10'] },
  { name: 'Flexible', start: 'Flexible', end: 'Flexible', break: '1h', days: 'Mon–Fri', employees: ['e6'] },
]

const schedule: Record<string, { day: string; start: string; end: string; status: string }[]> = {
  e3: [
    { day: 'Mon', start: '09:05', end: '18:10', status: 'completed' },
    { day: 'Tue', start: '09:00', end: '18:00', status: 'completed' },
    { day: 'Wed', start: '09:15', end: '18:30', status: 'completed' },
    { day: 'Thu', start: '09:00', end: '18:00', status: 'completed' },
    { day: 'Fri', start: '—', end: '—', status: 'leave' },
  ],
}

export function ShiftScheduleTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {shifts.map(s => (
          <GlassCard key={s.name}>
            <div className="font-outfit font-semibold text-white/85 text-sm mb-3">{s.name}</div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-white/40">Hours</span><span className="text-white/65 font-geist">{s.start} – {s.end}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Break</span><span className="text-white/65">{s.break}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Days</span><span className="text-white/65">{s.days}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Assigned</span><span className="text-white/65">{s.employees.length} employees</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
              {s.employees.map(eid => {
                const emp = employees.find(e => e.id === eid)
                return <img key={eid} src={emp?.avatar} alt={emp?.name} className="w-6 h-6 rounded-full border border-white/10" title={emp?.name} />
              })}
            </div>
          </GlassCard>
        ))}
      </div>
      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-4 text-sm">This Week — Aisha Noor</div>
        <div className="grid grid-cols-5 gap-3">
          {(schedule['e3'] ?? []).map(day => (
            <div key={day.day} className={`p-3 rounded-xl border text-center ${day.status === 'leave' ? 'bg-amber-500/[0.05] border-amber-500/20' : 'bg-white/[0.02] border-white/[0.05]'}`}>
              <div className="text-white/40 text-xs font-outfit mb-2">{day.day}</div>
              {day.status === 'leave' ? (
                <div className="text-amber-400 text-xs">On Leave</div>
              ) : (
                <>
                  <div className="text-white/70 text-xs font-geist">{day.start}</div>
                  <div className="text-white/30 text-[10px] mt-0.5">→</div>
                  <div className="text-white/70 text-xs font-geist">{day.end}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
