"use client";

import { create } from "zustand";
import { chatExamples } from "@/lib/landing-data";

interface ChatCycleState {
  activeIndex: number;
  phase: "question" | "typing" | "answer";
  setActive: (i: number) => void;
  next: () => void;
  setPhase: (p: "question" | "typing" | "answer") => void;
}

export const useChatCycle = create<ChatCycleState>((set, get) => ({
  activeIndex: 0,
  phase: "question",
  setActive: (i) => set({ activeIndex: i, phase: "question" }),
  next: () =>
    set({
      activeIndex: (get().activeIndex + 1) % chatExamples.length,
      phase: "question",
    }),
  setPhase: (p) => set({ phase: p }),
}));
