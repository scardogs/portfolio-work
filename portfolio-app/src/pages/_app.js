import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "@/styles/theme";
import Particles from "react-tsparticles";

const particlesOptions = {
  background: { color: { value: "#191919" } },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" }, resize: true },
    modes: { grab: { distance: 180, line_linked: { opacity: 0.7 } } },
  },
  particles: {
    color: { value: "#e2b714" },
    links: {
      enable: true,
      color: "#e2b714",
      distance: 150,
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      outModes: { default: "out" },
    },
    number: { value: 40, density: { enable: true, area: 800 } },
    opacity: { value: 0.7 },
    shape: { type: "polygon", polygon: { nb_sides: 6 } },
    size: { value: 6, random: true },
  },
  detectRetina: true,
};

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Box position="fixed" zIndex={0} top={0} left={0} w="100vw" h="100vh">
        <Particles
          options={particlesOptions}
          style={{ position: "absolute" }}
        />
      </Box>
      <Box position="relative" zIndex={1}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
