import { create } from 'zustand';

interface StoreState {
    show: boolean;
    toggle: () => void;
  }
  

export const useModalChangeProfile = create<StoreState>((set) => ({
    show: false,
    toggle: () => set((state:any) => ({ show: !state.show })),
}));
