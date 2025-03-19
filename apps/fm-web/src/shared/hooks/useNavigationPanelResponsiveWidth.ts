import { useEffect, useState } from "react";

import { useAppTheme } from "./useAppTheme";
import useNavigationPanelState, {
  NavigationPanelState,
} from "./useNavigationPanelState";

const useNavigationPanelResponsiveWidth = (): null | number => {
  const theme = useAppTheme();
  const state = useNavigationPanelState();
  const [width, setWidth] = useState<null | number>(null);

  useEffect(() => {
    switch (state) {
      case NavigationPanelState.LargeClose:
        setWidth(theme.custom.closeNavigationPanelWidth ?? null);
        break;
      case NavigationPanelState.LargeOpen:
        setWidth(theme.custom.navigationPanelWidth ?? null);
        break;
      case NavigationPanelState.MediumOrSmallClose:
        setWidth(null);
        break;
      case NavigationPanelState.MediumOrSmallOpen:
        setWidth(theme.custom.navigationPanelWidth ?? null);
        break;
      default:
        break;
    }
  }, [
    state,
    theme.custom.navigationPanelWidth,
    theme.custom.closeNavigationPanelWidth,
  ]);

  return width;
};

export default useNavigationPanelResponsiveWidth;
