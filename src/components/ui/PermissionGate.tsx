import { useAuthStore } from '../../store/authStore'

interface Props {
  permission?: string
  module?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGate({ permission, module, children, fallback = null }: Props) {
  const permissions = useAuthStore((s) => s.permissions)
  const grantedModules = useAuthStore((s) => s.grantedModules)
  if (permission && !permissions.includes(permission)) return <>{fallback}</>
  if (module && !grantedModules.includes(module)) return <>{fallback}</>
  return <>{children}</>
}
