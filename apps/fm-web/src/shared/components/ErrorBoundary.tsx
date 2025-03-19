import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

import { TRANSLATIONS_NAMESPACES } from "../../i18n/config";
import ErrorBox from "./ErrorBox";

interface ErrorBoundaryProps {
  isRoot?: boolean;
  backPath?: string;
}

function ErrorBoundary({
  isRoot = false,
  backPath = "/app",
}: ErrorBoundaryProps) {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.SHARED);
  const error = useRouteError();
  const navigate = useNavigate();

  let displayTitle: string = t("errorPage.title");
  let displayMessage: string = t("errorPage.message");

  if (isRouteErrorResponse(error)) {
    displayTitle = `${error.status}`;
    displayMessage = error.statusText;
  } else if (error instanceof Error) {
    displayTitle = t("errorPage.unexpectedTitle");
    displayMessage = error.message;
  }

  const handleBack = () => {
    if (isRoot) {
      window.location.href = backPath;
    } else {
      navigate(backPath);
    }
  };

  return (
    <Stack display="flex" justifyContent="center" pt={4} alignItems="center">
      <ErrorBox title={displayTitle} message={displayMessage} mode="box" />

      <Button onClick={handleBack}>Go Back</Button>
    </Stack>
  );
}

export default ErrorBoundary;
