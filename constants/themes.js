// background: #282a38 (blue-grey)
// theme: #2f3242 (dark blue - cards, navs)
// theme-lighter: #3a3e52 (grey - headers, unlit icons, grey text)
// accent-light" #68FCFF
// accent: #00DFFC (light blue - accent (no white text))
//  accent-dark: #00A3BC

// define default styles here
const baseTheme = {
  COLORS: {
    BLUE2: "#00A3BC",
    BLUE1: "#00DFFC",
    BLUE0: "#68FCFF",
    DARK: "#282a38",
    MID: "#2f3242",
    LIGHT: "#3a3e52",
    RED: "#FF725C",
    GREEN: "#9EEBCF",
  },
  FONT: {
    FAMILY: "SpaceGrotesk",
  },
};

// background: linear-gradient(39deg, #282a3890, #3a3e52);
// backdrop-filter: blur(9px);
export const themes = {
  light: {
    ...baseTheme,
    BG: {
      DARK: "#282a38",
      MID: "#2f3242",
      LIGHT: "#3a3e52",
    },
  },
  dark: {
    ...baseTheme,
    BG: {
      DARK: "#000",
      MID: "#000",
      LIGHT: "#000",
    },
  },
};
