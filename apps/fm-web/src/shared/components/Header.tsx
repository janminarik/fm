import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../app/store";
import { toggleSettingsPanel } from "../../features/settings/slices/settingsPanelSlice";
import UserAvatarPopup from "../../features/user/components/UserAvatarPopup";
import { useAppTheme } from "../hooks/useAppTheme";
import useNavigationPanelResponsiveWidth from "../hooks/useNavigationPanelResponsiveWidth";
import { toggleNavigationPanel } from "../slices/navigationPanelSlice";

function Header() {
  const theme = useAppTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const dispatch = useDispatch<AppDispatch>();
  const navigationPanelWidth = useNavigationPanelResponsiveWidth();

  const handleToggleNavigationPanel = () => {
    dispatch(toggleNavigationPanel());
  };

  const handleToggleSettingsPanel = () => {
    dispatch(toggleSettingsPanel());
  };
  return (
    <AppBar>
      <Toolbar
        sx={{
          marginLeft: isLarge ? `${navigationPanelWidth}px` : 0,
          transition: theme.transitions.create(["width", "margin"], {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
          }),
          width: isLarge ? `calc(100% - ${navigationPanelWidth}px)` : "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={handleToggleNavigationPanel}>
            <MenuIcon />
          </IconButton>
          <Stack direction="row">
            <UserAvatarPopup />
            <IconButton onClick={handleToggleSettingsPanel} sx={{ ml: 2 }}>
              <SettingsIcon />
            </IconButton>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
