import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { motion, useMotionValue, useSpring, useAnimation } from "framer-motion";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

const MotionBox = motion(Box);
const MotionTab = motion(Tab);
const MotionDiv = motion.div;

const sections = [
  { label: "About Me", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const tabUnderline = {
  rest: { scale: 1, borderBottom: "4px solid rgba(0,0,0,0)" },
  hover: { scale: 1.08, borderBottom: "4px solid #e2b714" },
  selected: { scale: 1.12, borderBottom: "4px solid #e2b714" },
};

const TRAIL_LENGTH = 22;
const LIGHT_RADIUS = 12;
const TRAIL_MAX_RADIUS = 18;

const PortfolioTab = () => {
  const sectionRefs = {
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
  };

  const handleTabClick = (id) => {
    sectionRefs[id].current.scrollIntoView({ behavior: "smooth" });
  };

  const { isOpen, onToggle } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard("09946760366");
  const toast = useToast();

  // Audio player logic
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Majestic light trail logic
  const [trail, setTrail] = useState([]); // [{x, y}]
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });

  // Star pulse animation
  const starControls = useAnimation();
  useEffect(() => {
    starControls.start({
      scale: [1, 1.25, 1],
      filter: [
        "drop-shadow(0 0 12px #fffbe6) drop-shadow(0 0 24px #e2b71499)",
        "drop-shadow(0 0 24px #fffbe6) drop-shadow(0 0 48px #e2b714)",
        "drop-shadow(0 0 12px #fffbe6) drop-shadow(0 0 24px #e2b71499)",
      ],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
    });
  }, [starControls]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const pos = { x: e.clientX, y: e.clientY };
      setMouse(pos);
      setTrail((prev) => {
        const next = [...prev, pos];
        return next.length > TRAIL_LENGTH ? next.slice(-TRAIL_LENGTH) : next;
      });
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = isMuted;
      if (!isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isMuted, isPlaying]);

  // Animation variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* Animated Gradient Background */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.2, delay: 1.2 }}
        style={{
          position: "fixed",
          zIndex: 0,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(120deg, #191919 60%, #e2b714 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientMove 8s ease-in-out infinite alternate",
        }}
      />
      {/* Majestic light trail following mouse */}
      <MotionDiv
        style={{
          position: "fixed",
          zIndex: 2,
          pointerEvents: "none",
          top: 0,
          left: 0,
        }}
        animate={{}}
      >
        <svg
          width="100vw"
          height="100vh"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "visible",
          }}
        >
          {trail.map((p, i) => {
            // Fade and shrink as the point gets older
            const t = i / TRAIL_LENGTH;
            const radius = TRAIL_MAX_RADIUS * (1 - t) + 4;
            const opacity = 0.18 + 0.32 * (1 - t);
            const blur = 16 + 32 * (1 - t);
            const color = `rgba(226,183,20,${0.5 + 0.5 * (1 - t)})`;
            const white = `rgba(255,255,220,${0.18 + 0.32 * (1 - t)})`;
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={`url(#majestic-glow-${i})`}
                  style={{
                    filter: `blur(${blur}px) drop-shadow(0 0 24px #fffbe6)`,
                    opacity,
                  }}
                />
                <defs>
                  <radialGradient
                    id={`majestic-glow-${i}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop
                      offset="0%"
                      stopColor="#fffbe6"
                      stopOpacity={0.8 + 0.2 * (1 - t)}
                    />
                    <stop
                      offset="60%"
                      stopColor={color}
                      stopOpacity={0.7 + 0.3 * (1 - t)}
                    />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </radialGradient>
                </defs>
              </g>
            );
          })}
        </svg>
        {/* Glowing, pulsing star at cursor */}
        <motion.div
          animate={starControls}
          style={{
            position: "absolute",
            x: springX,
            y: springY,
            width: LIGHT_RADIUS * 2,
            height: LIGHT_RADIUS * 2,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #fffbe6 0%, #e2b714 60%, #e2b71400 100%)",
            boxShadow:
              "0 0 32px 8px #fffbe6, 0 0 64px 16px #e2b71499, 0 0 8px 2px #fffbe6",
            pointerEvents: "none",
            opacity: 0.95,
            border: "2px solid #fffbe6",
          }}
        />
      </MotionDiv>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
      <Box
        w={["100%", "90%", "800px"]}
        maxW="100%"
        mx="auto"
        mt={[4, 8]}
        px={[2, 4, 0]}
        position="relative"
        zIndex={1}
      >
        {/* Audio element and mute button */}
        <audio ref={audioRef} src="/song1.mp3" autoPlay loop />

        <Tabs
          variant="enclosed"
          isFitted
          colorScheme="brand"
          position="relative"
        >
          <TabList position="relative">
            {sections.map((section, idx) => (
              <MotionTab
                key={section.id}
                onClick={() => handleTabClick(section.id)}
                fontWeight="bold"
                fontSize={["sm", "md"]}
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                variants={tabUnderline}
                initial="rest"
                whileHover="hover"
                animate={
                  sectionRefs[section.id].current &&
                  sectionRefs[section.id].current.id ===
                    document.activeElement?.id
                    ? "selected"
                    : "rest"
                }
                _selected={{
                  color: "#e2b714",
                  bg: "#272727",
                  borderColor: "#e2b714",
                  boxShadow: "none",
                }}
                _hover={{
                  color: "#e2b714",
                  bg: "#232323",
                  transition: "all 0.2s",
                }}
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {section.label}
              </MotionTab>
            ))}
          </TabList>
        </Tabs>

        {/* Imported Section Components */}
        <AboutSection
          sectionRef={sectionRefs.about}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          sectionVariant={sectionVariant}
        />

        <SkillsSection
          sectionRef={sectionRefs.skills}
          sectionVariant={sectionVariant}
        />

        <ProjectsSection
          sectionRef={sectionRefs.projects}
          sectionVariant={sectionVariant}
        />

        <ContactSection
          sectionRef={sectionRefs.contact}
          sectionVariant={sectionVariant}
          onCopy={onCopy}
          hasCopied={hasCopied}
          toast={toast}
        />
      </Box>
    </MotionDiv>
  );
};

export default PortfolioTab;
