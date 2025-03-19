import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAppTheme } from "./useAppTheme";
import { RootState } from "../../app/store";

export enum NavigationPanelState {
  LargeClose = "LARGE_CLOSE",
  LargeOpen = "LARGE_OPEN",
  MediumOrSmallClose = "MEDIUM_OR_SMALL_CLOSE",
  MediumOrSmallOpen = "MEDIUM_OR_SMALL_OPEN",
}

const useNavigationPanelState = (): NavigationPanelState => {
  const theme = useAppTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const isOpen = useSelector((state: RootState) => state.navigationPanel.open);
  const [state, setState] = useState<NavigationPanelState>(
    NavigationPanelState.LargeClose,
  );

  useEffect(() => {
    const currentState = isLarge
      ? isOpen
        ? NavigationPanelState.LargeOpen
        : NavigationPanelState.LargeClose
      : isOpen
        ? NavigationPanelState.MediumOrSmallOpen
        : NavigationPanelState.MediumOrSmallClose;

    setState(currentState);
  }, [isOpen, isLarge]);

  return state;
};

export default useNavigationPanelState;
