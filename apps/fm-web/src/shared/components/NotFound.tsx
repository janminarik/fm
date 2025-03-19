import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { TRANSLATIONS_NAMESPACES } from "../../i18n/config";

function NotFound() {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.SHARED);
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      p={2}
      textAlign="center"
      width="100vw"
    >
      <Typography color="error" gutterBottom variant="h3">
        {t("notFoundPage.title")}
      </Typography>
      <Typography color="textSecondary" gutterBottom variant="h6">
        {t("notFoundPage.message")}
      </Typography>
      <Button color="primary" onClick={handleGoHome} variant="contained">
        {t("notFoundPage.button")}
      </Button>
    </Box>
  );
}

export default NotFound;
