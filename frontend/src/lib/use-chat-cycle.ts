import { create } from "zustand";

type Phase = "question" | "typing" | "answer";

interface ChatCycleState {
  activeIndex: number;
  phase: Phase;
  setActive: (i: number) => void;
  next: () => void;
  setPhase: (p: Phase) => void;
}

export const useChatCycle = create<ChatCycleState>((set, get) => ({
  activeIndex: 0,
  phase: "question",
  setActive: (i) => set({ activeIndex: i, phase: "question" }),
  next: () => {
    const { activeIndex } = get();
    set({ activeIndex: (activeIndex + 1) % 4, phase: "question" });
  },
  setPhase: (p) => set({ phase: p }),
}));
