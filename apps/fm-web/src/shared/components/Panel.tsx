import { Box, CircularProgress, Typography } from "@mui/material";
import { ReactNode } from "react";

import ErrorBox from "./ErrorBox";

interface PanelProps {
  children: ReactNode;
  error?: any;
  isError?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
}

function Panel({
  children,
  error,
  isError,
  isLoading,
  loadingMessage,
}: PanelProps) {
  if (isLoading && !isError)
    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        p={2}
      >
        <CircularProgress size={30} />
        <Typography pt={4} variant="body1">
          {loadingMessage ? loadingMessage : "Defaul loading message"}
        </Typography>
      </Box>
    );

  if (isError) return <ErrorBox message={error}></ErrorBox>;

  return <Box>{children}</Box>;
}

export default Panel;
