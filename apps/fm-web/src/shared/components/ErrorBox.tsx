import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { TRANSLATIONS_NAMESPACES } from "../../i18n/config";
import { isReduxError, parseReduxError } from "../utils/reduxUtils";

interface ErrorBoxProps {
  message?: string;
  title?: string;
  error?: unknown;
  mode?: "box" | "page";
}

const boxStyle = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  p: 2,
};

const pageStyle = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  justifyContent: "center",
  p: 2,
  width: "100vw",
};

function ErrorBox({ error, message, title, mode = "box" }: ErrorBoxProps) {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.SHARED);

  let systemErrorMessage = null;

  if (isReduxError(error)) {
    systemErrorMessage = parseReduxError(error, t("errorPage.message"));
  }

  const displayErrorMessage = [message, systemErrorMessage]
    .filter(Boolean)
    .join(" ");

  return (
    <Box sx={mode === "page" ? pageStyle : boxStyle}>
      <Typography color="error" gutterBottom variant="h4">
        {title ? title : t("errorPage.unexpectedTitle")}
      </Typography>
      <Typography color="textSecondary" variant="h6">
        {displayErrorMessage ? displayErrorMessage : t("errorPage.message")}
      </Typography>
    </Box>
  );
}

export default ErrorBox;
