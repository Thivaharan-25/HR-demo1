import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useNavStore } from '../../store/navStore'
import { useLiveStore } from '../../store/liveStore'
import { cn } from '../../lib/utils'
import {
  Home, Users, Radio, Building2, BookOpen, CalendarDays, Bell,
  Settings, ShieldCheck, ChevronDown, LogOut, Zap,
  User, CalendarCheck, GitBranch, MonitorDot, Laptop,
  CheckSquare2, Eye, Plug, Palette, ClipboardList,
  FileText, type LucideIcon,
} from 'lucide-react'

type NavChild = { icon: LucideIcon; label: string; path: string }

type NavItem = {
  icon: LucideIcon
  label: string
  path: string
  pillarKey: string
  module?: string | null
  children?: NavChild[]
}

type NavSection = {
  label?: string
  dev3?: boolean          // renders the glowing Dev 3 box
  items: NavItem[]
}

const sections: NavSection[] = [
  {
    items: [
      { icon: Home, label: 'Home', path: '/', pillarKey: 'home' },
      {
        icon: Users, label: 'People', path: '/people/employees', pillarKey: 'people', module: 'core-hr',
        children: [
          { icon: User, label: 'Employees', path: '/people/employees' },
          { icon: CalendarCheck, label: 'Leave', path: '/people/leave' },
          { icon: FileText, label: 'Documents', path: '/people/documents' },
        ],
      },
    ],
  },
  {
    label: 'Dev 3',
    dev3: true,
    items: [
      { icon: Radio, label: 'Workforce', path: '/workforce', pillarKey: 'workforce', module: 'workforce' },
      {
        icon: Building2, label: 'Org Structure', path: '/org', pillarKey: 'org', module: 'org-structure',
        children: [
          { icon: GitBranch, label: 'Org Chart', path: '/org' },
          { icon: Building2, label: 'Departments', path: '/org?tab=departments' },
          { icon: Users, label: 'Teams', path: '/org?tab=teams' },
        ],
      },
      { icon: BookOpen, label: 'Skills', path: '/skills', pillarKey: 'skills' },
      { icon: CalendarDays, label: 'Calendar', path: '/calendar', pillarKey: 'calendar', module: 'calendar' },
    ],
  },
  {
    items: [
      { icon: Bell, label: 'Inbox', path: '/inbox', pillarKey: 'inbox', module: 'notifications' },
      {
        icon: ShieldCheck, label: 'Admin', path: '/admin', pillarKey: 'admin', module: 'admin',
        children: [
          { icon: ShieldCheck, label: 'Users & Roles', path: '/admin' },
          { icon: ClipboardList, label: 'Audit Log', path: '/admin?tab=audit' },
          { icon: MonitorDot, label: 'Agents', path: '/admin?tab=agents' },
          { icon: Laptop, label: 'Devices', path: '/admin?tab=devices' },
          { icon: CheckSquare2, label: 'Compliance', path: '/admin?tab=compliance' },
        ],
      },
      {
        icon: Settings, label: 'Settings', path: '/settings', pillarKey: 'settings', module: 'settings',
        children: [
          { icon: Settings, label: 'General', path: '/settings' },
          { icon: Eye, label: 'Monitoring', path: '/settings?tab=monitoring' },
          { icon: Plug, label: 'Integrations', path: '/settings?tab=integrations' },
          { icon: Palette, label: 'Branding', path: '/settings?tab=branding' },
        ],
      },
    ],
  },
]

function isPathActive(itemPath: string, pathname: string, search: string): boolean {
  const [itemPathname, itemQuery] = itemPath.split('?')
  const itemTab = new URLSearchParams(itemQuery ?? '').get('tab')
  if (itemTab) {
    if (pathname !== itemPathname) return false
    return new URLSearchParams(search).get('tab') === itemTab
  }
  if (!itemQuery) {
    if (itemPathname === '/') return pathname === '/'
    return pathname === itemPathname || pathname.startsWith(itemPathname + '/')
  }
  return pathname === itemPathname
}

