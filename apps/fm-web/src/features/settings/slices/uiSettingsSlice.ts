import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Language, ThemeName } from "../../../shared/types/commonTypes";

interface UiSettings {
  language: Language | null;
  theme: ThemeName;
}

const initialState: UiSettings = {
  language: null,
  theme: ThemeName.Dark,
};

const uiSettingsSlice = createSlice({
  initialState,
  name: "uiSettings",
  reducers: {
    setLanguage(state: UiSettings, actions: PayloadAction<Language>) {
      state.language = actions.payload;
    },
    setTheme(state: UiSettings, actions: PayloadAction<ThemeName>) {
      state.theme = actions.payload;
    },
  },
});

export const { setLanguage, setTheme } = uiSettingsSlice.actions;
export const uiSettingsReducer = uiSettingsSlice.reducer;
