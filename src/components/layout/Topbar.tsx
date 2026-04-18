import { useAuthStore } from '../../store/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Search, Bell, ChevronRight } from 'lucide-react'
import { useLiveStore } from '../../store/liveStore'

const pathLabels: Record<string, string> = {
  people: 'People',
  employees: 'Employees',
  leave: 'Leave',
  workforce: 'Workforce Live',
  org: 'Organization',
  calendar: 'Calendar',
  inbox: 'Inbox',
  admin: 'Admin',
  settings: 'Settings',
}

function getBreadcrumbs(pathname: string): string[] {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return ['Home']
  return parts
    .filter(p => !/^[a-z0-9]{2,4}$/.test(p) || isNaN(Number(p[0])))
    .map(p => pathLabels[p] ?? p)
}

export function Topbar() {
  const { user, tenantName, tenantColor } = useAuthStore()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const inboxCount = useLiveStore((s) => s.inboxCount)

  const breadcrumbs = getBreadcrumbs(location.pathname)
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="h-14 bg-[#08080f]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-5 fixed top-0 left-16 right-0 z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm font-outfit font-semibold shrink-0" style={{ color: tenantColor }}>
          {tenantName}
        </span>
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight size={12} className="text-white/20 shrink-0" />
            <span className={`text-[13px] font-outfit truncate ${i === breadcrumbs.length - 1 ? 'text-white/60' : 'text-white/25'}`}>
              {crumb}
            </span>
          </div>
        ))}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 text-xs hover:text-white/50 hover:bg-white/[0.05] transition-all group">
          <Search size={12} />
          <span className="font-outfit">Search</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/[0.08] text-white/20 text-[10px] font-geist tracking-tight">⌘K</kbd>
        </button>

        {/* Bell */}
        <button
          onClick={() => navigate('/inbox')}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-all"
        >
          <Bell size={15} />
          {inboxCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-violet-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-pulse shadow-[0_0_8px_rgba(124,58,237,0.6)]">
              {inboxCount > 9 ? '9+' : inboxCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-white/[0.08] mx-0.5" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-7 h-7 rounded-full border border-white/15"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#08080f]" />
          </div>
          <div className="hidden md:block leading-none">
            <div className="text-white/75 text-[13px] font-outfit">{user?.name}</div>
            <div className="text-white/30 text-[11px] font-outfit mt-0.5">{user?.jobTitle}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-white/25 hover:text-white/60 transition-colors ml-1"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
