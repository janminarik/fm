import { createSlice } from "@reduxjs/toolkit";

interface SettingsPanelState {
  open: boolean;
}

const initialState: SettingsPanelState = {
  open: false,
};

const settingsPanelSlice = createSlice({
  initialState,
  name: "settingsPanel",
  reducers: {
    closeSettingsPanel(state: SettingsPanelState) {
      state.open = false;
    },
    toggleSettingsPanel(state: SettingsPanelState) {
      state.open = !state.open;
    },
  },
});

export const { closeSettingsPanel, toggleSettingsPanel } =
  settingsPanelSlice.actions;
export const settingsPanelReducer = settingsPanelSlice.reducer;
