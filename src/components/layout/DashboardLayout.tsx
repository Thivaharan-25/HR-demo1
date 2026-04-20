import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useNavStore, type PillarKey } from '../../store/navStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useMockEventEngine } from '../../hooks/useMockEventEngine'
import { useEffect } from 'react'

function pathToPillar(pathname: string): PillarKey {
  if (pathname.startsWith('/people')) return 'people'
  if (pathname.startsWith('/workforce')) return 'workforce'
  if (pathname.startsWith('/org')) return 'org'
  if (pathname.startsWith('/skills')) return 'skills'
  if (pathname.startsWith('/calendar')) return 'calendar'
  if (pathname.startsWith('/inbox')) return 'inbox'
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/settings')) return 'settings'
  return 'home'
}

export function DashboardLayout() {
  const personaKey = useAuthStore((s) => s.personaKey)
  const { setActivePillar } = useNavStore()
  const location = useLocation()
  useMockEventEngine()

  useEffect(() => {
    setActivePillar(pathToPillar(location.pathname))
  }, [location.pathname]) // eslint-disable-line

  if (!personaKey) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#08080f' }}>
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(124,58,237,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[radial-gradient(ellipse,rgba(14,165,233,0.03)_0%,transparent_70%)]" />
      </div>

      <Sidebar />
      <Topbar />

      <main className="pl-[220px] pt-14 min-h-screen relative z-10">
        <div className="p-6 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
