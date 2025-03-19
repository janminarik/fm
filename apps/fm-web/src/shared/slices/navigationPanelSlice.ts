import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationPanelMenuState {
  expandedSubMenu: null | string;
  selectedMenuItem: null | string;
}

interface NavigationPanelState {
  menuState: NavigationPanelMenuState;
  open: boolean;
}

const initialState: NavigationPanelState = {
  menuState: {
    expandedSubMenu: null,
    selectedMenuItem: null,
  },
  open: true,
};

const navigationPanelSlice = createSlice({
  initialState,
  name: "navigationPanel",
  reducers: {
    closeNavigationPanel(state: NavigationPanelState) {
      state.open = false;
    },
    setSelectedMenuItem(
      state: NavigationPanelState,
      action: PayloadAction<string>,
    ) {
      state.menuState.selectedMenuItem = action.payload;
    },
    toggleNavigationPanel(state: NavigationPanelState) {
      state.open = !state.open;
    },
    toggleSubmenu(
      state: NavigationPanelState,
      action: PayloadAction<null | string>,
    ) {
      state.menuState.expandedSubMenu = action.payload;
    },
  },
});

export const {
  closeNavigationPanel,
  setSelectedMenuItem,
  toggleNavigationPanel,
  toggleSubmenu,
} = navigationPanelSlice.actions;

export const navigationPanelReducer = navigationPanelSlice.reducer;
