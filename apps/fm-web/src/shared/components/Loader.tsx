import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  isOverlay?: boolean;
  message?: string;
}

function Loader({ isOverlay, message }: LoaderProps) {
  // const overlayStyle = {
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   display: "flex",
  //   height: "100%",
  //   justifyContent: "center",
  //   left: 0,
  //   position: "fixed",
  //   top: 0,
  //   width: "100%",
  //   zIndex: 1300,
  // };

  const overlayStyle = {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  };

  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={isOverlay ? overlayStyle : {}}
    >
      <CircularProgress />
      <Typography pt={4} variant="h6">
        {message ? message : "Defaul loading message"}
      </Typography>
    </Box>
  );
}

export default Loader;
