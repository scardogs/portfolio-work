import { useEffect, useRef } from "react";

const PaintbrushCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let points = [];
    let mouse = { x: -100, y: -100 };
    let animId;

    const COLORS = ["#e2b714", "#d4a510", "#f0c830", "#c9980a", "#ffdb4d"];
    const MAX_POINTS = 50;
    const FADE_SPEED = 0.025;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Add a few scattered paint dots around cursor
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 12;
        points.push({
          x: mouse.x + Math.cos(angle) * dist,
          y: mouse.y + Math.sin(angle) * dist,
          r: Math.random() * 4 + 1.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.7 + Math.random() * 0.3,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }

      if (points.length > MAX_POINTS) {
        points = points.slice(-MAX_POINTS);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.alpha -= FADE_SPEED;
        p.x += p.vx;
        p.y += p.vy;
        p.r *= 0.98;

        if (p.alpha <= 0) {
          points.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 99998,
      }}
    />
  );
};

export default PaintbrushCursor;
