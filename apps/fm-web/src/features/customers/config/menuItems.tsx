import PersonIcon from "@mui/icons-material/Person";

import { ROUTES } from "./routes";
import { NavigationMenuItem } from "../../../shared/types/commonTypes";

export const menuItems: NavigationMenuItem[] = [
  {
    kind: "subheader",
    label: "Customers",
  },
  {
    icon: <PersonIcon />,
    kind: "menuitem",
    label: "Customer",
    to: ROUTES.CUSTOMERS,
  },
];
