import { useState } from 'react'
import { OverviewTab } from './tabs/OverviewTab'
import { PresenceTab } from './tabs/PresenceTab'
import { ActivityTab2 } from './tabs/ActivityTab2'
import { ExceptionsTab } from './tabs/ExceptionsTab'
import { cn } from '../../lib/utils'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'presence', label: 'Presence' },
  { id: 'activity', label: 'Activity' },
  { id: 'exceptions', label: 'Exceptions' },
]

export function WorkforcePage() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-outfit font-bold text-white">Workforce Monitor</h1>
      <div className="flex gap-1">
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
      {tab === 'presence' && <PresenceTab />}
      {tab === 'activity' && <ActivityTab2 />}
      {tab === 'exceptions' && <ExceptionsTab />}
    </div>
  )
}
