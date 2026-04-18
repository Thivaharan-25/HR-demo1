import type { WmsBridgeLog } from '../types'

export const wmsBridgeLogs: WmsBridgeLog[] = [
  { bridgeId: 'b1', bridgeName: 'People Sync', direction: 'HR → WMS', recordCount: 12, status: 'success', timestamp: '2026-04-17T08:05:00Z' },
  { bridgeId: 'b2', bridgeName: 'Availability', direction: 'HR → WMS', recordCount: 8, status: 'success', timestamp: '2026-04-17T08:10:00Z' },
  { bridgeId: 'b3', bridgeName: 'Work Activity', direction: 'WMS → HR', recordCount: 34, status: 'success', timestamp: '2026-04-17T08:15:00Z' },
  { bridgeId: 'b3a', bridgeName: 'Skills Profile Read', direction: 'HR → WMS', recordCount: 5, status: 'success', timestamp: '2026-04-17T08:20:00Z' },
]
