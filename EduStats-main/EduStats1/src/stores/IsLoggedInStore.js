import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useIsLoggedIn = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (userData) =>
        set({
          user: userData,
          isLoggedIn: true,
        }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "edustats-auth",
      getStorage: () => sessionStorage,
    }
  )
);
