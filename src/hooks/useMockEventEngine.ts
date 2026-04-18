import { useEffect } from 'react'
import { startMockEventEngine } from '../mock/events/MockEventEngine'

export function useMockEventEngine() {
  useEffect(() => {
    const interval = startMockEventEngine()
    return () => clearInterval(interval)
  }, [])
}
