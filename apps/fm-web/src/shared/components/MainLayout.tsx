import { Container, styled, Theme, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ElementType, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { useAppTheme } from "../hooks/useAppTheme";
import useNavigationPanelResponsiveWidth from "../hooks/useNavigationPanelResponsiveWidth";
import { NavigationMenuItem } from "../types/commonTypes";
import AppSnackbar from "./AppSnackbar";
import Loader from "./Loader";
import { NavigationPanelProps } from "./NavigationPanel";

const Offset = styled("div")(({ theme }: { theme: Theme }) => ({
  ...theme.mixins.toolbar,
  height: theme.mixins.toolbar.minHeight,
}));

export interface MainLayoutProps {
  Header: ElementType;
  menuItems: NavigationMenuItem[];
  NavigationPanel: ElementType<NavigationPanelProps>;
  SettingsPanel: ElementType;
}

const sidebarGridSx = {
  display: { lg: "flex", md: "none", xs: "none" },
  flex: 0,
  flexShrink: 0,
  size: { lg: "auto" },
};

function MainLayout({
  Header,
  menuItems,
  NavigationPanel,
  SettingsPanel,
}: MainLayoutProps) {
  const theme = useAppTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const navigationPanelWidth = useNavigationPanelResponsiveWidth();

  return (
    <Container
      component="main"
      disableGutters
      maxWidth={false}
      role="main"
      sx={{
        background: theme.palette.background.default,
        height: "100vh",
      }}
    >
      <Grid
        container
        sx={{
          background: theme.palette.background.default,
          flex: 1,
          flexDirection: "row",
        }}
      >
        {/* NavigationPanel */}
        <Grid
          sx={{
            display: { lg: "flex", md: "flex", xs: "flex" },
            flex: 0,
            flexShrink: 0,
            size: { lg: "auto" },
          }}
        >
          <NavigationPanel menuItems={menuItems} />
        </Grid>

        {/* Header & Content */}
        <Grid
          container
          sx={{
            direction: "column",
            flex: 1,
            marginLeft: isLarge ? `${navigationPanelWidth}px` : 0,
            transition: theme.transitions.create(["margin"], {
              duration: theme.transitions.duration.leavingScreen,
              easing: theme.transitions.easing.sharp,
            }),
          }}
        >
          <Grid>
            <Header />
          </Grid>

          {/* Content */}
          {/* bgcolor={theme.palette.background.default} */}
          <Grid sx={{ width: "100%" }}>
            <Offset />
            <Suspense fallback={<Loader message="Loading content..." />}>
              <Outlet />
            </Suspense>
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid sx={sidebarGridSx}>
          <SettingsPanel />
        </Grid>
      </Grid>
      <AppSnackbar />
    </Container>
  );
}

export default MainLayout;
