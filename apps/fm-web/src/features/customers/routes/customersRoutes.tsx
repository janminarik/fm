import { RouteObject } from "react-router-dom";

import { ROUTES } from "../config/routes";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import CustomersPage from "../pages/CustomersPage";

export const customersRoutes: RouteObject[] = [
  {
    path: ROUTES.CUSTOMERS,
    children: [
      {
        element: <CustomersPage />,
        path: "",
      },
      {
        element: <CustomerDetailPage />,
        path: ROUTES.CUSTOMER,
      },
      {
        element: <CustomerDetailPage />,
        path: ROUTES.CUSTOMER_CREATE,
      },
    ],
  },
];
