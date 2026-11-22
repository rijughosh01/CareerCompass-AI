/**
 * Zustand global store for CareerCompass AI.
 * Replaces prop-drilling for assessment predictions and UI state.
 */
import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PredictionItem {
  rank: number;
  career: string;
  prediction_score: number;
  raw_probability: number;
  is_top_match: boolean;
  description?: string;
  required_skills?: string[];
  career_opportunities?: string[];
  match_explanation?: string;
}

interface AppState {
  // Assessment predictions cache
  latestPredictions: PredictionItem[] | null;
  topCareer: string | null;
  assessmentId: number | null;

  // UI state
  sidebarOpen: boolean;

  // Actions
  setLatestPredictions: (preds: PredictionItem[], topCareer: string, id: number) => void;
  clearPredictions: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>((set) => ({
  latestPredictions: null,
  topCareer: null,
  assessmentId: null,
  sidebarOpen: false,

  setLatestPredictions: (preds, topCareer, id) =>
    set({ latestPredictions: preds, topCareer, assessmentId: id }),

  clearPredictions: () =>
    set({ latestPredictions: null, topCareer: null, assessmentId: null }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
