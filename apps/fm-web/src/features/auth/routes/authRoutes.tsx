import { RouteObject } from "react-router-dom";

import LoginPage from "../pages/LoginPage";

export const ROUTES = {
  LOGIN: "/login",
};

export const authRoutes: RouteObject[] = [
  {
    element: <LoginPage />,
    index: true,
    path: ROUTES.LOGIN,
  },
  {
    element: <LoginPage />,
    index: true,
  },
];
