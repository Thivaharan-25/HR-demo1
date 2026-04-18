import { useLiveStore } from '../../store/liveStore'

const presenceCycle: Record<string, string[]> = {
  e4: ['online', 'break', 'online', 'break'],
  e5: ['offline', 'online', 'offline'],
  e10: ['break', 'online', 'break'],
}
const presenceIndexes: Record<string, number> = {}

const exceptionPool = [
  { type: 'Late Clock-In', severity: 'low' as const, employeeId: 'e4', message: 'Ravi Kumar clocked in 45 min late' },
  { type: 'Unproductive App', severity: 'medium' as const, employeeId: 'e5', message: 'Priya Devi used YouTube during work hours' },
  { type: 'No Clock-In', severity: 'critical' as const, employeeId: 'e8', message: 'Vikram Singh has not clocked in' },
]

const bridgePool = [
  { bridgeName: 'People Sync', recordCount: 3 },
  { bridgeName: 'Availability', recordCount: 7 },
  { bridgeName: 'Work Activity', recordCount: 14 },
]

let tick = 0

export function startMockEventEngine() {
  return setInterval(() => {
    tick++
    const store = useLiveStore.getState()

    if (tick % 4 === 0) {
      const keys = Object.keys(presenceCycle)
      const employeeId = keys[Math.floor(Math.random() * keys.length)]
      const cycle = presenceCycle[employeeId]
      presenceIndexes[employeeId] = ((presenceIndexes[employeeId] ?? 0) + 1) % cycle.length
      store.updatePresence(employeeId, cycle[presenceIndexes[employeeId]])
    }

    if (tick % 7 === 0) {
      const ex = exceptionPool[tick % exceptionPool.length]
      store.addException({ id: `live-ex-${tick}`, resolved: false, timestamp: new Date().toISOString(), ...ex })
    }

    if (tick % 10 === 0) {
      const bridge = bridgePool[tick % bridgePool.length]
      store.addWmsLog({ ...bridge, timestamp: new Date().toISOString() })
    }
  }, 3000)
}
