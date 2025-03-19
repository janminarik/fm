import { createTheme, Theme } from "@mui/material";

import { ThemeName } from "../shared/types/commonTypes";
import { CustomThemeAttributes } from "./customThemeAttributes";

declare module "@mui/material/styles" {
  interface Theme {
    custom: CustomThemeAttributes;
  }

  // Umožňuje získať prístup k vlastným hodnotám pri použití `theme.palette`.
  interface ThemeOptions {
    custom?: {
      closeNavigationPanelWidth?: number;
      navigationPanelWidth?: number;
      settingsPanelWidth?: number;
    };
  }
}

export const getTheme = (mode: ThemeName): Theme => {
  if (mode === undefined) mode = ThemeName.Light;

  return createTheme({
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            ...(mode === "light" && { background: "#fff" }),
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {},
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
          },
          body: {
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.mode === "light" ? "#545454" : "inherit",
          }),
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
        },
      },
    },
    custom: {
      closeNavigationPanelWidth: 60,
      navigationPanelWidth: 250,
      settingsPanelWidth: 350,
    },
    palette: {
      mode: mode,
    },
  });
};
