import { calendarEvents } from '../../mock/data/calendar'
import { GlassCard } from '../../components/ui/GlassCard'

const typeColor: Record<string, string> = {
  holiday: 'bg-red-500/20 text-red-400',
  company: 'bg-blue-500/20 text-blue-400',
  leave: 'bg-yellow-500/20 text-yellow-400',
}

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-outfit font-bold text-white">Calendar</h1>
      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-4">April 2026</div>
        <div className="space-y-3">
          {calendarEvents.map(ev => (
            <div key={ev.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${typeColor[ev.type]}`}>{ev.type}</span>
              <span className="text-white text-sm flex-1">{ev.title}</span>
              <span className="text-white/40 text-xs font-geist">
                {(ev as { date?: string }).date ?? (ev as { startDate?: string }).startDate}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
