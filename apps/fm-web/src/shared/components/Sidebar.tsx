import { Drawer, drawerClasses } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ReactNode } from "react";

export interface SidebarProps {
  anchor?: "left" | "right";
  content?: ReactNode;
  mode?: "permanent" | "persistent" | "temporary";
  onClose?(): void;
  open?: boolean;
  width?: number;
}

export function Sidebar({
  anchor,
  content,
  mode,
  onClose,
  open,
  width,
}: SidebarProps) {
  return (
    <Grid>
      <Drawer
        anchor={anchor}
        onClose={onClose}
        open={open}
        sx={{
          [`& .${drawerClasses.paper}`]: {
            width: `${width}px`,
          },
        }}
        variant={mode}
      >
        {content}
      </Drawer>
    </Grid>
  );
}

export default Sidebar;
