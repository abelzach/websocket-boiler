import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatMsgsState {
  chatMsgs: any[];
  updateChatMsgs: (updater: (prevMsgs: any[]) => any[]) => void;
  setChatMsgs: (chatMsgs: any[]) => void;
}

export const useChatMsgsStore = create<ChatMsgsState>()(
  persist(
    (set) => ({
      chatMsgs: [],
      updateChatMsgs: (updater) => {
        if (typeof updater !== "function") {
          throw new Error("updateChatMsgs expects a function as an argument.");
        }
        set((state) => ({ chatMsgs: updater(state.chatMsgs) }));
      },
      setChatMsgs: (chatMsgs) => set({ chatMsgs }),
    }),
    {
      name: "msgs-storage",
    }
  )
);