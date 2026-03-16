import { ChakraProvider, Box } from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/next";
import { ScrollingBackground } from "react-scrolling-background";

const SplashCursor = dynamic(() => import("../component/SplashCursor"), { ssr: false });

const svgPattern = `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="%23191919"/><circle cx="20" cy="20" r="2" fill="%23e2b714"/></svg>')`;

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  return (
    <ChakraProvider>
      {isAdmin && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
      <Analytics/>
      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .infinite-slide {
          animation: slide 30s linear infinite;
        }
      `}</style>
      <ScrollingBackground
        backgroundColor="#191919"
        backgroundImage={svgPattern}
        speed={5.0}
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
        }}
      />
      {!isAdmin && <SplashCursor />}
      <Box position="relative" zIndex={1}>
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
