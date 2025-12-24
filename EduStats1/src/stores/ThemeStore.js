import { create } from "zustand";

export const useThemeStore = create((set) => ({
  darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,

  toggleDarkMode: () =>
    set((state) => {
      const newValue = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(newValue));
      return { darkMode: newValue };
    }),
}));
