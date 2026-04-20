import { useState, useMemo } from 'react'
import { calendarEvents, type CalendarEventType } from '../../mock/data/calendar'
import { GlassCard } from '../../components/ui/GlassCard'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const typeConfig: Record<CalendarEventType, { label: string; dot: string; pill: string }> = {
  holiday: { label: 'Holiday', dot: 'bg-red-400', pill: 'bg-red-500/15 text-red-400 border-red-500/20' },
  company: { label: 'Company', dot: 'bg-violet-400', pill: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  team: { label: 'Team', dot: 'bg-sky-400', pill: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  leave: { label: 'Leave', dot: 'bg-amber-400', pill: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  review: { label: 'Review', dot: 'bg-orange-400', pill: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  personal: { label: 'Personal', dot: 'bg-gray-400', pill: 'bg-white/10 text-white/50 border-white/15' },
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function getEventsForDate(dateStr: string) {
  return calendarEvents.filter(ev => {
    if (ev.date) return ev.date === dateStr
    if (ev.startDate && ev.endDate) {
      return dateStr >= ev.startDate && dateStr <= ev.endDate
    }
    return false
  })
}

function pad(n: number) { return String(n).padStart(2, '0') }

export function CalendarPage() {
  const today = new Date('2026-04-18')
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [activeFilters, setActiveFilters] = useState<CalendarEventType[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }

  const toggleFilter = (type: CalendarEventType) => {
    setActiveFilters(prev =>
      prev.includes(type) ? prev.filter(f => f !== type) : [...prev, type]
    )
  }

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return []
    return getEventsForDate(selectedDate).filter(ev =>
      activeFilters.length === 0 || activeFilters.includes(ev.type)
    )
  }, [selectedDate, activeFilters])

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <p className="text-white/35 text-sm mt-0.5">Company events, leave & holidays</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-white text-sm font-medium transition-colors shadow-[0_0_16px_rgba(124,58,237,0.3)]"
        >
          <Plus size={15} /> Add Event
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(typeConfig) as CalendarEventType[]).map(type => {
          const cfg = typeConfig[type]
          const active = activeFilters.includes(type)
          const count = calendarEvents.filter(e => e.type === type).length
          return (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all',
                active ? cfg.pill : 'bg-white/[0.03] border-white/[0.08] text-white/35 hover:text-white/60'
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
              {cfg.label}
              <span className="opacity-60">{count}</span>
            </button>
          )
        })}
        {activeFilters.length > 0 && (
          <button onClick={() => setActiveFilters([])} className="px-3 py-1 rounded-full text-xs border border-white/[0.08] text-white/30 hover:text-white/60 transition-colors">
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Calendar Grid */}
        <GlassCard className="p-0 overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="font-semibold text-white">{MONTHS[month]} {year}</div>
            <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-white/[0.05]">
            {DAYS.map(d => (
              <div key={d} className="py-2.5 text-center text-white/25 text-[11px] uppercase tracking-wide font-medium">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1
              const isValid = dayNum > 0 && dayNum <= daysInMonth
              const dateStr = isValid ? `${year}-${pad(month + 1)}-${pad(dayNum)}` : ''
              const isToday = dateStr === todayStr
              const isSelected = dateStr === selectedDate
              const eventsOnDay = isValid
                ? getEventsForDate(dateStr).filter(ev => activeFilters.length === 0 || activeFilters.includes(ev.type))
                : []
              const isWeekend = (i % 7 === 0 || i % 7 === 6)

              return (
                <div
                  key={i}
                  onClick={() => isValid && setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    'min-h-[80px] p-2 border-b border-r border-white/[0.04] transition-colors',
                    isValid && 'cursor-pointer hover:bg-white/[0.02]',
                    isSelected && 'bg-violet-600/[0.08] border-violet-500/20',
                    isWeekend && isValid && 'bg-white/[0.01]',
                    !isValid && 'opacity-30'
                  )}
                >
                  {isValid && (
                    <>
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium mb-1.5 transition-all',
                        isToday ? 'bg-violet-600 text-white shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'text-white/50'
                      )}>
                        {dayNum}
                      </div>
                      <div className="space-y-0.5">
                        {eventsOnDay.slice(0, 2).map(ev => {
                          const cfg = typeConfig[ev.type]
                          return (
                            <div key={ev.id} className={cn('flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] truncate border', cfg.pill)}>
                              <span className={cn('w-1 h-1 rounded-full shrink-0', cfg.dot)} />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          )
                        })}
                        {eventsOnDay.length > 2 && (
                          <div className="text-[9px] text-white/30 pl-1.5">+{eventsOnDay.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Sidebar: selected day events / upcoming */}
        <div className="space-y-3">
          {selectedDate ? (
            <GlassCard>
              <div className="flex items-center justify-between mb-3">
                <div className="text-white/70 font-semibold text-sm">
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <button onClick={() => setSelectedDate(null)} className="text-white/20 hover:text-white/50 transition-colors">
                  <X size={13} />
                </button>
              </div>
              {selectedEvents.length === 0 ? (
                <div className="text-white/25 text-sm text-center py-4">No events</div>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(ev => {
                    const cfg = typeConfig[ev.type]
                    return (
                      <div key={ev.id} className={cn('p-3 rounded-xl border', cfg.pill)}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                          <span className="text-xs font-medium">{ev.title}</span>
                        </div>
                        {ev.description && <div className="text-[10px] opacity-70 leading-relaxed">{ev.description}</div>}
                        {ev.startDate && ev.endDate && ev.startDate !== ev.endDate && (
                          <div className="text-[10px] opacity-60 mt-1 font-geist">{ev.startDate} → {ev.endDate}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="text-white/50 text-xs text-center py-3">Click a date to see events</div>
            </GlassCard>
          )}

          {/* Upcoming events */}
          <GlassCard>
            <div className="text-white/70 font-semibold text-sm mb-3">Upcoming</div>
            <div className="space-y-2.5">
              {calendarEvents
                .filter(ev => (ev.date ?? ev.startDate ?? '') >= todayStr)
                .filter(ev => activeFilters.length === 0 || activeFilters.includes(ev.type))
                .sort((a, b) => (a.date ?? a.startDate ?? '') > (b.date ?? b.startDate ?? '') ? 1 : -1)
                .slice(0, 6)
                .map(ev => {
                  const cfg = typeConfig[ev.type]
                  const dateLabel = ev.date ?? ev.startDate ?? ''
                  return (
                    <div key={ev.id} className="flex items-start gap-2.5">
                      <div className={cn('w-1 h-full min-h-[32px] rounded-full shrink-0', cfg.dot)} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white/75 text-xs font-medium truncate">{ev.title}</div>
                        <div className="text-white/30 text-[10px] font-geist mt-0.5">{dateLabel}</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Create event modal */}
      {showCreate && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreate(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="bg-[#131220] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
                <div className="text-white font-semibold">New Event</div>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="px-5 py-5 space-y-4">
                <div>
                  <label className="text-white/45 text-xs block mb-1.5">Title</label>
                  <input className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" placeholder="Event title" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/45 text-xs block mb-1.5">Date</label>
                    <input type="date" className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="text-white/45 text-xs block mb-1.5">Type</label>
                    <select className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-white text-sm focus:outline-none">
                      {(Object.keys(typeConfig) as CalendarEventType[]).map(t => (
                        <option key={t} value={t} className="bg-[#131220] capitalize">{typeConfig[t].label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/45 text-xs block mb-1.5">Description</label>
                  <textarea rows={2} className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-white/[0.07] flex justify-end gap-2">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white/60 transition-colors">Cancel</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors">Create</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
