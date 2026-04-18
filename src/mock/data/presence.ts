export const presenceEvents = [
  { employeeId: 'e1', type: 'clock-in', timestamp: '2026-04-17T08:01:00Z' },
  { employeeId: 'e2', type: 'clock-in', timestamp: '2026-04-17T08:15:00Z' },
  { employeeId: 'e3', type: 'clock-in', timestamp: '2026-04-17T08:30:00Z' },
  { employeeId: 'e4', type: 'clock-in', timestamp: '2026-04-17T08:45:00Z' },
  { employeeId: 'e4', type: 'break-start', timestamp: '2026-04-17T10:30:00Z' },
  { employeeId: 'e5', type: 'clock-in', timestamp: '2026-04-17T09:00:00Z' },
  { employeeId: 'e5', type: 'clock-out', timestamp: '2026-04-17T12:00:00Z' },
]

export const biometricEvents = [
  { employeeId: 'e1', type: 'fingerprint', result: 'verified', timestamp: '2026-04-17T08:01:05Z' },
  { employeeId: 'e3', type: 'face', result: 'verified', timestamp: '2026-04-17T08:30:02Z' },
  { employeeId: 'e6', type: 'fingerprint', result: 'failed', timestamp: '2026-04-17T08:55:10Z' },
]
