import PersonIcon from "@mui/icons-material/Person";

import { ROUTES } from "./routes";
import { NavigationMenuItem } from "../../../shared/types/commonTypes";

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
