import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { AppDispatch, RootState } from "../../app/store";
import useNavigationPanelState, {
  NavigationPanelState,
} from "../hooks/useNavigationPanelState";
import {
  setSelectedMenuItem,
  toggleSubmenu,
} from "../slices/navigationPanelSlice";
import { MenuItem, NavigationMenuItem } from "../types/commonTypes";

export interface NavigationMenuProps {
  menuItems: NavigationMenuItem[];
}

function NavigationMenu({ menuItems }: NavigationMenuProps) {
  const navigationPanelState = useNavigationPanelState();
  const { expandedSubMenu, selectedMenuItem } = useSelector(
    (state: RootState) => state.navigationPanel.menuState,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [hoveredMenuItem, setHoveredMenuItem] =
    useState<NavigationMenuItem | null>(null);

  const handleMenuItemClick = (item: string) => {
    dispatch(setSelectedMenuItem(item));
  };

  const handleSubMenuItemClick = (item: string) => {
    if (expandedSubMenu === item) {
      dispatch(toggleSubmenu(null));
    } else {
      dispatch(toggleSubmenu(item));
    }
  };

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    menuItem: NavigationMenuItem,
  ) => {
    setPopoverAnchor(event.currentTarget);
    setHoveredMenuItem(menuItem);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
    setHoveredMenuItem(null);
  };

  const renderMenuItem = (menuItem: MenuItem) => {
    return (
      <React.Fragment key={menuItem.label}>
        <ListItemButton
          component={RouterLink}
          onClick={
            menuItem.subMenu
              ? () => handleSubMenuItemClick(menuItem.label)
              : () => handleMenuItemClick(menuItem.label)
          }
          selected={menuItem.label === selectedMenuItem}
          to={menuItem.to ?? ""}
        >
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
          <ListItemText primary={menuItem.label} />
          {menuItem.subMenu ? (
            expandedSubMenu == menuItem.label ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )
          ) : null}
        </ListItemButton>
        {menuItem.subMenu && (
          <Collapse
            in={expandedSubMenu == menuItem.label}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {menuItem.subMenu.map((subMenuItem) => (
                <ListItemButton
                  component={RouterLink}
                  key={subMenuItem.label}
                  onClick={() => handleMenuItemClick(subMenuItem.label)}
                  selected={subMenuItem.label === selectedMenuItem}
                  to={subMenuItem.to ?? ""}
                >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={subMenuItem.label}></ListItemText>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const renderCompactMenuItem = (menuItem: MenuItem) => {
    return (
      <React.Fragment key={menuItem.label}>
        <ListItemButton
          component={RouterLink}
          onClick={
            menuItem.subMenu
              ? () => handleSubMenuItemClick(menuItem.label)
              : () => handleMenuItemClick(menuItem.label)
          }
          onMouseEnter={(event) =>
            menuItem.subMenu ? handlePopoverOpen(event, menuItem) : undefined
          }
          selected={menuItem.label === selectedMenuItem}
          to={menuItem.to ?? ""}
        >
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
        </ListItemButton>

        {hoveredMenuItem?.label === menuItem.label ? (
          <Popover
            anchorEl={popoverAnchor}
            anchorOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            onClose={handlePopoverClose}
            open={Boolean(popoverAnchor)}
            transformOrigin={{
              horizontal: "left",
              vertical: "top",
            }}
          >
            {menuItem.subMenu && (
              <List component="div" disablePadding sx={{ minWidth: 150 }}>
                {menuItem.subMenu.map((subMenuItem) => (
                  <ListItemButton
                    component={RouterLink}
                    key={subMenuItem.label}
                    onClick={() => handleMenuItemClick(subMenuItem.label)}
                    selected={subMenuItem.label === selectedMenuItem}
                    to={subMenuItem.to ?? ""}
                  >
                    <ListItemText primary={subMenuItem.label}></ListItemText>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Popover>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <List
      disablePadding
      sx={{
        overflow:
          navigationPanelState === NavigationPanelState.LargeClose
            ? "hidden"
            : "auto",
      }}
    >
      {menuItems.map((item) => {
        return item.kind === "menuitem" ? (
          navigationPanelState === NavigationPanelState.LargeClose ? (
            renderCompactMenuItem(item)
          ) : (
            renderMenuItem(item)
          )
        ) : navigationPanelState === NavigationPanelState.LargeClose ? null : (
          <ListSubheader key={item.label}>{item.label}</ListSubheader>
        );
      })}
    </List>
  );
}

export default NavigationMenu;
