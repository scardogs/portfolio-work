import React, { useEffect, useState } from "react";
import { ChakraProvider, Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/next";
import { ScrollingBackground } from "react-scrolling-background";

const SplashCursor = dynamic(() => import("../component/SplashCursor"), { ssr: false });

const svgPattern = `url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="%23191919"/><circle cx="20" cy="20" r="2" fill="%23e2b714"/></svg>')`;

async function purgeStaleCaches() {
  if (typeof window === "undefined" || !("caches" in window)) return;
  try {
    const keys = await window.caches.keys();
    await Promise.all(keys.map((k) => window.caches.delete(k)));
  } catch (_) {
    // ignore cache deletion errors
  }
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("AppErrorBoundary caught error:", error, info);
    if (typeof window !== "undefined") {
      purgeStaleCaches();
      const el = document.getElementById("css-preloader");
      if (el) el.remove();
      try {
        const retried = sessionStorage.getItem("jme_error_auto_reload");
        if (!retried) {
          sessionStorage.setItem("jme_error_auto_reload", "1");
          window.location.reload();
        }
      } catch (_) {}
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          bg="#0a0a0a"
          color="#e0e0e0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          <VStack
            spacing={4}
            maxW="420px"
            textAlign="center"
            p={8}
            bg="#141414"
            border="1px solid #2a2a2a"
            borderRadius="12px"
          >
            <Heading size="md" fontWeight="600">
              New Update Available
            </Heading>
            <Text fontSize="13px" color="#888888">
              A newer version of the site was just deployed. Click below to refresh with the latest assets.
            </Text>
            <Button
              onClick={async () => {
                await purgeStaleCaches();
                try {
                  sessionStorage.removeItem("jme_error_auto_reload");
                } catch (_) {}
                window.location.reload();
              }}
              bg="#e2b714"
              color="#0a0a0a"
              _hover={{ bg: "#f0c52a" }}
              size="sm"
              px={6}
            >
              Reload Site
            </Button>
          </VStack>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");
  const isHome = router.pathname === "/";
  const [splashCursorEnabled, setSplashCursorEnabled] = useState(true);

  // Clean up stale Workbox caches & keep Service Worker updated
  useEffect(() => {
    purgeStaleCaches();
    try {
      sessionStorage.removeItem("jme_error_auto_reload");
    } catch (_) {}

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch(() => {});
    }

    const handleChunkError = (event) => {
      const msg = String(
        event?.message || event?.reason?.message || event?.reason || ""
      );
      if (
        msg.includes("ChunkLoadError") ||
        msg.includes("Loading chunk") ||
        msg.includes("Failed to fetch dynamically imported module") ||
        msg.includes("bad-precaching-response")
      ) {
        purgeStaleCaches().then(() => {
          try {
            if (!sessionStorage.getItem("jme_chunk_reload")) {
              sessionStorage.setItem("jme_chunk_reload", "1");
              window.location.reload();
            }
          } catch (_) {}
        });
      }
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleChunkError);
    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleChunkError);
    };
  }, []);

  // Dismiss the CSS pre-loader on every non-home route.
  // The home page (portfolio-tab.js) handles its own dismissal in sync
  // with the intro animation.
  useEffect(() => {
    if (isHome) return;
    const el = document.getElementById("css-preloader");
    if (el) el.remove();
  }, [isHome]);

  // Load global site settings (only for public site, not admin)
  useEffect(() => {
    if (isAdmin) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json.data) {
          setSplashCursorEnabled(json.data.splashCursorEnabled !== false);
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  return (
    <ChakraProvider>
      {isAdmin && (
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      )}
      <Analytics />
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
      {!isAdmin && splashCursorEnabled && <SplashCursor />}
      <Box position="relative" zIndex={1}>
        <AppErrorBoundary>
          <Component {...pageProps} />
        </AppErrorBoundary>
      </Box>
    </ChakraProvider>
  );
}

