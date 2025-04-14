import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecieverState {
  receiver: string;
  updateReceiverName: (name: string) => void;
}

export const UseChatRecieverStore = create<RecieverState>()(
  persist(
    (set) => ({
      receiver: '',
      updateReceiverName: (name: string) => set({ receiver: name }),
    }),
    {
      name: 'receiver-storage',
    }
  )
);
