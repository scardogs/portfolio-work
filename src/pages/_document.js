import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JME Portfolio" />
        <meta name="format-detection" content="telephone=no" />
        <style>{`
          body { background-color: #0a0a0a !important; margin: 0 !important; }
          @keyframes _preGlow {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50%      { opacity: 0.9; transform: translate(-50%, -50%) scale(1.35); }
          }
          @keyframes _preDot {
            0%, 100% { opacity: 1;   box-shadow: 0 0 14px rgba(224,224,224,0.8); }
            50%      { opacity: 0.5; box-shadow: 0 0 4px  rgba(224,224,224,0.25); }
          }
          #css-preloader.hidden { opacity: 0; }
        `}</style>
      </Head>
      <body style={{ backgroundColor: "#0a0a0a", margin: 0 }}>

        {/* Minimal SSR pre-loader — black canvas with subtle yellow pulse.
            Acts as a seamless handoff to the React loading screen. */}
        <div id="css-preloader" style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}>
          {/* Outer aurora glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,224,224,0.10) 0%, rgba(224,224,224,0.03) 40%, transparent 70%)",
            filter: "blur(20px)",
            transform: "translate(-50%, -50%)",
            animation: "_preGlow 1.8s ease-in-out infinite",
          }} />
          {/* Center dot */}
          <div style={{
            position: "relative",
            width: 8, height: 8, borderRadius: "50%",
            background: "#e0e0e0",
            animation: "_preDot 1.2s ease-in-out infinite",
          }} />
        </div>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
