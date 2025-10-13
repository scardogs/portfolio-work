import React, { useRef, useState, useEffect, useMemo } from "react";
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
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import { FaVolumeUp, FaVolumeMute, FaUserShield } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionTab = motion(Tab);
const MotionDiv = motion.div;

const sections = [
  { label: "About Me", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const INTRO_STAR_SIZE = 40;
const BLINKING_STARS = 5;
const BLINKING_STAR_SIZE = 5;

const PortfolioTab = () => {
  const router = useRouter();
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
  const [mobileNumber, setMobileNumber] = useState("09946760366");
  const { onCopy, hasCopied } = useClipboard(mobileNumber);
  const toast = useToast();

  // Fetch contact data to get the mobile number
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        if (data.success && data.data?.mobile) {
          setMobileNumber(data.data.mobile);
        }
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      }
    };

    fetchContactData();
  }, []);

  // Audio player logic
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intro animation state
  const [showIntro, setShowIntro] = useState(true);

  // Simplified intro animation - no continuous animations
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 800); // Faster intro
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

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
        prev.map(() => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          delay: Math.random() * 1.5,
        }))
      );
    }, 3000); // Move all stars every 3 seconds

    return () => clearInterval(interval);
  }, [starPositions.length]);

  // Animation variants - simplified
  const sectionVariant = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }),
    []
  );

  return (
    <>
      {/* Intro Animation Overlay - Simplified */}
      {showIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              width: INTRO_STAR_SIZE,
              height: INTRO_STAR_SIZE,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #e2b714 0%, #e2b714 60%, #e2b71400 100%)",
              boxShadow: "0 0 20px 4px #e2b714",
            }}
          />
        </motion.div>
      )}
      {/* Main Portfolio Tab */}
      {!showIntro && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "relative",
            minHeight: "100vh",
          }}
        >
          {/* Animated Gradient Background */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1.2, delay: 0.3 }}
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
            zIndex={2}
          >
            {/* Audio element and mute button */}
            <audio ref={audioRef} src="/song1.mp3" autoPlay loop />

            {/* Header with Navigation and Control Buttons */}
            <Box
              bg="#232323"
              borderRadius="xl"
              boxShadow="0 4px 16px 0 rgba(226,183,20,0.1)"
              overflow="hidden"
              p={2}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
              >
                {/* Left Side - Mute Button */}
                <Box flex="0 0 auto">
                  <IconButton
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    onClick={() => setIsMuted((m) => !m)}
                    colorScheme="yellow"
                    variant="ghost"
                    size="md"
                    fontSize="lg"
                    bg="transparent"
                    color="#e2b714"
                    _hover={{
                      bg: "#191919",
                      transform: "scale(1.05)",
                    }}
                    transition="all 0.2s"
                  />
                </Box>

                {/* Center - Navigation Tabs */}
                <Tabs variant="unstyled" flex="1" mx={2}>
                  <TabList display="flex" justifyContent="center" gap={1}>
                    {sections.map((section) => (
                      <Tab
                        key={section.id}
                        onClick={() => handleTabClick(section.id)}
                        fontWeight="bold"
                        fontSize={["xs", "sm"]}
                        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                        color="#f7d794"
                        bg="transparent"
                        _selected={{
                          color: "#e2b714",
                          bg: "#191919",
                          borderColor: "#e2b714",
                          boxShadow: "0 4px 16px rgba(226,183,20,0.2)",
                        }}
                        _hover={{
                          color: "#e2b714",
                          bg: "#1a1a1a",
                        }}
                        transition="all 0.2s"
                        borderRadius="lg"
                        border="1px solid transparent"
                        py={2}
                        px={3}
                        letterSpacing="1px"
                        minW="auto"
                        flex="1"
                      >
                        {section.label}
                      </Tab>
                    ))}
                  </TabList>
                </Tabs>

                {/* Right Side - Admin Login Button */}
                <Box flex="0 0 auto">
                  <IconButton
                    icon={<FaUserShield />}
                    aria-label="Admin Login"
                    onClick={() => router.push("/admin/login")}
                    colorScheme="yellow"
                    variant="ghost"
                    size="md"
                    fontSize="lg"
                    bg="transparent"
                    color="#e2b714"
                    _hover={{
                      bg: "#191919",
                      transform: "scale(1.05)",
                    }}
                    transition="all 0.2s"
                  />
                </Box>
              </Box>
            </Box>

            {/* Divider between tabs and sections */}
            <Box my={8} display="flex" justifyContent="center">
              <Divider
                borderColor="#e2b714"
                borderWidth="2px"
                opacity="0.6"
                w="200px"
                borderRadius="full"
              />
            </Box>

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
