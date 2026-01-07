import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeState, Theme } from "../../types";

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme") as Theme;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(state.theme);
        localStorage.setItem("theme", state.theme);
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(state.theme);
        localStorage.setItem("theme", state.theme);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
