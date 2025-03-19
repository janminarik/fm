import { Alert, Box, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../app/store";
import { removeNotifiction } from "../slices/notificationSlice";

function AppSnackbar() {
  const appSnackbarHeight = 40;
  const maxCount = 2;
  const dispath = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.notifications.messages,
  );

  const handleClose = async (id: string) => {
    await dispath(removeNotifiction(id));
  };

  return (
    <Box
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      {notifications.slice(0, maxCount).map((notification, index) => (
        <Snackbar
          anchorOrigin={{ horizontal: "left", vertical: "top" }}
          autoHideDuration={6000}
          key={notification.id}
          open={notifications.some((n) => n.id === notification.id)}
          sx={{
            width: "100%",
            margin: 0,
            p: 1,
            height: { appSnackbarHeight },
            transform: `translateY(${index * (appSnackbarHeight + 10)}px)`,
            "@media (min-width:600px)": {
              left: "0",
              top: "0",
              right: "unset",
              bottom: "unset",
            },
            "@media (max-width: 600px)": {
              left: "0",
              top: "0",
              right: "unset",
              bottom: "unset",
            },
          }}
        >
          <Alert
            onClose={() => handleClose(notification.id!)}
            severity={notification.severity || "error"}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}

export default AppSnackbar;
