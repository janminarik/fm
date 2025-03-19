import {
  Box,
  FormControl,
  MenuItem,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../app/store";
import { TRANSLATIONS_NAMESPACES } from "../../../i18n/config";
import Sidebar, { SidebarProps } from "../../../shared/components/Sidebar";
import { Language, ThemeName } from "../../../shared/types/commonTypes";
import { closeSettingsPanel } from "../slices/settingsPanelSlice";
import { setLanguage, setTheme } from "../slices/uiSettingsSlice";

const StyledSettingsPanel = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: theme.spacing(2, 2),
  width: theme.custom.settingsPanelWidth,
}));

function SettingsPanel(props: SidebarProps) {
  const { i18n, t } = useTranslation(TRANSLATIONS_NAMESPACES.SETTNGS);
  const open = useSelector((state: RootState) => state.settingsPanel.open);
  const theme = useSelector((state: RootState) => state.uiSettings.theme);
  const language = useSelector((state: RootState) => state.uiSettings.language);

  const dispatch = useDispatch<AppDispatch>();

  const handleSelectedThemeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setTheme(event.target.value as ThemeName));
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === null) return;
    const lang = event.target.value as Language;
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const handleClose = () => {
    dispatch(closeSettingsPanel());
  };

  return (
    <Sidebar
      anchor="right"
      mode="temporary"
      onClose={handleClose}
      open={open}
      {...props}
      content={
        <StyledSettingsPanel>
          <Stack mt={2} spacing={2}>
            <FormControl fullWidth size="small" variant="outlined">
              <TextField
                label={t("settings.theme.label")}
                onChange={handleSelectedThemeChange}
                select
                size="small"
                value={theme}
              >
                {Object.values(ThemeName).map((item) => (
                  <MenuItem key={item} value={item}>
                    {t(`settings.theme.options.${item}`)}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>

            <FormControl fullWidth size="small" variant="outlined">
              <TextField
                label={t("settings.language.label")}
                onChange={handleLanguageChange}
                select
                size="small"
                value={language}
              >
                {Object.values(Language).map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {t(`settings.language.options.${lang}`)}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Stack>
        </StyledSettingsPanel>
      }
    ></Sidebar>
  );
}

export default SettingsPanel;
