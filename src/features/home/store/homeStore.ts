import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HomeStore {
  // Home store is now simplified without modes
  refreshCount: number;
  incrementRefresh: () => void;
}

export const useHomeStore = create<HomeStore>()(
  devtools(
    (set, get) => ({
      refreshCount: 0,
      
      incrementRefresh: () => {
        const current = get().refreshCount;
        set({ refreshCount: current + 1 });
      },
    }),
    { name: 'home-store' }
  )
);