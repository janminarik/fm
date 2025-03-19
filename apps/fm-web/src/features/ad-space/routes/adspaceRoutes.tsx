import { RouteObject } from "react-router-dom";

import { ROUTES } from "../config/routes";
import AdSpaceDetailPage from "../pages/AdSpaceDetailPage";
import AdSpacesPage from "../pages/AdSpacesPage";

export const adSpaceRoutes: RouteObject[] = [
  {
    path: ROUTES.AD_SPACES,
    children: [
      {
        path: "",
        element: <AdSpacesPage />,
      },
      {
        path: ROUTES.AD_SPACE_EDIT,
        element: <AdSpaceDetailPage />,
      },
      {
        path: ROUTES.AD_SPACE_CREATE,
        element: <AdSpaceDetailPage />,
      },
    ],
  },
];
