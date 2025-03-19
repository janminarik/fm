import { useContext } from "react";

import { ThemeContext } from "../../theme/AppThemeProvider";

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a AppThemeProvider");
  }
  return context;
};
