import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import Loader from "./Loader";
import { RootState } from "../../app/store";

function ProtectedRoute() {
  // const { error, isLoading } = useCheckAuthQuery(undefined, {
  //   refetchOnMountOrArgChange: true,
  // });
  // if (error) {
  //   const apiError = mapReduxErrorToAppError(error);
  //   if (apiError.code === 401) return <Navigate to="/login" />;
  // }

  // if (isLoading) {
  //   return <Loader isOverlay={true} message="Checking authentication..." />;
  // }

  const isUnauthorized = useSelector(
    (state: RootState) => state.appError.isUnathorized,
  );

  if (isUnauthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <Suspense fallback={<Loader message="Loading content..." />}>
      <Outlet />
    </Suspense>
  );
}

export default ProtectedRoute;
