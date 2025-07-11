import "@/styles/globals.css";
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "@/styles/theme";
import { ScrollingBackground } from "react-scrolling-background";

const svgPattern = `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="%23191919"/><circle cx="20" cy="20" r="2" fill="%23e2b714"/></svg>')`;

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <ScrollingBackground
        backgroundColor="#191919"
        backgroundImage={svgPattern}
        speed={5.0}
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
      <Box position="relative" zIndex={1}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
