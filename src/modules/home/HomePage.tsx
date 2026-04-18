import { useAuthStore } from '../../store/authStore'
import { AdminDashboard } from './AdminDashboard'
import { ManagerDashboard } from './ManagerDashboard'
import { EmployeeDashboard } from './EmployeeDashboard'

export function HomePage() {
  const personaKey = useAuthStore((s) => s.personaKey)
  if (personaKey === 'admin') return <AdminDashboard />
  if (personaKey === 'manager') return <ManagerDashboard />
  return <EmployeeDashboard />
}
