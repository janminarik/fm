import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import { menuItems as adSpacesMenuItems } from "../features/ad-space/config/menuItems";
import { ROUTES } from "../features/ad-space/config/routes";
import { adSpaceRoutes } from "../features/ad-space/routes/adspaceRoutes";
import { authRoutes } from "../features/auth/routes/authRoutes";
import { menuItems as customersMenuItem } from "../features/customers/config/menuItems";
import { customersRoutes } from "../features/customers/routes/customersRoutes";
import SettingsPanel from "../features/settings/components/SettingsPanel";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import Header from "../shared/components/Header";
import MainLayout from "../shared/components/MainLayout";
import NavigationPanel from "../shared/components/NavigationPanel";
import NotFound from "../shared/components/NotFound";
import ProtectedRoute from "../shared/components/ProtectedRoute";
import { NavigationMenuItem } from "../shared/types/commonTypes";

const navigationMenuItems: NavigationMenuItem[] = [
  ...customersMenuItem,
  ...adSpacesMenuItems,
];

const dashboardRoutes: RouteObject[] = [...customersRoutes, ...adSpaceRoutes];

const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary isRoot></ErrorBoundary>,

    children: [
      ...authRoutes.map((route) => ({
        ...route,
        errorElement: <ErrorBoundary isRoot backPath="/" />,
      })),
      {
        path: "app",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTES.AD_SPACES} replace />,
          },
          {
            element: (
              <MainLayout
                Header={Header}
                menuItems={navigationMenuItems}
                NavigationPanel={NavigationPanel}
                SettingsPanel={SettingsPanel}
              />
            ),
            children: dashboardRoutes.map((route) => ({
              ...route,
              errorElement: <ErrorBoundary />,
            })),
          },
        ],
      },
      {
        element: <NotFound />,
        path: "*",
      },
    ],
  },
]);

export default router;
