import { Alert, Button, Card, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { TRANSLATIONS_NAMESPACES } from "../../../i18n/config";
import Loader from "../../../shared/components/Loader";
import { parseReduxError } from "../../../shared/utils/reduxUtils";
import { useLoginMutation } from "../api/apiAuth";

function LoginPage() {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES.AUTH);
  const navigate = useNavigate();

  const [email, setEmail] = useState("jozef@mak.sk");
  const [password, setPassword] = useState("H3slo123456*");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [loginError, setLoginError] = useState<null | string>(null);
  const [login, { isLoading, isError }] = useLoginMutation();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const validatePassword = () => {
    if (password.length === 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    validateEmail();
    validatePassword();

    if (!emailError && !passwordError) {
      setLoginError(null);

      try {
        const loginResponse = await login({ email, password });
        if (!loginResponse.error) {
          navigate("/app");
        } else {
          setLoginError(
            parseReduxError(loginResponse.error, t("errors.login")),
          );
        }
      } catch {
        setLoginError(t("errors.login"));
      }
    }
  };

  return (
    <Grid
      component="form"
      container
      sx={{
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        justifyContent: "center",
        paddingTop: 8,
        width: "100vw",
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          maxWidth: 500,
          px: 4,
          py: 8,
          rowGap: 4,
          width: {
            lg: "40%",
            md: "60%",
            sm: "80%",
            xs: "90%",
          },
        }}
      >
        {!isLoading && isError && <Alert severity="error">{loginError}</Alert>}

        {isLoading && <Loader message={t("messages.loging")} />}

        <TextField
          autoComplete="email"
          autoFocus
          error={emailError}
          fullWidth
          helperText={emailError && t("form.fields.email.errorMessage")}
          label={t("form.fields.email.label")}
          onBlur={validateEmail}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          placeholder={email ? undefined : t("form.fields.email.placeholder")}
          required
          size="small"
          type="email"
          value={email}
        />
        <TextField
          autoComplete="current-password"
          error={passwordError}
          fullWidth
          helperText={passwordError && t("form.fields.password.errorMessage")}
          label={t("form.fields.password.label")}
          onBlur={validatePassword}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={
            password ? undefined : t("form.fields.password.placeholder")
          }
          required
          size="small"
          type="password"
          value={password}
        />
        <Button
          fullWidth
          onClick={handleLogin}
          type="submit"
          variant="contained"
        >
          {t("form.buttons.login")}
        </Button>
      </Card>
    </Grid>
  );
}

export default LoginPage;
