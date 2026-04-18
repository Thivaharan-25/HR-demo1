import { create } from 'zustand'

export type PillarKey = 'home' | 'people' | 'workforce' | 'org' | 'calendar' | 'inbox' | 'admin' | 'settings'

export const PANEL_PILLARS: PillarKey[] = ['people', 'org', 'admin', 'settings']

interface NavState {
  activePillar: PillarKey
  panelOpen: boolean
  setActivePillar: (pillar: PillarKey) => void
  togglePillar: (pillar: PillarKey) => void
}

export const useNavStore = create<NavState>((set, get) => ({
  activePillar: 'home',
  panelOpen: false,
  setActivePillar: (pillar) => set({
    activePillar: pillar,
    panelOpen: PANEL_PILLARS.includes(pillar),
  }),
  togglePillar: (pillar) => {
    const { activePillar, panelOpen } = get()
    if (activePillar === pillar && PANEL_PILLARS.includes(pillar)) {
      set({ panelOpen: !panelOpen })
    } else {
      set({ activePillar: pillar, panelOpen: PANEL_PILLARS.includes(pillar) })
    }
  },
}))
