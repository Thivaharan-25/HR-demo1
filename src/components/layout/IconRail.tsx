import { Home, Users, Radio, Building2, CalendarDays, Bell, Settings, ShieldCheck, BookOpen, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLiveStore } from '../../store/liveStore'
import { useAuthStore } from '../../store/authStore'
import { useNavStore, PANEL_PILLARS, type PillarKey } from '../../store/navStore'
import { cn } from '../../lib/utils'

const pillars: Array<{
  icon: LucideIcon
  label: string
  defaultPath: string
  pillarKey: PillarKey
  module: string | null
}> = [
  { icon: Home, label: 'Home', defaultPath: '/', pillarKey: 'home', module: null },
  { icon: Users, label: 'People', defaultPath: '/people/employees', pillarKey: 'people', module: 'core-hr' },
  { icon: Radio, label: 'Workforce', defaultPath: '/workforce', pillarKey: 'workforce', module: 'workforce' },
  { icon: Building2, label: 'Org', defaultPath: '/org', pillarKey: 'org', module: 'org-structure' },
  { icon: BookOpen, label: 'Skills', defaultPath: '/skills', pillarKey: 'skills', module: null },
  { icon: CalendarDays, label: 'Calendar', defaultPath: '/calendar', pillarKey: 'calendar', module: 'calendar' },
  { icon: Bell, label: 'Inbox', defaultPath: '/inbox', pillarKey: 'inbox', module: 'notifications' },
  { icon: ShieldCheck, label: 'Admin', defaultPath: '/admin', pillarKey: 'admin', module: 'admin' },
  { icon: Settings, label: 'Settings', defaultPath: '/settings', pillarKey: 'settings', module: 'settings' },
]

export function IconRail() {
  const navigate = useNavigate()
  const inboxCount = useLiveStore((s) => s.inboxCount)
  const grantedModules = useAuthStore((s) => s.grantedModules)
  const { activePillar, togglePillar, setActivePillar } = useNavStore()

  const handleClick = (pillarKey: PillarKey, defaultPath: string) => {
    if (PANEL_PILLARS.includes(pillarKey)) {
      togglePillar(pillarKey)
      navigate(defaultPath)
    } else {
      setActivePillar(pillarKey)
      navigate(defaultPath)
    }
  }

  return (
    <div className="w-16 h-screen flex flex-col items-center py-4 pt-3 gap-0.5 fixed left-0 top-0 z-50 bg-[#08080f]/90 backdrop-blur-xl border-r border-white/[0.05]">
      {/* Logo mark */}
      <div className="w-9 h-9 rounded-xl bg-violet-600 mb-4 mt-0.5 flex items-center justify-center text-white font-bold text-[15px] font-outfit shadow-[0_0_24px_rgba(124,58,237,0.45)]">
        N
      </div>

      {pillars.map(({ icon: Icon, label, defaultPath, pillarKey, module }) => {
        if (module && !grantedModules.includes(module)) return null
        const active = activePillar === pillarKey

        return (
          <button
            key={pillarKey}
            onClick={() => handleClick(pillarKey, defaultPath)}
            title={label}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center relative transition-all duration-150 group',
              active
                ? 'bg-violet-600/[0.18] text-violet-300 shadow-[inset_0_0_0_1px_rgba(124,58,237,0.3),0_0_12px_rgba(124,58,237,0.1)]'
                : 'text-white/30 hover:text-white/65 hover:bg-white/[0.05]'
            )}
          >
            <Icon size={17} />

            {/* Active left indicator */}
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[18px] w-1 h-5 rounded-r-full bg-violet-500" />
            )}

            {/* Inbox badge */}
            {label === 'Inbox' && inboxCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-violet-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.6)]">
                {inboxCount > 9 ? '9+' : inboxCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