function isPillarActive(item: NavItem, pathname: string): boolean {
  if (item.pillarKey === 'home') return pathname === '/'
  return pathname.startsWith('/' + item.pillarKey) ||
    (item.children?.some(c => isPathActive(c.path, pathname, '')) ?? false)
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, grantedModules } = useAuthStore()
  const logout = useAuthStore((s) => s.logout)
  const { setActivePillar } = useNavStore()
  const inboxCount = useLiveStore((s) => s.inboxCount)

  const allItems = sections.flatMap(s => s.items)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    allItems.forEach(item => { if (item.children) init[item.pillarKey] = true })
    return init
  })

  const toggleExpand = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const handleNav = (item: NavItem) => {
    setActivePillar(item.pillarKey as Parameters<typeof setActivePillar>[0])
    if (item.children) toggleExpand(item.pillarKey)
    else navigate(item.path)
  }

  const renderItem = (item: NavItem) => {
    if (item.module && !grantedModules.includes(item.module)) return null

    const pillarActive = isPillarActive(item, location.pathname)
    const isOpen = expanded[item.pillarKey]
    const hasChildren = !!item.children
    const Icon = item.icon

    return (
      <div key={item.pillarKey}>
        <button
          onClick={() => handleNav(item)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left relative',
            pillarActive && !hasChildren
              ? 'bg-violet-600/[0.18] text-violet-200 border border-violet-500/[0.25] shadow-[inset_0_0_0_1px_rgba(124,58,237,0.1)]'
              : pillarActive && hasChildren
              ? 'text-white/85 hover:bg-white/[0.04]'
              : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04]'
          )}
        >
          {pillarActive && !hasChildren && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-violet-500" />
          )}
          <Icon size={15} className={cn('shrink-0', pillarActive && !hasChildren ? 'text-violet-400' : '')} />
          <span className="flex-1 truncate">{item.label}</span>

          {item.pillarKey === 'inbox' && inboxCount > 0 && (
            <span className="w-[18px] h-[18px] rounded-full bg-violet-500 text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(124,58,237,0.5)]">
              {inboxCount > 9 ? '9+' : inboxCount}
            </span>
          )}

          {hasChildren && (
            <ChevronDown size={12} className={cn('shrink-0 text-white/20 transition-transform duration-200', isOpen ? 'rotate-0' : '-rotate-90')} />
          )}
        </button>

        {hasChildren && isOpen && (
          <div className="ml-4 mt-0.5 mb-0.5 pl-3 border-l border-white/[0.07] space-y-0.5">
            {item.children!.map(child => {
              const active = isPathActive(child.path, location.pathname, location.search)
              const ChildIcon = child.icon
              return (
                <button
                  key={child.path}
                  onClick={() => navigate(child.path)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-[7px] rounded-lg text-[12px] transition-all text-left',
                    active
                      ? 'bg-violet-600/[0.15] text-violet-300 border border-violet-500/20'
                      : 'text-white/30 hover:text-white/65 hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <ChildIcon size={12} className={active ? 'text-violet-400' : 'text-current'} />
                  {child.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] z-50 flex flex-col bg-[#08080f]/95 backdrop-blur-xl border-r border-white/[0.06]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.06] shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-[13px] shadow-[0_0_20px_rgba(124,58,237,0.45)]">
          N
        </div>
        <div>
          <div className="text-white font-semibold text-[13px] leading-none">OneVo</div>
          <div className="text-white/30 text-[10px] mt-0.5">HR Platform</div>
        </div>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-2.5 px-2 scrollbar-none space-y-1">
        {sections.map((section, si) => {
          if (section.dev3) {
            return (
              <div key={si} className="relative">
                {/* Dev 3 box */}
                <div className="rounded-xl border border-violet-500/[0.18] bg-violet-500/[0.04] shadow-[inset_0_0_20px_rgba(124,58,237,0.04)] p-1.5">
                  {/* Dev 3 badge */}
                  <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-0.5">
                    <div className="w-3.5 h-3.5 rounded flex items-center justify-center bg-violet-500/20">
                      <Zap size={8} className="text-violet-400" />
                    </div>
                    <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-violet-400/70">Dev 3</span>
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map(renderItem)}
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div key={si} className="space-y-0.5">
              {si > 0 && <div className="h-px bg-white/[0.05] mx-2 my-1" />}
              {section.items.map(renderItem)}
            </div>
          )
        })}
      </nav>

      {/* User card */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-colors">
          <div className="relative shrink-0">
            <img src={user?.avatar} alt={user?.name} className="w-7 h-7 rounded-full border border-white/15" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#08080f]" />
          </div>
          <div className="flex-1 min-w-0 leading-none">
            <div className="text-white/75 text-[12px] font-medium truncate">{user?.name}</div>
            <div className="text-white/30 text-[10px] mt-0.5 truncate">{user?.jobTitle}</div>
          </div>
          <button onClick={() => { logout(); navigate('/login') }} title="Sign out" className="text-white/20 hover:text-white/60 transition-colors">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
