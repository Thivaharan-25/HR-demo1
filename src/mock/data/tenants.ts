import type { Tenant } from '../types'

export const tenants: Tenant[] = [
  { id: 't1', name: 'Nexus Corp', logo: '/logos/nexus.svg', primaryColor: '#7C3AED', slug: 'nexus' },
  { id: 't2', name: 'Pinnacle HR', logo: '/logos/pinnacle.svg', primaryColor: '#0EA5E9', slug: 'pinnacle' },
]
export const activeTenant = tenants[0]
