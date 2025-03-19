import ArrowDropDownRounded from "@mui/icons-material/ArrowDropDownRounded";
import { alpha, createTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";

import { CustomThemeAttributes } from "./customThemeAttributes";
import { ThemeName } from "../shared/types/commonTypes";

declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    100: string;
    200: string;
    300: string;
    400: string;
    50: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface Palette {
    primaryDark: PaletteColor;
  }

  interface PaletteColor extends ColorRange {}
}

declare module "@mui/material/styles/createTypography" {
  interface Typography {
    fontFamilyCode: string;
    fontWeightExtraBold: number;
    fontWeightSemiBold: number;
  }

  interface TypographyOptions {
    fontFamilyCode?: string;
    fontWeightExtraBold?: number;
    fontWeightSemiBold?: number;
  }
}

declare module "@mui/material/styles" {
  interface Theme {
    custom: CustomThemeAttributes;
  }

  // Toto umožňuje získať prístup k vlastným hodnotám pri použití `theme.palette`.
  interface ThemeOptions {
    custom?: {
      closeNavigationPanelWidth?: number;
      navigationPanelWidth?: number;
      settingsPanelWidth?: number;
    };
  }
}

// TODO: enable this once types conflict is fixed
// declare module '@mui/material/Button' {
//   interface ButtonPropsVariantOverrides {
//     code: true;
//   }
// }

const defaultTheme = createTheme();

export const blue = {
  100: "#C2E0FF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  50: "#F0F7FF",
  500: "#007FFF",
  600: "#0072E5", // vs blueDark 900: WCAG 4.6 AAA (large), APCA 36 Not for reading text
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
  main: "#007FFF",
};
export const blueDark = {
  100: "#CEE0F3",
  200: "#91B9E3",
  300: "#5090D3",
  400: "#265D97",
  50: "#E2EDF8",
  500: "#1E4976",
  600: "#173A5E",
  700: "#132F4C", // contrast 13.64:1
  800: "#001E3C",
  900: "#0A1929",
  main: "#5090D3",
};
const grey = {
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7", // vs blueDark 900: WCAG 11.6 AAA, APCA 78 Best for text
  400: "#B2BAC2", // vs blueDark 900: WCAG 9 AAA, APCA 63.3 Ok for text
  50: "#F3F6F9",
  500: "#A0AAB4", // vs blueDark 900: WCAG 7.5 AAA, APCA 54.3 Only for large text
  600: "#6F7E8C", // vs white bg: WCAG 4.1 AA, APCA 68.7 Ok for text
  700: "#3E5060", // vs white bg: WCAG 8.3 AAA, APCA 88.7 Best for text
  800: "#2D3843", // vs white bg: WCAG 11.9 AAA, APCA 97.3 Best for text
  900: "#1A2027",
};
// context on the Advanced Perceptual Contrast Algorithm (APCA) used above here: https://github.com/w3c/wcag/issues/695

const systemFont = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

export const getMetaThemeColor = (mode: "dark" | "light") => {
  const themeColor = {
    dark: blueDark[800],
    light: grey[50],
  };
  return themeColor[mode];
};

