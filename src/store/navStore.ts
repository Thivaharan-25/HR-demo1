import { create } from 'zustand'

export type PillarKey = 'home' | 'people' | 'workforce' | 'org' | 'skills' | 'calendar' | 'inbox' | 'admin' | 'settings'

// Kept for any remaining references — no longer drives panel behavior
export const PANEL_PILLARS: PillarKey[] = []

interface NavState {
  activePillar: PillarKey
  panelOpen: boolean
  setActivePillar: (pillar: PillarKey) => void
  togglePillar: (pillar: PillarKey) => void
}

export const useNavStore = create<NavState>((set) => ({
  activePillar: 'home',
  panelOpen: false,
  setActivePillar: (pillar) => set({ activePillar: pillar, panelOpen: false }),
  togglePillar: (pillar) => set({ activePillar: pillar, panelOpen: false }),
}))
