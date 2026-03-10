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
          @keyframes _preBarFill { from { width:0% } to { width:100% } }
          @keyframes _preDot { 0%,100%{opacity:.2} 50%{opacity:1} }
        `}</style>
      </Head>
      <body style={{ backgroundColor: "#0a0a0a", margin: 0 }}>

        {/* Pure inline-styled pre-loader — shows before any JS loads */}
        <div id="css-preloader" style={{
          position: "fixed", inset: 0, zIndex: 99999,
          background: "#0a0a0a",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          fontFamily: "system-ui,-apple-system,sans-serif",
          transition: "opacity 0.4s ease",
        }}>
          {/* Decorative lines */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
            <div style={{ width:80, height:1, background:"#888" }} />
            <div style={{
              width:12, height:12, border:"1px solid #888",
              transform:"rotate(45deg)", margin:"0 6px", flexShrink:0,
              position:"relative",
            }}>
              <div style={{
                position:"absolute", top:"50%", left:"50%",
                transform:"translate(-50%,-50%)",
                width:6, height:6, background:"#888",
              }} />
            </div>
            <div style={{ width:80, height:1, background:"#888" }} />
          </div>

          {/* Name */}
          <p style={{
            color:"#e0e0e0", fontSize:"clamp(20px,4vw,34px)",
            fontWeight:300, letterSpacing:4, margin:"0 0 8px",
          }}>
            John Michael T. Escarlan
          </p>

          {/* Subtitle */}
          <p style={{
            color:"#888", fontSize:12, letterSpacing:2,
            textTransform:"uppercase", margin:"0 0 24px",
          }}>
            Portfolio
          </p>

          {/* Progress bar */}
          <div style={{
            width:200, height:1, background:"#333",
            position:"relative", overflow:"hidden", marginBottom:8,
          }}>
            <div style={{
              position:"absolute", top:0, left:0, height:"100%",
              background:"#e0e0e0",
              animation:"_preBarFill 2s ease-out forwards",
            }} />
          </div>

          {/* Dots */}
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{
                width:6, height:6, background:"#888", borderRadius:"50%",
                animation:`_preDot 1.5s ease-in-out ${i*0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
