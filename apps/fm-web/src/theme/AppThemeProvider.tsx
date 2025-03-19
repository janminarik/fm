import { CssBaseline, ThemeProvider } from "@mui/material";
import { Theme } from "@mui/material/styles";
import React, { createContext, ReactNode } from "react";
import { useSelector } from "react-redux";

import { getTheme } from "./defaultTheme";
import { RootState } from "../app/store";

export const ThemeContext = createContext<Theme | undefined>(undefined);

type AppThemeProviderProps = {
  children: ReactNode;
};

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  const currentTheme = useSelector(
    (state: RootState) => state.uiSettings.theme,
  );

  const theme = getTheme(currentTheme);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
