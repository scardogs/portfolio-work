import { extendTheme } from "@chakra-ui/react";

const monkeytypeColors = {
  brand: {
    50: "#fffbe6",
    100: "#fff3bf",
    200: "#ffe066",
    300: "#ffd60a",
    400: "#e2b714",
    500: "#e2b714",
    600: "#bfa100",
    700: "#8c7a00",
    800: "#665c00",
    900: "#3d2c02",
  },
  yellow: {
    100: "#fffbe6",
    200: "#ffe066",
    300: "#ffd60a",
    400: "#e2b714",
    500: "#e2b714",
    600: "#bfa100",
  },
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e0e0e0",
    300: "#bdbdbd",
    400: "#9e9e9e",
    500: "#757575",
    600: "#616161",
    700: "#424242",
    800: "#272727",
    900: "#191919",
  },
  background: "#191919",
  surface: "#272727",
  accent: "#e2b714",
  text: "#fff",
  secondaryText: "#555",
};

const theme = extendTheme({
  colors: monkeytypeColors,
  styles: {
    global: {
      body: {
        bg: "background",
        color: "text",
        fontFamily: "Geist Mono, Fira Mono, Menlo, monospace",
      },
    },
  },
  fonts: {
    heading: "Geist Mono, Fira Mono, Menlo, monospace",
    body: "Geist Mono, Fira Mono, Menlo, monospace",
  },
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          _selected: {
            color: "accent",
            bg: "surface",
            borderColor: "accent",
            boxShadow: "none",
          },
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    Box: {
      baseStyle: {
        borderRadius: "md",
        boxShadow: "none",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "md",
        boxShadow: "none",
      },
      variants: {
        solid: {
          bg: "accent",
          color: "#191919",
          _hover: {
            bg: "brand.400",
            color: "#191919",
            boxShadow: "none",
          },
        },
        outline: {
          borderColor: "accent",
          color: "accent",
          _hover: {
            bg: "gray.800",
            color: "accent",
          },
        },
      },
    },
  },
  breakpoints: {
    sm: "30em", // 480px
    md: "48em", // 768px
    lg: "62em", // 992px
    xl: "80em", // 1280px
    "2xl": "96em", // 1536px
  },
});

export default theme;
