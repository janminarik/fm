import PersonIcon from "@mui/icons-material/Person";

import { NavigationMenuItem } from "../../../shared/types/commonTypes";
import { ROUTES } from "./routes";

export const menuItems: NavigationMenuItem[] = [
  {
    kind: "subheader",
    label: "Ad Spaces",
  },
  {
    icon: <PersonIcon />,
    kind: "menuitem",
    label: "Ad Space",
    to: ROUTES.AD_SPACES,
  },
];
