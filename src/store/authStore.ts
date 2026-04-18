import { create } from 'zustand'

export type PersonaKey = 'admin' | 'manager' | 'employee'

interface AuthState {
  personaKey: PersonaKey | null
  user: { id: string; name: string; avatar: string; jobTitle: string } | null
  grantedModules: string[]
  permissions: string[]
  tenantId: string
  tenantName: string
  tenantLogo: string
  tenantColor: string
  login: (persona: PersonaKey) => void
  logout: () => void
  updateBranding: (name: string, color: string) => void
}

const personas: Record<PersonaKey, Pick<AuthState, 'personaKey' | 'user' | 'grantedModules' | 'permissions' | 'tenantId'>> = {
  admin: {
    personaKey: 'admin',
    user: { id: 'e1', name: 'Sarah Lim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', jobTitle: 'Super Admin' },
    grantedModules: ['core-hr', 'leave', 'org-structure', 'workforce', 'activity-monitoring', 'identity-verification', 'exception-engine', 'productivity-analytics', 'calendar', 'notifications', 'admin', 'settings', 'skills'],
    permissions: ['employees:read', 'employees:write', 'leave:read', 'leave:approve', 'workforce:read', 'exceptions:read', 'exceptions:resolve', 'admin:read', 'admin:write', 'settings:write', 'skills:manage'],
    tenantId: 't1',
  },
  manager: {
    personaKey: 'manager',
    user: { id: 'e2', name: 'James Rajan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', jobTitle: 'Engineering Manager' },
    grantedModules: ['core-hr', 'leave', 'workforce', 'activity-monitoring', 'exception-engine', 'productivity-analytics', 'calendar', 'notifications', 'skills'],
    permissions: ['employees:read', 'leave:read', 'leave:approve', 'workforce:read', 'exceptions:read', 'skills:validate'],
    tenantId: 't1',
  },
  employee: {
    personaKey: 'employee',
    user: { id: 'e3', name: 'Aisha Noor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aisha', jobTitle: 'Software Engineer' },
    grantedModules: ['leave', 'calendar', 'notifications', 'skills'],
    permissions: ['leave:read', 'leave:write', 'skills:write'],
    tenantId: 't1',
  },
}

export const useAuthStore = create<AuthState>((set) => ({
  personaKey: null,
  user: null,
  grantedModules: [],
  permissions: [],
  tenantId: 't1',
  tenantName: 'Nexus Corp',
  tenantLogo: '/logos/nexus.svg',
  tenantColor: '#7C3AED',
  login: (persona) => set({ ...personas[persona], tenantName: 'Nexus Corp', tenantLogo: '/logos/nexus.svg', tenantColor: '#7C3AED' }),
  logout: () => set({ personaKey: null, user: null, grantedModules: [], permissions: [] }),
  updateBranding: (name, color) => set({ tenantName: name, tenantColor: color }),
}))

export const useHasPermission = (permission: string) =>
  useAuthStore((s) => s.permissions.includes(permission))

export const useIsModuleGranted = (module: string) =>
  useAuthStore((s) => s.grantedModules.includes(module))
