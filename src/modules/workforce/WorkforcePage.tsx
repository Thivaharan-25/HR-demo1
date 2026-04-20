import { useState } from 'react'
import { OverviewTab } from './tabs/OverviewTab'
import { ActivityTab2 } from './tabs/ActivityTab2'
import { WorkInsightsTab } from './tabs/WorkInsightsTab'
import { OnlineStatusTab } from './tabs/OnlineStatusTab'
import { IdentityVerificationTab } from './tabs/IdentityVerificationTab'
import { ShiftScheduleTab } from './tabs/ShiftScheduleTab'
import { AttendanceCorrectionTab } from './tabs/AttendanceCorrectionTab'
import { OvertimeTab } from './tabs/OvertimeTab'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard, Activity, BarChart3, Wifi,
  Fingerprint, CalendarRange, ClipboardEdit, Clock4,
  type LucideIcon,
} from 'lucide-react'

const tabs: { id: string; label: string; icon: LucideIcon; badge?: string }[] = [
  { id: 'overview',              label: 'Overview',              icon: LayoutDashboard },
  { id: 'activity',              label: 'Activity',              icon: Activity },
  { id: 'work-insights',         label: 'Insights',              icon: BarChart3 },
  { id: 'online-status',         label: 'Online Status',         icon: Wifi },
  { id: 'identity-verification', label: 'Identity',              icon: Fingerprint },
  { id: 'shifts',                label: 'Shifts',                icon: CalendarRange },
  { id: 'attendance',            label: 'Attendance',            icon: ClipboardEdit },
  { id: 'overtime',              label: 'Overtime',              icon: Clock4 },
]

export function WorkforcePage() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workforce Monitor</h1>
          <p className="text-white/35 text-sm mt-0.5">Real-time presence, activity & productivity intelligence</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/80 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 overflow-x-auto scrollbar-none bg-white/[0.025] border border-white/[0.07] rounded-2xl p-1.5">
        {tabs.map(t => {
          const active = tab === t.id
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium whitespace-nowrap transition-all duration-150 relative shrink-0',
                active
                  ? 'bg-violet-600/20 text-violet-200 border border-violet-500/25 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.1),0_2px_8px_rgba(124,58,237,0.12)]'
                  : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]'
              )}
            >
              <Icon
                size={14}
                className={cn('shrink-0 transition-colors', active ? 'text-violet-400' : 'text-current')}
              />
              {t.label}
              {t.badge && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-violet-500/30 text-violet-300 text-[9px] font-bold">
                  {t.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {tab === 'overview'              && <OverviewTab />}
        {tab === 'activity'              && <ActivityTab2 />}
        {tab === 'work-insights'         && <WorkInsightsTab />}
        {tab === 'online-status'         && <OnlineStatusTab />}
        {tab === 'identity-verification' && <IdentityVerificationTab />}
        {tab === 'shifts'                && <ShiftScheduleTab />}
        {tab === 'attendance'            && <AttendanceCorrectionTab />}
        {tab === 'overtime'              && <OvertimeTab />}
      </div>
    </div>
  )
}
