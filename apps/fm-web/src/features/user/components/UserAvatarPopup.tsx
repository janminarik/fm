import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Popover,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { TRANSLATIONS_NAMESPACES } from "../../../i18n/config";
import Panel from "../../../shared/components/Panel";
import { setNotifications } from "../../../shared/slices/notificationSlice";
import { parseReduxError } from "../../../shared/utils/reduxUtils";
import { useLogoutMutation } from "../../auth/api/apiAuth";
import { ROUTES } from "../../auth/routes/authRoutes";
import { useGetCurrentUserQuery } from "../api/userApi";

function UserAvatarPopup() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.AUTH);
  const [logout, { isLoading: isLoadingLogout }] = useLogoutMutation();
  const { data: user, isFetching: isLoadingUserProfile } =
    useGetCurrentUserQuery(undefined);

  const id = isOpen ? "user-avatar-popup" : undefined;

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      const apiResult = await logout();
      if (!apiResult.error) {
        navigate(ROUTES.LOGIN);
      } else {
        setNotifications({
          message: parseReduxError(apiResult.error, t("errors.logout")),
          severity: "error",
        });
      }
    } catch {
      setNotifications({ message: t("errors.logout"), severity: "error" });
    }
  };

  return (
    <>
      <ButtonBase onClick={handleToggle}>
        <Avatar
          alt={(user?.firstName || "") + " " + (user?.lastName || "")}
          src={user?.avatarUrl}
        ></Avatar>
      </ButtonBase>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        id={id}
        onClose={handleClose}
        open={isOpen}
        sx={{ mt: 1 }}
        transformOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <Panel isLoading={isLoadingUserProfile || isLoadingLogout}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            p={2}
            sx={{ minHeight: 350, minWidth: 250 }}
          >
            <Typography>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Button
              fullWidth
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ justifyContent: "start" }}
            >
              Log out
            </Button>
          </Box>
        </Panel>
      </Popover>
    </>
  );
}

export default UserAvatarPopup;
