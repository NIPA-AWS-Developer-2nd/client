import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { UserMode } from '../types';

interface HomeStore {
  userMode: UserMode['mode'];
  setUserMode: (mode: UserMode['mode']) => void;
  toggleUserMode: () => void;
}

export const useHomeStore = create<HomeStore>()(
  devtools(
    (set, get) => ({
      userMode: 'find',
      setUserMode: (mode) => set({ userMode: mode }),
      toggleUserMode: () => set({ userMode: get().userMode === 'find' ? 'host' : 'find' }),
    }),
    { name: 'home-store' }
  )
);