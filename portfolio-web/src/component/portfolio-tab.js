import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  useDisclosure,
  useClipboard,
  useToast,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

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
const INTRO_STAR_SIZE = 60;
const BLINKING_STARS = 5;
const BLINKING_STAR_SIZE = 5;

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

  // Intro animation state
  const [showIntro, setShowIntro] = useState(true);

  // Majestic light trail logic (lag-free)
  const mouseRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef([]); // [{x, y}]
  const [dummy, setDummy] = useState(0); // to trigger re-render

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

  // Intro star animation controls
  const introStarControls = useAnimation();
  useEffect(() => {
    if (showIntro) {
      introStarControls
        .start({
          scale: [1, 1.2, 2.5, 6],
          opacity: [1, 1, 0.7, 0],
          transition: { duration: 1.2, ease: "easeInOut" },
        })
        .then(() => {
          setShowIntro(false);
        });
    }
  }, [showIntro, introStarControls]);

  useEffect(() => {
    let running = true;
    let frame;
    const update = () => {
      // Add current mouse to trail
      const pos = { ...mouseRef.current };
      const prev = trailRef.current;
      const next = [...prev, pos];
      trailRef.current =
        next.length > TRAIL_LENGTH ? next.slice(-TRAIL_LENGTH) : next;
      setDummy((d) => d + 1); // trigger re-render
      if (running) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
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

  // Generate blinking star positions on client only
  const [starPositions, setStarPositions] = useState([]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setStarPositions(
        Array.from({ length: BLINKING_STARS }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 1.5,
        }))
      );
    }
  }, []);

  // Continuous star movement and blinking
  useEffect(() => {
    if (starPositions.length === 0) return;

    const interval = setInterval(() => {
      setStarPositions((prev) =>
        prev.map((star, idx) => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 1.5,
        }))
      );
    }, 3000); // Move all stars every 3 seconds

    return () => clearInterval(interval);
  }, [starPositions.length]);

  // Animation variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  // Use refs for trail and mouse
  const trail = trailRef.current;
  const mouse = mouseRef.current;

  return (
    <>
      {/* Intro Animation Overlay */}
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#191919",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={introStarControls}
            style={{
              width: INTRO_STAR_SIZE,
              height: INTRO_STAR_SIZE,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #fffbe6 0%, #e2b714 60%, #e2b71400 100%)",
              boxShadow:
                "0 0 32px 8px #fffbe6, 0 0 64px 16px #e2b71499, 0 0 8px 2px #fffbe6",
              border: "2px solid #fffbe6",
            }}
          />
        </motion.div>
      )}
      {/* Main Portfolio Tab */}
      {!showIntro && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", minHeight: "100vh", cursor: "none" }}
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
          {/* Blinking background stars */}
          {starPositions.length === BLINKING_STARS && (
            <MotionDiv
              style={{
                position: "fixed",
                zIndex: 1,
                pointerEvents: "none",
                top: 0,
                left: 0,
              }}
            >
              {starPositions.map((star, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1.8 + Math.random(),
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: star.delay,
                  }}
                  style={{
                    position: "absolute",
                    left: star.x - BLINKING_STAR_SIZE,
                    top: star.y - BLINKING_STAR_SIZE,
                    width: BLINKING_STAR_SIZE * 2,
                    height: BLINKING_STAR_SIZE * 2,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, #fffbe6 0%, #e2b714 60%, #e2b71400 100%)",
                    boxShadow:
                      "0 0 16px 4px #fffbe6, 0 0 32px 8px #e2b71499, 0 0 4px 1px #fffbe6",
                    border: "1.5px solid #fffbe6",
                    pointerEvents: "none",
                  }}
                />
              ))}
            </MotionDiv>
          )}
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
                left: mouse.x - LIGHT_RADIUS,
                top: mouse.y - LIGHT_RADIUS,
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

            {/* Mute/Unmute Button - Top Left (Desktop) */}
            <IconButton
              aria-label={isMuted ? "Unmute" : "Mute"}
              icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              onClick={() => setIsMuted((m) => !m)}
              position="fixed"
              top={4}
              left={4}
              zIndex={1000}
              colorScheme="yellow"
              variant="ghost"
              size="lg"
              fontSize="3xl"
              bg="#272727"
              border="1px solid #e2b714"
              _hover={{
                bg: "#232323",
                transform: "scale(1.1)",
              }}
              transition="all 0.2s"
              display={["none", "none", "flex"]}
            />

            <Tabs
              variant="enclosed"
              isFitted
              colorScheme="brand"
              position="relative"
              bg="#232323"
              borderRadius="xl"
              boxShadow="0 8px 32px 0 rgba(226,183,20,0.1)"
              overflow="hidden"
            >
              <TabList position="relative" bg="transparent" border="none" p={2}>
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
                      bg: "#191919",
                      borderColor: "#e2b714",
                      boxShadow: "0 4px 16px rgba(226,183,20,0.2)",
                      transform: "translateY(-2px)",
                    }}
                    _hover={{
                      color: "#e2b714",
                      bg: "#1a1a1a",
                      transition: "all 0.2s",
                      transform: "translateY(-1px)",
                    }}
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    borderRadius="lg"
                    border="1px solid transparent"
                    mx={1}
                    py={3}
                    px={4}
                    letterSpacing="1px"
                    textShadow="0 1px 2px rgba(226,183,20,0.3)"
                  >
                    {section.label}
                  </MotionTab>
                ))}
              </TabList>
            </Tabs>

            {/* Divider between tabs and sections */}
            <MotionBox
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              my={8}
              display="flex"
              justifyContent="center"
            >
              <Divider
                borderColor="#e2b714"
                borderWidth="2px"
                opacity="0.6"
                w="200px"
                borderRadius="full"
              />
            </MotionBox>

            {/* Imported Section Components */}
            <AboutSection
              sectionRef={sectionRefs.about}
              sectionVariant={sectionVariant}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
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
      )}
    </>
  );
};

export default PortfolioTab;
