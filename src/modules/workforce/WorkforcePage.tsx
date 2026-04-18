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

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'work-insights', label: 'Work Insights' },
  { id: 'online-status', label: 'Online Status' },
  { id: 'identity-verification', label: 'Identity Verification' },
  { id: 'shifts', label: 'Shift Schedule' },
  { id: 'attendance', label: 'Attendance Correction' },
  { id: 'overtime', label: 'Overtime' },
]

export function WorkforcePage() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-outfit font-bold text-white">Workforce Monitor</h1>
      <div className="flex gap-1 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('px-4 py-2 rounded-lg text-sm font-outfit transition-colors',
              tab === t.id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70'
            )}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <OverviewTab />}
      {tab === 'activity' && <ActivityTab2 />}
      {tab === 'work-insights' && <WorkInsightsTab />}
      {tab === 'online-status' && <OnlineStatusTab />}
      {tab === 'identity-verification' && <IdentityVerificationTab />}
      {tab === 'shifts' && <ShiftScheduleTab />}
      {tab === 'attendance' && <AttendanceCorrectionTab />}
      {tab === 'overtime' && <OvertimeTab />}
    </div>
  )
}
