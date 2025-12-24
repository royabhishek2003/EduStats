import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useResultStore = create(
  persist(
    (set) => ({
      results: null,
      setResults: (data) => set({ results: data }),
      clearResults: () => set({ results: null }),
    }),
    {
      name: "results-storage",
      getStorage: () => sessionStorage,
    }
  )
);