export const getDesignTokens = (mode: "dark" | "light") =>
  ({
    palette: {
      divider: mode === "dark" ? alpha(blue[100], 0.08) : grey[100],
      mode,
      primary: {
        ...blue,
        ...(mode === "dark" && {
          main: blue[400],
        }),
      },
      primaryDark: blueDark,
      ...(mode === "dark" && {
        background: {
          default: blueDark[800],
          paper: blueDark[900],
        },
      }),
      common: {
        black: "#1D1D1D",
      },
      ...(mode === "light" && {
        text: {
          primary: grey[900],
          secondary: grey[700],
        },
      }),
      ...(mode === "dark" && {
        text: {
          primary: "#fff",
          secondary: grey[400],
        },
      }),
      error: {
        100: "#FFDBDE",
        200: "#FFBDC2",
        300: "#FF99A2",
        400: "#FF7A86",
        50: "#FFF0F1",
        500: "#FF505F",
        600: "#EB0014",
        700: "#C70011",
        800: "#94000D",
        900: "#570007",
        main: "#EB0014", // contrast 4.63:1
      },
      grey,
      success: {
        100: "#C6F6D9",
        200: "#9AEFBC",
        300: "#6AE79C",
        400: "#3EE07F",
        50: "#E9FBF0",
        500: "#21CC66",
        600: "#1DB45A",
        ...(mode === "dark" && {
          main: "#1DB45A", // contrast 6.17:1 (blueDark.800)
        }),
        ...(mode === "light" && {
          main: "#1AA251", // contrast 3.31:1
        }),
        700: "#1AA251",
        800: "#178D46",
        900: "#0F5C2E",
      },
      warning: {
        100: "#FFF3C1",
        200: "#FFECA1",
        300: "#FFDC48", // vs blueDark900: WCAG 10.4 AAA, APCA 72 Ok for text
        400: "#F4C000", // vs blueDark900: WCAG 6.4 AA normal, APCA 48 Only large text
        50: "#FFF9EB",
        500: "#DEA500", // vs blueDark900: WCAG 8 AAA normal, APCA 58 Only large text
        600: "#D18E00", // vs blueDark900: WCAG 6.4 AA normal, APCA 48 Only large text
        700: "#AB6800", // vs white bg: WCAG 4.4 AA large, APCA 71 Ok for text
        800: "#8C5800", // vs white bg: WCAG 5.9 AAA large, APCA 80 Best for text
        900: "#5A3600", // vs white bg: WCAG 10.7 AAA, APCA 95 Best for text
        main: "#DEA500",
      },
    },
    shape: {
      borderRadius: 10,
    },
    spacing: 10,
    typography: {
      body1: {
        fontSize: defaultTheme.typography.pxToRem(16), // 16px
        letterSpacing: 0,
        lineHeight: 24 / 16,
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14), // 14px
        letterSpacing: 0,
        lineHeight: 21 / 14,
      },
      button: {
        fontWeight: 700,
        letterSpacing: 0,
        textTransform: "initial",
      },
      caption: {
        display: "inline-block",
        fontSize: defaultTheme.typography.pxToRem(12), // 12px
        fontWeight: 700,
        letterSpacing: 0,
        lineHeight: 18 / 12,
      },
      fontFamily: ['"IBM Plex Sans"', ...systemFont].join(","),
      fontFamilyCode: [
        "Consolas",
        "Menlo",
        "Monaco",
        "Andale Mono",
        "Ubuntu Mono",
        "monospace",
      ].join(","),
      fontFamilySystem: systemFont.join(","),
      fontFamilyTagline: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(
        ",",
      ),
      fontWeightExtraBold: 800,
      fontWeightSemiBold: 600,
      h1: {
        fontFamily: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(","),
        fontSize: "clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)",
        fontWeight: 800,
        lineHeight: 78 / 70,
        ...(mode === "light" && {
          color: blueDark[900],
        }),
      },
      h2: {
        color: mode === "dark" ? grey[100] : blueDark[700],
        fontFamily: ['"PlusJakartaSans-ExtraBold"', ...systemFont].join(","),
        fontSize: "clamp(1.5rem, 0.9643rem + 1.4286vw, 2.25rem)",
        fontWeight: 800,
        lineHeight: 44 / 36,
      },
      h3: {
        fontFamily: ['"PlusJakartaSans-Bold"', ...systemFont].join(","),
        fontSize: defaultTheme.typography.pxToRem(36),
        letterSpacing: 0.2,
        lineHeight: 44 / 36,
      },
      h4: {
        fontFamily: ['"PlusJakartaSans-Bold"', ...systemFont].join(","),
        fontSize: defaultTheme.typography.pxToRem(28),
        letterSpacing: 0.2,
        lineHeight: 42 / 28,
      },
      h5: {
        color: mode === "dark" ? blue[300] : blue.main,
        fontFamily: ['"PlusJakartaSans-Bold"', ...systemFont].join(","),
        fontSize: defaultTheme.typography.pxToRem(24),
        letterSpacing: 0.1,
        lineHeight: 36 / 24,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(20),
        lineHeight: 30 / 20,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: 24 / 18,
      },
    },
  }) as ThemeOptions;

