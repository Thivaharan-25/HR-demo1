import { useNavigate, useLocation } from 'react-router-dom'
import { useNavStore } from '../../store/navStore'
import { cn } from '../../lib/utils'
import {
  User, CalendarDays, GitBranch, Building2, Users,
  ShieldCheck, ClipboardList, MonitorDot, Laptop, CheckSquare2,
  Settings, Eye, Plug, Palette, Bell, FileText, type LucideIcon,
} from 'lucide-react'

type SubNavItem = {
  label: string
  path: string
  icon: LucideIcon
}

const subNavConfig: Record<string, { label: string; items: SubNavItem[] }> = {
  people: {
    label: 'People',
    items: [
      { label: 'Employees', path: '/people/employees', icon: User },
      { label: 'Leave', path: '/people/leave', icon: CalendarDays },
      { label: 'Documents', path: '/people/documents', icon: FileText },
    ],
  },
  org: {
    label: 'Organization',
    items: [
      { label: 'Org Chart', path: '/org', icon: GitBranch },
      { label: 'Departments', path: '/org?tab=departments', icon: Building2 },
      { label: 'Teams', path: '/org?tab=teams', icon: Users },
    ],
  },
  admin: {
    label: 'Admin',
    items: [
      { label: 'Users & Roles', path: '/admin', icon: ShieldCheck },
      { label: 'Audit Log', path: '/admin?tab=audit', icon: ClipboardList },
      { label: 'Agents', path: '/admin?tab=agents', icon: MonitorDot },
      { label: 'Devices', path: '/admin?tab=devices', icon: Laptop },
      { label: 'Compliance', path: '/admin?tab=compliance', icon: CheckSquare2 },
    ],
  },
  settings: {
    label: 'Settings',
    items: [
      { label: 'General', path: '/settings', icon: Settings },
      { label: 'Monitoring', path: '/settings?tab=monitoring', icon: Eye },
      { label: 'Integrations', path: '/settings?tab=integrations', icon: Plug },
      { label: 'Branding', path: '/settings?tab=branding', icon: Palette },
      { label: 'Alert Rules', path: '/settings?tab=alerts', icon: Bell },
    ],
  },
}

function isItemActive(itemPath: string, pathname: string, search: string): boolean {
  const [itemPathname, itemQuery] = itemPath.split('?')
  const itemParams = new URLSearchParams(itemQuery ?? '')
  const itemTab = itemParams.get('tab')
  if (itemTab) {
    if (pathname !== itemPathname) return false
    const currentTab = new URLSearchParams(search).get('tab')
    return itemTab === currentTab
  }
  if (!itemQuery) {
    return pathname === itemPathname || pathname.startsWith(itemPathname + '/')
  }
  return pathname === itemPathname
}

export function ExpansionPanel() {
  const { activePillar, panelOpen } = useNavStore()
  const navigate = useNavigate()
  const location = useLocation()

  const config = activePillar ? subNavConfig[activePillar] : null

  return (
    <aside
      className={cn(
        'fixed top-14 left-16 bottom-0 w-[220px] z-30',
        'flex flex-col',
        'bg-white/[0.02] border-r border-white/[0.06]',
        'transition-transform duration-200 ease-in-out',
        panelOpen && config ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {config && (
        <div className="flex-1 overflow-y-auto p-3 pt-5">
          {/* Section label */}
          <div className="text-white/25 text-[10px] font-outfit uppercase tracking-[0.12em] mb-4 px-2">
            {config.label}
          </div>

          {/* Nav items */}
          <nav className="space-y-0.5">
            {config.items.map(item => {
              const active = isItemActive(item.path, location.pathname, location.search)
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-outfit transition-all duration-150 text-left',
                    active
                      ? 'bg-violet-600/[0.15] text-white border border-violet-500/[0.25] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                      : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <item.icon size={14} className={active ? 'text-violet-400' : 'text-current'} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Bottom border accent */}
      {config && (
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mx-3 mb-4" />
      )}
    </aside>
  )
}