export function getThemedComponents(theme: Theme): {
  components: Theme["components"];
} {
  return {
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          containedPrimary: {
            backgroundColor: theme.palette.primary[500],
            color: "#fff",
          },
          sizeLarge: {
            padding: "0.875rem 1rem",
            ...theme.typography.body1,
            fontWeight: 700,
            lineHeight: 21 / 16,
          },
          sizeSmall: {
            marginLeft: theme.spacing(-1),
            padding: theme.spacing(0.5, 1),
          },
        },
        variants: [
          {
            // @ts-ignore internal repo module augmentation issue
            props: { variant: "code" },
            style: {
              "&:hover, &.Mui-focusVisible": {
                "& .MuiButton-endIcon": {
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.primary[300]
                      : theme.palette.primary.main,
                },
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[600]
                    : theme.palette.primary[50],
                borderColor: theme.palette.primary.main,
              },
              "& .MuiButton-endIcon": {
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[400]
                    : theme.palette.grey[700],
                display: "inline-block",
                marginRight: 10,
                position: "absolute",
                right: 0,
              },
              "& .MuiButton-startIcon": {
                color: theme.palette.grey[400],
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primaryDark[700]
                  : theme.palette.grey[50],
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primaryDark[400]
                  : theme.palette.grey[300],
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[400]
                  : theme.palette.grey[800],
              fontFamily: theme.typography.fontFamilyCode,
              fontSize: defaultTheme.typography.pxToRem(13), // 14px
              fontWeight: 400,
              letterSpacing: 0,
              lineHeight: 21 / 14,
              WebkitFontSmoothing: "subpixel-antialiased",
            },
          },
          {
            // @ts-ignore internal repo module augmentation issue
            props: { variant: "link" },
            style: {
              "& svg": {
                ml: -0.5,
              },
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary[300]
                  : theme.palette.primary[600],
              fontSize: theme.typography.pxToRem(14),
              fontWeight: 700,
              mb: 1,
            },
          },
        ],
      },
      MuiButtonBase: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
      MuiChip: {
        styleOverrides: {
          deleteIcon: {
            "&:hover": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.primary[900],
            },
            color:
              theme.palette.mode === "dark"
                ? "#fff"
                : theme.palette.primary[700],
          },
          root: ({ ownerState: { color, variant } }) => ({
            fontWeight: 500,
            ...(variant === "outlined" &&
              color === "default" && {
                backgroundColor: "transparent",
                borderColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.grey[100], 0.1)
                    : theme.palette.grey[200],
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[300]
                    : theme.palette.grey[900],
              }),
            ...(variant === "filled" &&
              color === "default" && {
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.primaryDark[600]
                      : theme.palette.primary[200],
                },
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[500]
                    : theme.palette.primary[100],
                border: "1px solid transparent",
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.primary[800],
              }),
            // for labelling product in the search
            // @ts-ignore internal repo module augmentation issue
            ...(variant === "light" && {
              ...(color === "default" && {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primaryDark[700], 0.5)
                    : alpha(theme.palette.primary[100], 0.3),
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary[200]
                    : theme.palette.primary[700],
              }),
              ...(color === "warning" && {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.warning[900]
                    : theme.palette.warning[100],
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.warning[900],
              }),
              ...(color === "success" && {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.success[900]
                    : theme.palette.success[100],
                color:
                  theme.palette.mode === "dark"
                    ? "#fff"
                    : theme.palette.success[900],
              }),
            }),
          }),
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            [theme.breakpoints.up("md")]: {
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
            },
          },
        },
      },
      MuiCssBaseline: {
        defaultProps: {
          enableColorScheme: true,
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.primary[100], 0.08)
                : theme.palette.grey[100],
          },
        },
      },
      MuiIconButton: {
        variants: [
          {
            props: { color: "primary" },
            style: {
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primaryDark[700], 0.4)
                    : theme.palette.grey[50],
                borderColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[600]
                    : theme.palette.grey[300],
              },
              border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.primaryDark[700] : theme.palette.grey[200]}`,
              borderRadius: theme.shape.borderRadius,
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary[300]
                  : theme.palette.primary[500],
              height: 34,
              width: 34,
            },
          },
        ],
      },
      MuiLink: {
        defaultProps: {
          underline: "none",
        },
        styleOverrides: {
          root: {
            "&:hover": {
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary[200]
                  : theme.palette.primary[700],
            },
            "&.MuiTypography-body1 > svg": {
              marginTop: 2,
            },
            "& svg:last-child": {
              marginLeft: 2,
            },
            alignItems: "center",
            color:
              theme.palette.mode === "dark"
                ? theme.palette.primary[300]
                : theme.palette.primary[600],
            display: "inline-flex",
            fontWeight: 700,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: 0,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primaryDark[700], 0.4)
                  : theme.palette.grey[50],
            },
            "&.Mui-selected": {
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[600]
                    : theme.palette.primary[100],
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primaryDark[700]
                  : theme.palette.primary[50],
              border: "1px solid",
              borderColor:
                theme.palette.mode === "dark"
                  ? `${theme.palette.primary[700]} !important`
                  : `${theme.palette.primary[500]} !important`,
              borderRadius: 10,
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.primary[500],
            },
            borderRadius: 0,
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
            fontSize: theme.typography.pxToRem(14),
            fontWeight: 500,
            padding: "8px",
            textTransform: "none",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            "& .MuiMenuItem-root": {
              "&:focus": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primaryDark[700], 0.4)
                    : theme.palette.grey[50],
              },
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.primaryDark[700], 0.4)
                    : theme.palette.grey[50],
              },
              "&.Mui-selected": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[700]
                    : alpha(theme.palette.primary[100], 0.6),
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary[300]
                    : theme.palette.primary[600],
                fontWeight: 500,
              },
              fontSize: theme.typography.pxToRem(14),
              fontWeight: 500,
            },
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[900]
                : theme.palette.background.paper,
            backgroundImage: "none",
            border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.primaryDark[700] : theme.palette.grey[200]}`,
            color: theme.palette.text.secondary,
            elevation: 0,
            minWidth: 160,
            mt: 0.5,
          },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[600]
                    : theme.palette.primary[100],
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primaryDark[700]
                  : theme.palette.primary[50],
              borderColor:
                theme.palette.mode === "dark"
                  ? `${theme.palette.primary[700]} !important`
                  : `${theme.palette.primary[500]} !important`,
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.primary[500],
            },
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[500]
                : theme.palette.grey[200],
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
            fontWeight: 700,
            textTransform: "none",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          outlined: {
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[500]
                : theme.palette.grey[200],
            display: "block",
            ...(theme.palette.mode === "dark" && {
              backgroundColor: theme.palette.primaryDark[700],
            }),
            "a&, button&": {
              "&:hover": {
                boxShadow: `0px 4px 20px ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(170, 180, 190, 0.3)"}`,
              },
            },
          },
          root: {
            "&[href]": {
              textDecorationLine: "none",
            },
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[900]
                : "#fff",
            backgroundImage: "none",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            boxShadow: `0px 4px 20px ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(170, 180, 190, 0.3)"}`,
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          IconComponent: ArrowDropDownRounded,
        },
        styleOverrides: {
          iconFilled: {
            top: "calc(50% - .25em)",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            "& .MuiSwitch-switchBase": {
              "&.Mui-checked": {
                color: "#fff",
                transform: "translateX(11px)",
              },
            },
            height: 20,
            padding: 0,
            width: 32,
          },
          switchBase: {
            "&.Mui-checked + .MuiSwitch-track": {
              opacity: 1,
            },
            color: "#fff",
            height: 20,
            padding: 0,
            width: 20,
          },
          thumb: {
            flexShrink: 0,
            height: "14px",
            width: "14px",
          },
          track: {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[400],
            borderRadius: 32,
            opacity: 1,
          },
        },
      },
      MuiTab: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
      MuiTableCell: {
        styleOverrides: {
          body: {
            color: theme.palette.text.secondary,
          },
          head: {
            color: theme.palette.text.primary,
            fontWeight: 700,
          },
          root: {
            borderColor: theme.palette.divider,
            padding: theme.spacing(1, 2),
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primaryDark[600]
                    : theme.palette.primary[100],
              },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primaryDark[700]
                  : theme.palette.primary[50],
              borderColor:
                theme.palette.mode === "dark"
                  ? `${theme.palette.primary[700]} !important`
                  : `${theme.palette.primary[500]} !important`,
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : theme.palette.primary[500],
            },
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[500]
                : theme.palette.grey[200],
            color:
              theme.palette.mode === "dark"
                ? theme.palette.grey[300]
                : theme.palette.grey[700],
            fontWeight: 500,
            textTransform: "none",
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.primaryDark[900]
                : "#fff",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            padding: "5px 9px",
          },
        },
      },
    },
  };
}

export const getTheme = (mode: ThemeName) => {
  const theme = createTheme(getDesignTokens(mode));
  theme.components = {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        body: {
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },
  };

  theme.custom = {
    closeNavigationPanelWidth: 60,
    navigationPanelWidth: 250,
    settingsPanelWidth: 300,
  };

  const brandingTheme = deepmerge(theme, getThemedComponents(theme));

  return brandingTheme;
};
