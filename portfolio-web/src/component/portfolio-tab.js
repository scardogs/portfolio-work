import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Divider,
  Input,
  Textarea,
  Heading,
  Text,
  HStack,
  VStack,
  Flex,
  useToast,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
} from "@chakra-ui/react";
import ContactForm from "./ContactForm";
import ContentGenerationSection from "./ContentGenerationSection";
import Shuffle from "./Shuffle";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from "framer-motion";
import { FaUserShield, FaGithub, FaLinkedin, FaBars } from "react-icons/fa";

const MotionBox = motion.create(Box);
const MotionDiv = motion.div;
const MotionFlex = motion.create(Flex);
const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionButton = motion.create(Button);
const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  return `https://${url}`;
};

// ─── Animated Section Heading ───────────────────────────────────────────
const SectionHeading = ({ children, subtitle, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Box id={id} ref={ref}>
      <MotionHeading
        as="h2"
        fontSize={[32, 36, 40]}
        fontWeight="600"
        color="#e0e0e0"
        mb={2}
        letterSpacing="-1px"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </MotionHeading>
      {subtitle && (
        <MotionText
          fontSize={[11, 12, 13]}
          fontWeight="400"
          color="#888888"
          mb={8}
          letterSpacing="2px"
          textTransform="uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </MotionText>
      )}
    </Box>
  );
};

// ─── Animated Divider ───────────────────────────────────────────────────
const AnimatedDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Box my={[12, 16, 20]} ref={ref}>
      <MotionBox
        h="1px"
        bg="#333333"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
    </Box>
  );
};

// ─── 3D Tilt Card ───────────────────────────────────────────────────────
const TiltCard = ({ children, ...props }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("perspective(600px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(600px) rotateX(0deg) rotateY(0deg)");
  }, []);

  return (
    <Box
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      {...props}
    >
      {children}
    </Box>
  );
};

// ─── Year Counter Animation ─────────────────────────────────────────────
const AnimatedYear = ({ year }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayYear, setDisplayYear] = useState(0);
  const numYear = parseInt(year, 10);

  useEffect(() => {
    if (!isInView || isNaN(numYear)) return;
    const start = numYear - 20;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayYear(Math.round(start + (numYear - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, numYear]);

  return (
    <Text
      ref={ref}
      fontSize="28px"
      fontWeight="700"
      color="#e0e0e0"
      mb={2}
      letterSpacing="-1px"
    >
      {isNaN(numYear) ? year : displayYear}
    </Text>
  );
};

// ─── Parallax Section Wrapper ────────────────────────────────────────────
const ParallaxSection = ({ children, offset = 40, ...props }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <Box ref={ref} overflow="hidden" {...props}>
      <MotionBox style={{ y }}>
        {children}
      </MotionBox>
    </Box>
  );
};

// ─── Fluid Morphing Navbar ──────────────────────────────────────────────
const FluidNavbar = ({ activeSection, navLinkProps, onOpen, router, children }) => {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => {
      setScrolled(v > 60);
    });
  }, [scrollY]);

  // Spring-driven transforms for that fluid, water-like feel
  const SPRING = { type: "spring", stiffness: 180, damping: 22, mass: 0.9 };

  return (
    <>
      {/* Spacer to preserve layout since the nav is fixed-positioned */}
      <Box h={["64px", "68px", "72px"]} aria-hidden="true" />
      <MotionBox
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={1000}
        mx="auto"
        animate={{
          width: scrolled ? "min(640px, 92%)" : "100%",
          marginTop: scrolled ? 16 : 0,
          borderRadius: scrolled ? 999 : 0,
          paddingLeft: scrolled ? 18 : 0,
          paddingRight: scrolled ? 18 : 0,
          borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(51,51,51,0.5)",
          boxShadow: scrolled
            ? "0 20px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset"
            : "0 0 0 rgba(0,0,0,0)",
          backgroundColor: scrolled ? "rgba(15,15,15,0.7)" : "rgba(10,10,10,0.8)",
        }}
        transition={SPRING}
        style={{
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: scrolled ? "none" : "1px solid rgba(51,51,51,0.5)",
          borderWidth: scrolled ? "1px" : "0",
          borderStyle: "solid",
          overflow: "hidden",
        }}
      >
      <MotionFlex
        animate={{ paddingTop: scrolled ? 8 : 16, paddingBottom: scrolled ? 8 : 16 }}
        transition={SPRING}
        maxW="1200px"
        mx="auto"
        px={scrolled ? 2 : [4, 6, 8]}
        justify="space-between"
        align="center"
      >
        <HStack
          spacing={scrolled ? 5 : 8}
          display={{ base: "none", md: "flex" }}
          as={motion.div}
          animate={{ gap: scrolled ? 18 : 32 }}
          transition={SPRING}
        >
          <Button {...navLinkProps("about-section")}>About</Button>
          <Button {...navLinkProps("projects-section")}>Work</Button>
          <Button {...navLinkProps("content-gen-section")}>Content</Button>
          <Button {...navLinkProps("contact-section")}>Contact</Button>
        </HStack>

        <HStack spacing={scrolled ? 2 : 4}>
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<FaBars />}
            aria-label="Open Menu"
            onClick={onOpen}
            variant="ghost"
            color="#888888"
            _hover={{ color: "#e0e0e0", bg: "#1a1a1a" }}
          />
          <IconButton
            icon={<FaUserShield />}
            aria-label="Admin Login"
            onClick={() => router.push("/admin/login")}
            variant="ghost"
            size="sm"
            color="#888888"
            _hover={{ color: "#e0e0e0", bg: "#1a1a1a" }}
          />
        </HStack>

        {children}
      </MotionFlex>
    </MotionBox>
    </>
  );
};

// ─── Scroll Progress Bar ────────────────────────────────────────────────
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <MotionBox
      position="fixed"
      top="0"
      left="0"
      right="0"
      h="2px"
      bg="#e0e0e0"
      zIndex={10001}
      style={{ scaleX, transformOrigin: "0%" }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const PortfolioTab = () => {
  const router = useRouter();
  const [aboutData, setAboutData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contactData, setContactData] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [years, setYears] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Active section tracking
  const [activeSection, setActiveSection] = useState("");

  const toast = useToast();

  // Audio player logic for loading screen
  const audioRef = useRef(null);

  // Intro animation state
  const [showIntro, setShowIntro] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [introExiting, setIntroExiting] = useState(false);
  const [minimumIntroDone, setMinimumIntroDone] = useState(false);
  const [heroImageReady, setHeroImageReady] = useState(false);

  // Tech marquee hover pause
  const [marquePaused, setMarqueePaused] = useState(false);

  // ─── Active nav section tracker (scroll-position based) ──────────────
  useEffect(() => {
    if (showIntro) return;
    const sectionIds = ["about-section", "projects-section", "content-gen-section", "contact-section"];
    const OFFSET = 120; // pixels below viewport top counted as "active line"

    const compute = () => {
      let current = "";
      let bestTop = -Infinity;
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        // section whose top has crossed the active line (top <= OFFSET) and is closest to it
        if (top - OFFSET <= 0 && top > bestTop) {
          bestTop = top;
          current = id;
        }
      });
      if (current) setActiveSection(current);
    };

    const onScroll = () => requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const timer = setTimeout(compute, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [showIntro]);

  // ─── Remove CSS pre-loader once React has mounted ─────────────────
  useEffect(() => {
    const el = document.getElementById("css-preloader");
    if (el) {
      el.classList.add("hidden");
      setTimeout(() => el.remove(), 450);
    }
  }, []);

  const INTRO_DURATION_MS = 1800;

  // ─── Loading progress animation ───────────────────────────────────
  useEffect(() => {
    if (showIntro) {
      const playSound = async () => {
        if (audioRef.current) {
          try {
            audioRef.current.volume = 0.3;
            await audioRef.current.play();
          } catch (error) {
            console.log("Audio autoplay blocked by browser (this is normal)");
          }
        }
      };
      setTimeout(playSound, 100);

      // Animate progress bar
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 4;
        });
      }, 45);

      const timer = setTimeout(() => {
        setMinimumIntroDone(true);
      }, INTRO_DURATION_MS);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [showIntro, INTRO_DURATION_MS]);

  useEffect(() => {
    let cancelled = false;
    const src = aboutData?.profileImage || "/profile2.png";
    const img = new window.Image();
    img.src = src;
    const done = () => {
      if (!cancelled) setHeroImageReady(true);
    };
    if (img.complete) done();
    else {
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
    };
  }, [aboutData?.profileImage]);

  useEffect(() => {
    if (!showIntro) return;
    if (!minimumIntroDone || !heroImageReady) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIntroExiting(true);
    const exitTimer = setTimeout(() => setShowIntro(false), 800);
    return () => clearTimeout(exitTimer);
  }, [showIntro, minimumIntroDone, heroImageReady]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          aboutRes,
          projectsRes,
          skillsRes,
          contactRes,
          workExperienceRes,
          yearsRes,
        ] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/contact"),
          fetch("/api/work-experience"),
          fetch("/api/years"),
        ]);

        const aboutData = await aboutRes.json();
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();
        const contactData = await contactRes.json();
        const workExperienceData = await workExperienceRes.json();
        const yearsData = await yearsRes.json();

        if (aboutData.success) {
          console.log("About data from API:", aboutData.data);
          setAboutData(aboutData.data);
        }
        if (projectsData.success) setProjects(projectsData.data);
        if (skillsData.success) setSkills(skillsData.data);
        if (contactData.success) setContactData(contactData.data);
        if (workExperienceData.success)
          setWorkExperiences(workExperienceData.data);
        if (yearsData.success) setYears(yearsData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Message sent!",
          description: "Thank you for reaching out. I'll get back to you soon.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return true;
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  // Helper for nav link styling
  const navLinkProps = (sectionId) => ({
    variant: "link",
    color: activeSection === sectionId ? "#e0e0e0" : "#888888",
    fontSize: [13, 14],
    fontWeight: "400",
    letterSpacing: "1px",
    position: "relative",
    _hover: { color: "#e0e0e0" },
    _after: {
      content: '""',
      position: "absolute",
      bottom: "-4px",
      left: activeSection === sectionId ? "0" : "50%",
      right: activeSection === sectionId ? "0" : "50%",
      height: "1px",
      bg: "#e0e0e0",
      transition: "all 0.3s ease",
    },
    transition: "color 0.3s ease",
    onClick: () =>
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" }),
  });

  return (
    <>
      {/* ═══ LOADING SCREEN ═══ */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed",
              zIndex: 9999,
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {/* Top half */}
            <motion.div
              animate={introExiting ? { y: "-100%" } : { y: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "#0a0a0a",
                zIndex: 2,
              }}
            />
            {/* Bottom half */}
            <motion.div
              animate={introExiting ? { y: "100%" } : { y: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "#0a0a0a",
                zIndex: 2,
              }}
            />

            {/* Centered content */}
            <Box
              position="absolute"
              top={0}
              left={0}
              w="100%"
              h="100%"
              bg="#0a0a0a"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={3}
            >
              <audio ref={audioRef} src="/cashing.mp3" preload="auto" />
              <Box position="relative" textAlign="center">
                {/* Animated Grid Background */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  backgroundImage="linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)"
                  backgroundSize="40px 40px"
                  opacity={0.3}
                  sx={{
                    animation: "gridMove 20s linear infinite",
                    "@keyframes gridMove": {
                      "0%": { transform: "translate(0, 0)" },
                      "100%": { transform: "translate(40px, 40px)" },
                    },
                  }}
                />

                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0 }}
                >
                  {/* Decorative Lines */}
                  <Box mb={8} display="flex" alignItems="center" justifyContent="center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "80px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ display: "flex" }}
                    >
                      <Box h="1px" bg="#888888" w="100%" />
                    </motion.div>
                    <Box
                      w="12px"
                      h="12px"
                      border="1px solid #888888"
                      transform="rotate(45deg)"
                      position="relative"
                      mx={1}
                      flexShrink={0}
                    >
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="6px"
                        h="6px"
                        bg="#888888"
                      />
                    </Box>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "80px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ display: "flex" }}
                    >
                      <Box h="1px" bg="#888888" w="100%" />
                    </motion.div>
                  </Box>

                  {/* Name with Glitch Effect */}
                  <Box mb={4}>
                    <Text
                      color="#e0e0e0"
                      fontSize={[28, 32, 36]}
                      fontWeight="300"
                      letterSpacing="4px"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      sx={{
                        animation: "glitch 3s infinite",
                        "@keyframes glitch": {
                          "0%, 93%, 95%, 97%, 100%": { opacity: 1 },
                          "94%": { opacity: 0.7, transform: "translateX(2px)" },
                          "96%": { opacity: 0.8, transform: "translateX(-1px)" },
                        },
                      }}
                    >
                      {aboutData?.name || "John Michael T. Escarlan"}
                    </Text>
                  </Box>

                  {/* Subtitle */}
                  <Box mb={8}>
                    <Text
                      color="#888888"
                      fontSize={[11, 12]}
                      fontWeight="300"
                      letterSpacing="2px"
                      textTransform="uppercase"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      mb={8}
                    >
                      Portfolio
                    </Text>
                  </Box>

                  {/* Progress Bar */}
                  <Box w="200px" mx="auto" mb={6}>
                    <Box h="1px" bg="#333333" position="relative" overflow="hidden">
                      <motion.div
                        style={{
                          height: "100%",
                          background: "#e0e0e0",
                          width: `${Math.min(loadingProgress, 100)}%`,
                          transition: "width 0.1s linear",
                        }}
                      />
                    </Box>
                    <Text
                      fontSize="10px"
                      color="#666666"
                      mt={2}
                      letterSpacing="2px"
                      fontFamily="monospace"
                    >
                      {Math.round(Math.min(loadingProgress, 100))}%
                    </Text>
                  </Box>

                  {/* Loading Dots */}
                  <Flex justifyContent="center" gap={2}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        <Box w="6px" h="6px" bg="#888888" borderRadius="50%" />
                      </motion.div>
                    ))}
                  </Flex>

                  {/* Scanline overlay */}
                  <Box
                    position="fixed"
                    top={0}
                    left={0}
                    w="100%"
                    h="100vh"
                    pointerEvents="none"
                    opacity={0.03}
                    sx={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
                    }}
                  />

                  {/* Bottom Decorative Line */}
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
                    style={{ transformOrigin: "center" }}
                  >
                    <Box
                      mt={8}
                      mx="auto"
                      w="120px"
                      h="1px"
                      bg="linear-gradient(to right, transparent, #888888, transparent)"
                    />
                  </motion.div>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN PORTFOLIO CONTENT ═══ */}
      {!showIntro && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Scroll progress bar */}
          <ScrollProgressBar />

          <Box bg="#0a0a0a" minH="100vh" color="#e0e0e0" overflowX="hidden">
            {/* ─── Fluid Morphing Navigation ──────────────────── */}
            <FluidNavbar
              activeSection={activeSection}
              navLinkProps={navLinkProps}
              onOpen={onOpen}
              router={router}
            >

                {/* Mobile Menu Drawer */}
                <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                  <DrawerOverlay bg="blackAlpha.800" />
                  <DrawerContent bg="#141414" color="#e0e0e0" borderLeft="1px solid #333333">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px" borderColor="#333333" fontWeight="300" letterSpacing="2px">MENU</DrawerHeader>
                    <DrawerBody py={8}>
                      <VStack spacing={8} align="start">
                        {[
                          { label: "ABOUT", id: "about-section" },
                          { label: "WORK", id: "projects-section" },
                          { label: "CONTENT", id: "content-gen-section" },
                          { label: "CONTACT", id: "contact-section" },
                        ].map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Button
                              variant="link"
                              color={activeSection === item.id ? "#e0e0e0" : "#888888"}
                              fontSize="18px"
                              fontWeight="300"
                              letterSpacing="1px"
                              onClick={() => {
                                onClose();
                                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              {item.label}
                            </Button>
                          </motion.div>
                        ))}
                      </VStack>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
            </FluidNavbar>

            {/* ─── Hero Section ───────────────────────────────── */}
            <Box
              minH="100vh"
              display="flex"
              alignItems="center"
              maxW="1200px"
              mx="auto"
              px={[4, 6, 8, 12]}
              py={16}
              position="relative"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                w="100%"
                gap={[10, 12, 16]}
                position="relative"
              >
                {/* ── Decorative background numerals ──────────── */}
                <Box
                  position="absolute"
                  top={["-40px", "-60px", "-80px"]}
                  left={["-20px", "-30px", "-40px"]}
                  fontSize={["140px", "200px", "280px"]}
                  fontWeight="700"
                  lineHeight="1"
                  color="transparent"
                  letterSpacing="-10px"
                  pointerEvents="none"
                  zIndex={0}
                  sx={{
                    WebkitTextStroke: "1px #1a1a1a",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                  display={{ base: "none", md: "block" }}
                >
                  00
                </Box>

                {/* ── Profile portrait card ─────────────────────── */}
                <MotionBox
                  flex="0 0 auto"
                  order={{ base: 0, md: 2 }}
                  mb={{ base: 0, md: 0 }}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  position="relative"
                  zIndex={1}
                >
                  <Box
                    position="relative"
                    w={["260px", "300px", "360px", "430px"]}
                    role="group"
                  >
                    {/* Top metadata strip */}
                    <Flex
                      justify="space-between"
                      align="center"
                      mb={3}
                      fontFamily="monospace"
                      fontSize="10px"
                      color="#666666"
                      letterSpacing="2px"
                    >
                      <Text>ID / 001</Text>
                      <Text>PORTFOLIO · {new Date().getFullYear()}</Text>
                    </Flex>

                    {/* Image with framed border + corner brackets */}
                    <Box position="relative">
                      {/* Corner brackets */}
                      {[
                        { top: "-6px", left: "-6px", borderTop: "1px solid #444", borderLeft: "1px solid #444" },
                        { top: "-6px", right: "-6px", borderTop: "1px solid #444", borderRight: "1px solid #444" },
                        { bottom: "-6px", left: "-6px", borderBottom: "1px solid #444", borderLeft: "1px solid #444" },
                        { bottom: "-6px", right: "-6px", borderBottom: "1px solid #444", borderRight: "1px solid #444" },
                      ].map((pos, i) => (
                        <Box
                          key={i}
                          position="absolute"
                          w="14px"
                          h="14px"
                          pointerEvents="none"
                          transition="border-color 0.4s ease"
                          {...pos}
                          _groupHover={{ borderColor: "#888888" }}
                        />
                      ))}

                      <Box
                        position="relative"
                        overflow="hidden"
                        bg="#0d0d0d"
                        border="1px solid #1f1f1f"
                        aspectRatio="3 / 4"
                        boxShadow="0 30px 70px -20px rgba(0,0,0,0.7)"
                        transition="all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
                        _groupHover={{
                          borderColor: "#333333",
                          transform: "translateY(-6px)",
                          boxShadow: "0 50px 100px -25px rgba(0,0,0,0.85)",
                        }}
                      >
                        <Box
                          as="img"
                          src={aboutData?.profileImage || "/profile2.png"}
                          alt={aboutData?.name || "Profile"}
                          position="absolute"
                          inset={0}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                          filter="grayscale(100%) brightness(0.92) contrast(1.05)"
                          transition="filter 0.7s ease, transform 0.7s ease"
                          _groupHover={{ filter: "grayscale(0%) brightness(1) contrast(1)", transform: "scale(1.03)" }}
                        />

                        {/* Subtle grid overlay */}
                        <Box
                          position="absolute"
                          inset={0}
                          pointerEvents="none"
                          opacity={0.25}
                          backgroundImage="linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)"
                          backgroundSize="40px 40px"
                        />

                        {/* Bottom gradient + caption */}
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          right={0}
                          h="45%"
                          pointerEvents="none"
                          background="linear-gradient(to top, rgba(10,10,10,0.85), transparent)"
                        />
                        <Flex
                          position="absolute"
                          bottom={3}
                          left={3}
                          right={3}
                          justify="space-between"
                          align="end"
                          pointerEvents="none"
                        >
                          <Box>
                            <Text
                              fontSize="9px"
                              color="#666666"
                              letterSpacing="2px"
                              textTransform="uppercase"
                              fontFamily="monospace"
                              mb={0.5}
                            >
                              Subject
                            </Text>
                            <Text
                              fontSize="11px"
                              color="#e0e0e0"
                              letterSpacing="1px"
                              textTransform="uppercase"
                              fontWeight="500"
                            >
                              {(aboutData?.name || "J. Escarlan").split(" ").slice(-1)[0]}
                            </Text>
                          </Box>
                          <Text
                            fontSize="9px"
                            color="#555555"
                            fontFamily="monospace"
                            letterSpacing="2px"
                          >
                            03:24
                          </Text>
                        </Flex>
                      </Box>
                    </Box>

                    {/* Bottom info strip */}
                    <Flex
                      justify="space-between"
                      align="center"
                      mt={3}
                      fontFamily="monospace"
                      fontSize="10px"
                      color="#555555"
                      letterSpacing="2px"
                    >
                      <Text>· FRAME 1 / 1</Text>
                      <Text>RAW</Text>
                    </Flex>
                  </Box>
                </MotionBox>

                {/* ── Text block ────────────────────────────────── */}
                <Box
                  flex="1"
                  maxW="640px"
                  order={{ base: 1, md: 0 }}
                  textAlign={{ base: "center", md: "left" }}
                  position="relative"
                  zIndex={1}
                >
                  {/* Available status row */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <HStack
                      spacing={3}
                      mb={6}
                      justify={{ base: "center", md: "flex-start" }}
                      divider={<Box w="20px" h="1px" bg="#333333" />}
                    >
                      <HStack spacing={2}>
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="50%"
                          bg="#e0e0e0"
                          sx={{
                            animation: "heroPulse 2s ease-in-out infinite",
                            "@keyframes heroPulse": {
                              "0%, 100%": { opacity: 1, boxShadow: "0 0 0 0 rgba(224,224,224,0.5)" },
                              "50%": { opacity: 0.5, boxShadow: "0 0 0 6px rgba(224,224,224,0)" },
                            },
                          }}
                        />
                        <Text
                          fontSize="11px"
                          color="#888888"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontWeight="500"
                        >
                          Available for Work
                        </Text>
                      </HStack>
                      <Text
                        fontSize="11px"
                        color="#666666"
                        letterSpacing="2px"
                        fontFamily="monospace"
                        display={{ base: "none", sm: "block" }}
                      >
                        {contactData?.location?.toUpperCase() || "CEBU · PH"}
                      </Text>
                    </HStack>
                  </motion.div>

                  {/* Eyebrow */}
                  <MotionText
                    fontSize="11px"
                    color="#666666"
                    letterSpacing="4px"
                    textTransform="uppercase"
                    fontWeight="500"
                    mb={3}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    — Portfolio · Hello, I&apos;m
                  </MotionText>

                  {/* Name */}
                  <MotionHeading
                    as="h1"
                    fontSize={[44, 56, 68, 84]}
                    fontWeight="700"
                    color="#e0e0e0"
                    mb={5}
                    letterSpacing="-3px"
                    lineHeight="0.95"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Shuffle
                      text={aboutData?.name || "John Michael T. Escarlan"}
                      tag="span"
                      textAlign="inherit"
                      shuffleDirection="right"
                      duration={0.35}
                      animationMode="evenodd"
                      shuffleTimes={1}
                      ease="power3.out"
                      stagger={0.03}
                      threshold={0.1}
                      triggerOnce
                      triggerOnHover
                      respectReducedMotion
                      loop={false}
                      loopDelay={0}
                      className="hero-name-shuffle"
                      style={{ display: "inline-block", color: "inherit" }}
                    />
                  </MotionHeading>

                  {/* Role with divider */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <HStack
                      spacing={3}
                      mb={5}
                      justify={{ base: "center", md: "flex-start" }}
                      align="center"
                    >
                      <Box w="40px" h="1px" bg="#444444" />
                      <Text
                        fontSize={[14, 15, 16]}
                        fontWeight="500"
                        color="#e0e0e0"
                        letterSpacing="2px"
                        textTransform="uppercase"
                      >
                        {aboutData?.currentJobTitle || "Web Developer"}
                      </Text>
                    </HStack>
                  </motion.div>

                  {/* Tagline */}
                  <MotionText
                    fontSize={[16, 18, 20]}
                    fontWeight="300"
                    color="#999999"
                    mb={10}
                    letterSpacing="0.2px"
                    lineHeight="1.6"
                    maxW="520px"
                    mx={{ base: "auto", md: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {aboutData?.tagline || "Building thoughtful digital experiences"}
                  </MotionText>

                  {/* Social row — labeled link buttons */}
                  <HStack
                    spacing={0}
                    flexWrap="wrap"
                    justify={{ base: "center", md: "flex-start" }}
                    divider={<Box w="1px" h="14px" bg="#2a2a2a" mx={4} />}
                  >
                    {[
                      { icon: FaGithub, label: "GitHub", link: aboutData?.githubLink, show: !!aboutData?.githubLink },
                      { icon: FaLinkedin, label: "LinkedIn", link: aboutData?.linkedinLink, show: !!aboutData?.linkedinLink },
                      { label: "Portfolio", link: aboutData?.portfolioLink, show: !!aboutData?.portfolioLink, isWeb: true },
                      { label: "Email", link: contactData?.email ? `mailto:${contactData.email}` : null, show: !!contactData?.email, isMail: true },
                    ].filter(s => s.show).map((social, i) => {
                      const Icon = social.icon;
                      return (
                        <motion.div
                          key={social.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                        >
                          <Box
                            as="button"
                            display="inline-flex"
                            alignItems="center"
                            gap={2}
                            color="#888888"
                            fontSize="12px"
                            fontWeight="500"
                            letterSpacing="2px"
                            textTransform="uppercase"
                            py={2}
                            position="relative"
                            role="group"
                            transition="color 0.3s"
                            _hover={{ color: "#e0e0e0" }}
                            sx={{
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 0,
                                left: "50%",
                                right: "50%",
                                height: "1px",
                                bg: "#e0e0e0",
                                transition: "all 0.3s ease",
                              },
                              "&:hover::after": { left: 0, right: 0 },
                            }}
                            onClick={() => {
                              if (social.isMail) {
                                window.location.href = social.link;
                              } else {
                                window.open(ensureAbsoluteUrl(social.link), "_blank");
                              }
                            }}
                          >
                            {Icon && <Icon size={13} />}
                            <span>{social.label}</span>
                            <Box
                              as="span"
                              transition="transform 0.3s ease"
                              _groupHover={{ transform: "translateX(3px)" }}
                            >
                              →
                            </Box>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </HStack>
                </Box>
              </Flex>

              {/* ── Scroll cue ───────────────────────────────────── */}
              <MotionBox
                position="absolute"
                bottom={[6, 8, 10]}
                left="50%"
                transform="translateX(-50%)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                pointerEvents="none"
                display={{ base: "none", md: "block" }}
              >
                <VStack spacing={2}>
                  <Text
                    fontSize="10px"
                    color="#666666"
                    letterSpacing="4px"
                    textTransform="uppercase"
                    fontWeight="500"
                  >
                    Scroll
                  </Text>
                  <Box
                    w="1px"
                    h="36px"
                    bg="linear-gradient(to bottom, #444444, transparent)"
                    sx={{
                      animation: "scrollLine 2s ease-in-out infinite",
                      "@keyframes scrollLine": {
                        "0%, 100%": { transform: "scaleY(1)", opacity: 0.6, transformOrigin: "top" },
                        "50%": { transform: "scaleY(1.4)", opacity: 1, transformOrigin: "top" },
                      },
                    }}
                  />
                </VStack>
              </MotionBox>
            </Box>

            {/* ─── Main Content ───────────────────────────────── */}
            <Box maxW="1200px" mx="auto" px={[4, 6, 8]} py={[8, 12, 16]}>

              <AnimatedDivider />

              {/* ═══ ABOUT SECTION ═══ */}
              <ParallaxSection mb={[12, 16, 20]} offset={30}>
                <SectionHeading id="about-section" subtitle="My Professional Journey and Expertise">
                  About Me
                </SectionHeading>

                {/* ── Editorial About Layout ────────────────────── */}
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  gap={[8, 10, 14]}
                  mb={[10, 12, 16]}
                  align="stretch"
                >
                  {/* ── Left: Bio narrative ─────────────────────── */}
                  <MotionBox
                    flex={{ base: "1", lg: "0 0 58%" }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    position="relative"
                  >
                    {/* Section eyebrow */}
                    <HStack
                      spacing={3}
                      mb={5}
                      divider={<Box w="20px" h="1px" bg="#333333" />}
                    >
                      <Text
                        fontSize="11px"
                        color="#888888"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontWeight="500"
                      >
                        Profile
                      </Text>
                      <Text
                        fontSize="11px"
                        color="#666666"
                        letterSpacing="2px"
                        fontFamily="monospace"
                      >
                        / 01
                      </Text>
                    </HStack>

                    {/* Pull-quote intro */}
                    <Text
                      fontSize={[22, 26, 30]}
                      fontWeight="300"
                      color="#e0e0e0"
                      lineHeight="1.35"
                      letterSpacing="-0.5px"
                      mb={6}
                    >
                      <Text as="span" color="#444444" fontSize={[36, 44, 52]} fontWeight="600" lineHeight="0" verticalAlign="-0.4em" mr={2}>
                        “
                      </Text>
                      {aboutData?.tagline || "Building thoughtful digital experiences that balance form, function, and craft."}
                    </Text>

                    {/* Description body with left rail */}
                    <Box
                      position="relative"
                      pl={5}
                      borderLeft="1px solid #2a2a2a"
                      mb={8}
                    >
                      <Text
                        color="#999999"
                        fontSize={[14, 15, 16]}
                        fontWeight="300"
                        lineHeight="1.8"
                      >
                        {aboutData?.description ||
                          "Passionate about building reliable, efficient, and user-friendly systems. Skilled in solving technical challenges, improving processes, and delivering high-quality solutions."}
                      </Text>
                    </Box>

                    {/* Languages chips */}
                    {aboutData?.languages?.length > 0 && (
                      <Box>
                        <Text
                          fontSize="10px"
                          color="#666666"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontWeight="500"
                          mb={3}
                        >
                          Languages
                        </Text>
                        <HStack
                          spacing={0}
                          flexWrap="wrap"
                          divider={<Box w="1px" h="10px" bg="#2a2a2a" mx={3} />}
                        >
                          {aboutData.languages.map((lang, idx) => (
                            <Text
                              key={idx}
                              fontSize={[12, 13]}
                              color="#888888"
                              fontWeight="400"
                              letterSpacing="0.5px"
                              _hover={{ color: "#e0e0e0" }}
                              transition="color 0.3s"
                              cursor="default"
                            >
                              {lang}
                            </Text>
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </MotionBox>

                  {/* ── Right: Status + stats column ────────────── */}
                  <VStack
                    flex="1"
                    spacing={5}
                    align="stretch"
                  >
                    {/* Currently working — featured card */}
                    <MotionBox
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      position="relative"
                      bg="#0d0d0d"
                      border="1px solid #1f1f1f"
                      p={6}
                      overflow="hidden"
                      role="group"
                      _hover={{ borderColor: "#333333" }}
                      transition_chakra="border-color 0.3s"
                    >
                      {/* Live dot */}
                      <HStack spacing={2} mb={4}>
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="50%"
                          bg="#e0e0e0"
                          sx={{
                            animation: "livePulse 2s ease-in-out infinite",
                            "@keyframes livePulse": {
                              "0%, 100%": { opacity: 1, boxShadow: "0 0 0 0 rgba(224,224,224,0.5)" },
                              "50%": { opacity: 0.5, boxShadow: "0 0 0 6px rgba(224,224,224,0)" },
                            },
                          }}
                        />
                        <Text
                          fontSize="10px"
                          color="#888888"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontWeight="500"
                        >
                          Currently
                        </Text>
                      </HStack>
                      <Text
                        fontSize={[18, 20, 22]}
                        fontWeight="600"
                        color="#e0e0e0"
                        letterSpacing="-0.5px"
                        lineHeight="1.2"
                        mb={1}
                      >
                        {aboutData?.currentJobTitle || "Software Developer"}
                      </Text>
                      <Text
                        fontSize={[13, 14]}
                        color="#888888"
                        fontWeight="400"
                      >
                        @ {aboutData?.currentCompany || "Independent"}
                      </Text>

                      {/* Diagonal corner accent */}
                      <Box
                        position="absolute"
                        top={0}
                        right={0}
                        w="60px"
                        h="60px"
                        pointerEvents="none"
                        sx={{
                          background: "linear-gradient(135deg, transparent 50%, #1a1a1a 50%)",
                          transition: "background 0.3s",
                        }}
                        _groupHover={{
                          sx: { background: "linear-gradient(135deg, transparent 50%, #2a2a2a 50%)" },
                        }}
                      />
                    </MotionBox>

                    {/* Education — minimal row */}
                    <MotionBox
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      bg="#0d0d0d"
                      border="1px solid #1f1f1f"
                      p={6}
                      _hover={{ borderColor: "#333333" }}
                      transition_chakra="border-color 0.3s"
                    >
                      <Text
                        fontSize="10px"
                        color="#666666"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontWeight="500"
                        mb={3}
                      >
                        Education
                      </Text>
                      <Text
                        fontSize={[15, 16]}
                        fontWeight="500"
                        color="#e0e0e0"
                        letterSpacing="-0.2px"
                        lineHeight="1.4"
                        mb={1}
                      >
                        {aboutData?.education || "Bachelor of Science in Information Technology"}
                      </Text>
                      <Text fontSize="11px" color="#555555" letterSpacing="1px" textTransform="uppercase">
                        Graduated
                      </Text>
                    </MotionBox>

                    {/* Stat trio */}
                    <MotionBox
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <SimpleGrid columns={3} spacing={0} border="1px solid #1f1f1f">
                        {[
                          { value: projects.length || 0, label: "Projects" },
                          { value: skills.length || 0, label: "Stack" },
                          { label: "God is good all the time" },
                        ].map((stat, idx) => (
                          <Box
                            key={stat.label}
                            p={4}
                            textAlign="center"
                            borderLeft={idx === 0 ? "none" : "1px solid #1f1f1f"}
                            transition="background 0.3s"
                            _hover={{ bg: "#0d0d0d" }}
                            cursor="default"
                          >
                            <Text
                              fontSize={[22, 26, 28]}
                              fontWeight="700"
                              color="#e0e0e0"
                              letterSpacing="-1px"
                              lineHeight="1"
                              mb={1}
                            >
                              {stat.value}
                            </Text>
                            <Text
                              fontSize="9px"
                              color="#666666"
                              letterSpacing="2px"
                              textTransform="uppercase"
                              fontWeight="500"
                            >
                              {stat.label}
                            </Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </MotionBox>
                  </VStack>
                </Flex>

                {/* Tech Stack */}
                <Text
                  fontSize={[13, 14]}
                  fontWeight="400"
                  color="#888888"
                  mb={4}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Tech Stack
                </Text>
                <Box
                  overflow="hidden"
                  position="relative"
                  w="100%"
                  mb={4}
                  py={3}
                  onMouseEnter={() => setMarqueePaused(true)}
                  onMouseLeave={() => setMarqueePaused(false)}
                >
                  <Box
                    display="flex"
                    className="infinite-slide"
                    sx={{
                      animationPlayState: marquePaused ? "paused" : "running",
                    }}
                  >
                    {[...skills, ...skills].map((tech, idx) => (
                      <Box
                        key={`${tech._id || idx}-${idx}`}
                        minW="100px"
                        h="100px"
                        border="1px solid #333333"
                        borderRadius="0"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        bg="#141414"
                        mx={2}
                        px={3}
                        py={3}
                        _hover={{ borderColor: "#555555", bg: "#1a1a1a", transform: "scale(1.08)" }}
                        transition="all 0.3s"
                      >
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "contain",
                            filter: "grayscale(100%) invert(1)",
                            marginBottom: "8px",
                          }}
                        />
                        <Text
                          fontSize="10px"
                          color="#888888"
                          textAlign="center"
                          fontWeight="300"
                          noOfLines={2}
                        >
                          {tech.name}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </ParallaxSection>

              <AnimatedDivider />

              {/* ═══ FEATURED PROJECTS ═══ */}
              <ParallaxSection mb={[12, 16, 20]} offset={50}>
                <SectionHeading id="projects-section" subtitle="What Did I Do?">
                  Featured Projects
                </SectionHeading>

                <VStack spacing={[20, 28, 36]} align="stretch">
                  {projects.slice(0, 5).map((project, index) => {
                    const isEven = index % 2 === 0;
                    const dateLabel = project.projectDate
                      ? isNaN(Date.parse(project.projectDate))
                        ? project.projectDate.toUpperCase()
                        : new Date(project.projectDate).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          }).toUpperCase()
                      : new Date(project.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        }).toUpperCase();

                    return (
                      <MotionBox
                        key={project._id || index}
                        position="relative"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        role="group"
                      >
                        {/* Giant ghost number index */}
                        <Box
                          position="absolute"
                          top={["-30px", "-50px", "-70px"]}
                          left={isEven ? ["-10px", "-20px", "-30px"] : "auto"}
                          right={isEven ? "auto" : ["-10px", "-20px", "-30px"]}
                          fontSize={["120px", "180px", "240px"]}
                          fontWeight="700"
                          lineHeight="1"
                          color="transparent"
                          letterSpacing="-8px"
                          pointerEvents="none"
                          zIndex={0}
                          sx={{
                            WebkitTextStroke: "1px #1a1a1a",
                            fontFamily: "system-ui, -apple-system, sans-serif",
                            transition: "color 0.6s ease, -webkit-text-stroke-color 0.6s ease",
                          }}
                          _groupHover={{
                            sx: {
                              WebkitTextStroke: "1px #2a2a2a",
                            },
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </Box>

                        <Flex
                          direction={{
                            base: "column",
                            md: isEven ? "row" : "row-reverse",
                          }}
                          gap={[8, 10, 14]}
                          align="center"
                          position="relative"
                          zIndex={1}
                        >
                          {/* ── Project Image Card ─────────────────────── */}
                          <Box
                            flex={{ base: "1", md: "0 0 55%" }}
                            w="100%"
                            position="relative"
                          >
                            <MotionBox
                              position="relative"
                              overflow="hidden"
                              borderRadius="2px"
                              border="1px solid #1f1f1f"
                              bg="#0d0d0d"
                              aspectRatio="16 / 11"
                              boxShadow="0 30px 60px -20px rgba(0,0,0,0.6)"
                              transition_chakra="all 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
                              _groupHover={{
                                borderColor: "#333333",
                                transform: "translateY(-8px)",
                                boxShadow: "0 50px 90px -25px rgba(0,0,0,0.75)",
                              }}
                              whileHover={{}}
                            >
                              {/* Image */}
                              <Box
                                as="img"
                                src={project.img}
                                alt={project.title}
                                position="absolute"
                                inset={0}
                                w="100%"
                                h="100%"
                                objectFit="contain"
                                p={[6, 8, 10]}
                                filter="grayscale(100%) brightness(0.85)"
                                transition="filter 0.7s ease, transform 0.7s ease"
                                _groupHover={{
                                  filter: "grayscale(0%) brightness(1)",
                                  transform: "scale(1.04)",
                                }}
                              />

                              {/* Subtle grid overlay */}
                              <Box
                                position="absolute"
                                inset={0}
                                pointerEvents="none"
                                opacity={0.4}
                                backgroundImage="linear-gradient(#141414 1px, transparent 1px), linear-gradient(90deg, #141414 1px, transparent 1px)"
                                backgroundSize="40px 40px"
                              />

                              {/* Bottom gradient + corner index */}
                              <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                h="40%"
                                pointerEvents="none"
                                background="linear-gradient(to top, rgba(10,10,10,0.85), transparent)"
                              />

                              {/* Top-left tag */}
                              <Box
                                position="absolute"
                                top={3}
                                left={3}
                                px={2.5}
                                py={1}
                                bg="rgba(10,10,10,0.7)"
                                backdropFilter="blur(8px)"
                                border="1px solid #2a2a2a"
                              >
                                <Text
                                  fontSize="10px"
                                  color="#888888"
                                  letterSpacing="2px"
                                  textTransform="uppercase"
                                  fontWeight="500"
                                >
                                  {project.type || "Project"}
                                </Text>
                              </Box>

                              {/* Corner number */}
                              <Text
                                position="absolute"
                                top={3}
                                right={4}
                                fontSize="11px"
                                color="#555555"
                                letterSpacing="3px"
                                fontWeight="400"
                                fontFamily="monospace"
                              >
                                / {String(index + 1).padStart(2, "0")}
                              </Text>
                            </MotionBox>

                            {/* Tech chips under image */}
                            {project.technologies?.length > 0 && (
                              <HStack
                                spacing={0}
                                mt={4}
                                flexWrap="wrap"
                                divider={
                                  <Box w="1px" h="10px" bg="#2a2a2a" mx={3} />
                                }
                              >
                                {project.technologies.slice(0, 6).map((tech, idx) => (
                                  <MotionBox
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                                  >
                                    <Text
                                      fontSize={[10, 11]}
                                      color="#666666"
                                      fontWeight="400"
                                      letterSpacing="1px"
                                      textTransform="uppercase"
                                      _hover={{ color: "#e0e0e0" }}
                                      transition="color 0.3s"
                                      cursor="default"
                                    >
                                      {tech}
                                    </Text>
                                  </MotionBox>
                                ))}
                              </HStack>
                            )}
                          </Box>

                          {/* ── Project Content ────────────────────────── */}
                          <Box flex="1" w="100%">
                            {/* Meta row */}
                            <HStack
                              spacing={3}
                              mb={4}
                              divider={<Box w="20px" h="1px" bg="#333333" />}
                            >
                              <Text
                                fontSize="11px"
                                color="#888888"
                                letterSpacing="3px"
                                textTransform="uppercase"
                                fontWeight="500"
                              >
                                Featured
                              </Text>
                              <Text
                                fontSize="11px"
                                color="#666666"
                                letterSpacing="2px"
                                fontFamily="monospace"
                              >
                                {dateLabel}
                              </Text>
                            </HStack>

                            {/* Title */}
                            <MotionHeading
                              as="h3"
                              fontSize={[28, 34, 42]}
                              fontWeight="700"
                              color="#e0e0e0"
                              letterSpacing="-1.5px"
                              lineHeight="1.05"
                              mb={5}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            >
                              {project.title}
                            </MotionHeading>

                            {/* Description with side-bar */}
                            <Box
                              position="relative"
                              pl={5}
                              mb={6}
                              borderLeft="1px solid #2a2a2a"
                              transition="border-color 0.4s"
                              _groupHover={{ borderColor: "#444444" }}
                            >
                              <VStack align="start" spacing={3}>
                                {project.description?.split("\n").map((line, idx) => (
                                  <Text
                                    key={idx}
                                    fontSize={[14, 15, 16]}
                                    lineHeight="1.7"
                                    color="#999999"
                                    fontWeight="300"
                                  >
                                    {line.trim()}
                                  </Text>
                                ))}
                              </VStack>
                            </Box>

                            {/* CTAs with arrow slide */}
                            <HStack spacing={6}>
                              <Box
                                as="button"
                                onClick={() => window.open(ensureAbsoluteUrl(project.github), "_blank")}
                                position="relative"
                                role="group"
                                display="inline-flex"
                                alignItems="center"
                                gap={3}
                                color="#888888"
                                fontSize={[12, 13]}
                                fontWeight="500"
                                letterSpacing="2px"
                                textTransform="uppercase"
                                py={2}
                                borderBottom="1px solid #2a2a2a"
                                transition="all 0.3s"
                                _hover={{ color: "#e0e0e0", borderColor: "#e0e0e0" }}
                              >
                                <span>View Code</span>
                                <Box
                                  as="span"
                                  display="inline-block"
                                  transition="transform 0.3s ease"
                                  _groupHover={{ transform: "translateX(6px)" }}
                                >
                                  →
                                </Box>
                              </Box>

                              {project.website && (
                                <Box
                                  as="button"
                                  onClick={() => window.open(ensureAbsoluteUrl(project.website), "_blank")}
                                  position="relative"
                                  role="group"
                                  display="inline-flex"
                                  alignItems="center"
                                  gap={3}
                                  color="#e0e0e0"
                                  fontSize={[12, 13]}
                                  fontWeight="500"
                                  letterSpacing="2px"
                                  textTransform="uppercase"
                                  py={2}
                                  borderBottom="1px solid #e0e0e0"
                                  transition="all 0.3s"
                                  _hover={{ color: "#ffffff" }}
                                >
                                  <span>Live Preview</span>
                                  <Box
                                    as="span"
                                    display="inline-block"
                                    transition="transform 0.3s ease"
                                    _groupHover={{ transform: "translate(6px, -2px) rotate(-45deg)" }}
                                  >
                                    →
                                  </Box>
                                </Box>
                              )}
                            </HStack>
                          </Box>
                        </Flex>
                      </MotionBox>
                    );
                  })}
                </VStack>
              </ParallaxSection>

              <AnimatedDivider />

              {/* ═══ KEY MILESTONES ═══ */}
              <ParallaxSection id="milestones-section" mb={[12, 16, 20]} offset={25}>
                <Box position="relative">
                  {/* Ghost numeral */}
                  <Box
                    position="absolute"
                    top={["-30px", "-50px", "-70px"]}
                    right={["-10px", "-20px", "-30px"]}
                    fontSize={["120px", "180px", "240px"]}
                    fontWeight="700"
                    lineHeight="1"
                    color="transparent"
                    letterSpacing="-8px"
                    pointerEvents="none"
                    zIndex={0}
                    sx={{
                      WebkitTextStroke: "1px #1a1a1a",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    display={{ base: "none", md: "block" }}
                  >
                    02
                  </Box>

                  {/* Editorial header */}
                  <Box mb={[8, 10, 12]} position="relative" zIndex={1} maxW="640px">
                    <HStack
                      spacing={3}
                      mb={5}
                      divider={<Box w="20px" h="1px" bg="#333333" />}
                    >
                      <Text
                        fontSize="11px"
                        color="#888888"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontWeight="500"
                      >
                        Milestones
                      </Text>
                      <Text
                        fontSize="11px"
                        color="#666666"
                        letterSpacing="2px"
                        fontFamily="monospace"
                      >
                        / 02
                      </Text>
                    </HStack>

                    <Heading
                      as="h2"
                      fontSize={[36, 48, 60]}
                      fontWeight="700"
                      color="#e0e0e0"
                      letterSpacing="-2px"
                      lineHeight="0.95"
                      mb={5}
                    >
                      A short
                      <Text as="span" color="#555555" fontWeight="300" fontStyle="italic">
                        {" "}timeline
                      </Text>
                    </Heading>

                    <Box position="relative" pl={5} borderLeft="1px solid #2a2a2a" maxW="520px">
                      <Text
                        fontSize={[14, 15, 16]}
                        color="#999999"
                        fontWeight="300"
                        lineHeight="1.7"
                      >
                        Years that mattered — milestones, transitions, and moments that
                        shaped how I work today.
                      </Text>
                    </Box>
                  </Box>

                  {/* Horizontal timeline strip */}
                  <Box position="relative" zIndex={1}>
                    {/* Decorative continuous baseline */}
                    <Box
                      display={{ base: "none", md: "block" }}
                      position="absolute"
                      left={0}
                      right={0}
                      top="40px"
                      h="1px"
                      bg="#1f1f1f"
                      pointerEvents="none"
                    />

                    <Flex
                      gap={[4, 6]}
                      overflowX="auto"
                      pb={6}
                      sx={{
                        scrollSnapType: "x mandatory",
                        "&::-webkit-scrollbar": { height: "2px" },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: "#2a2a2a" },
                      }}
                    >
                      {years.map((y, i) => (
                        <MotionBox
                          key={y._id}
                          minW={["220px", "260px", "280px"]}
                          flexShrink={0}
                          position="relative"
                          sx={{ scrollSnapAlign: "start" }}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.08 }}
                          role="group"
                        >
                          {/* Top connector dot on timeline */}
                          <Flex
                            display={{ base: "none", md: "flex" }}
                            position="absolute"
                            top="34px"
                            left="50%"
                            transform="translateX(-50%)"
                            w="14px"
                            h="14px"
                            align="center"
                            justify="center"
                            zIndex={2}
                            pointerEvents="none"
                          >
                            <Box
                              w="14px"
                              h="14px"
                              borderRadius="50%"
                              bg="#0a0a0a"
                              border="1px solid #333333"
                              transition="all 0.3s"
                              _groupHover={{
                                borderColor: "#e0e0e0",
                                w: "16px",
                                h: "16px",
                                boxShadow: "0 0 0 4px rgba(224,224,224,0.05)",
                              }}
                            />
                          </Flex>

                          {/* Index label */}
                          <Text
                            fontSize="9px"
                            color="#555555"
                            fontFamily="monospace"
                            letterSpacing="3px"
                            mb={3}
                            textAlign="center"
                          >
                            #{String(i + 1).padStart(2, "0")}
                          </Text>

                          {/* Spacer so card sits below the baseline */}
                          <Box display={{ base: "none", md: "block" }} h="40px" />

                          <Box
                            bg="#0d0d0d"
                            border="1px solid #1f1f1f"
                            p={5}
                            position="relative"
                            overflow="hidden"
                            transition="all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                            _groupHover={{
                              borderColor: "#333333",
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                            }}
                          >
                            <Box mb={3}>
                              <AnimatedYear year={y.year} />
                            </Box>
                            <Box
                              w="24px"
                              h="1px"
                              bg="#2a2a2a"
                              mb={3}
                              transition="all 0.4s"
                              _groupHover={{ w: "48px", bg: "#555555" }}
                            />
                            <Text
                              fontSize="13px"
                              color="#999999"
                              fontWeight="300"
                              lineHeight="1.6"
                            >
                              {y.label}
                            </Text>

                            {/* Corner accent */}
                            <Box
                              position="absolute"
                              top={0}
                              right={0}
                              w="40px"
                              h="40px"
                              pointerEvents="none"
                              sx={{
                                background: "linear-gradient(135deg, transparent 50%, #1a1a1a 50%)",
                                transition: "background 0.3s",
                              }}
                              _groupHover={{
                                sx: { background: "linear-gradient(135deg, transparent 50%, #2a2a2a 50%)" },
                              }}
                            />
                          </Box>
                        </MotionBox>
                      ))}
                    </Flex>

                    {/* Scroll hint */}
                    <Flex
                      align="center"
                      justify="center"
                      gap={3}
                      mt={2}
                      display={{ base: "flex", md: "none" }}
                    >
                      <Box w="20px" h="1px" bg="#2a2a2a" />
                      <Text
                        fontSize="10px"
                        color="#555555"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontFamily="monospace"
                      >
                        Swipe →
                      </Text>
                      <Box w="20px" h="1px" bg="#2a2a2a" />
                    </Flex>
                  </Box>
                </Box>
              </ParallaxSection>

              <AnimatedDivider />

              {/* ═══ WORK EXPERIENCE — Timeline ═══ */}
              <ParallaxSection id="experience-section" mb={[12, 16, 20]} offset={35}>
                <Box position="relative">
                  {/* Ghost numeral */}
                  <Box
                    position="absolute"
                    top={["-30px", "-50px", "-70px"]}
                    left={["-10px", "-20px", "-30px"]}
                    fontSize={["120px", "180px", "240px"]}
                    fontWeight="700"
                    lineHeight="1"
                    color="transparent"
                    letterSpacing="-8px"
                    pointerEvents="none"
                    zIndex={0}
                    sx={{
                      WebkitTextStroke: "1px #1a1a1a",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    display={{ base: "none", md: "block" }}
                  >
                    03
                  </Box>

                  {/* Editorial header */}
                  <Flex
                    direction={{ base: "column", lg: "row" }}
                    align={{ base: "stretch", lg: "end" }}
                    justify="space-between"
                    gap={[6, 8, 10]}
                    mb={[10, 12, 14]}
                    position="relative"
                    zIndex={1}
                  >
                    <Box maxW="640px" flex="1">
                      <HStack
                        spacing={3}
                        mb={5}
                        divider={<Box w="20px" h="1px" bg="#333333" />}
                      >
                        <Text
                          fontSize="11px"
                          color="#888888"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontWeight="500"
                        >
                          Experience
                        </Text>
                        <Text
                          fontSize="11px"
                          color="#666666"
                          letterSpacing="2px"
                          fontFamily="monospace"
                        >
                          / 03
                        </Text>
                      </HStack>

                      <Heading
                        as="h2"
                        fontSize={[36, 48, 60]}
                        fontWeight="700"
                        color="#e0e0e0"
                        letterSpacing="-2px"
                        lineHeight="0.95"
                        mb={5}
                      >
                        Where I&apos;ve
                        <Text as="span" color="#555555" fontWeight="300" fontStyle="italic">
                          {" "}worked
                        </Text>
                      </Heading>

                      <Box position="relative" pl={5} borderLeft="1px solid #2a2a2a" maxW="520px">
                        <Text
                          fontSize={[14, 15, 16]}
                          color="#999999"
                          fontWeight="300"
                          lineHeight="1.7"
                        >
                          A chronological record of the teams I&apos;ve been part of and the
                          systems I&apos;ve helped build.
                        </Text>
                      </Box>
                    </Box>

                    {/* Counter */}
                    <Box
                      flex="0 0 auto"
                      border="1px solid #1f1f1f"
                      px={6}
                      py={4}
                      minW="180px"
                    >
                      <Text
                        fontSize="9px"
                        color="#666666"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontWeight="500"
                        mb={1}
                      >
                        Total Roles
                      </Text>
                      <Text
                        fontSize={[26, 30, 34]}
                        fontWeight="700"
                        color="#e0e0e0"
                        letterSpacing="-1px"
                        lineHeight="1"
                      >
                        {String(workExperiences.length).padStart(2, "0")}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Timeline body */}
                  <Box position="relative" zIndex={1} pl={[6, 8, 10]}>
                    {/* Vertical rail */}
                    <Box
                      position="absolute"
                      left={["8px", "10px", "12px"]}
                      top="0"
                      bottom="0"
                      w="1px"
                      bg="#1f1f1f"
                    />

                    <VStack spacing={[8, 10, 12]} align="stretch">
                      {workExperiences.map((experience, i) => (
                        <MotionBox
                          key={experience._id}
                          position="relative"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.5, delay: i * 0.08 }}
                          role="group"
                        >
                          {/* Timeline marker */}
                          <Box
                            position="absolute"
                            left={["-24px", "-28px", "-32px"]}
                            top="6px"
                            w="18px"
                            h="18px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            zIndex={1}
                          >
                            <Box
                              w="9px"
                              h="9px"
                              bg="#0a0a0a"
                              border="1px solid #333333"
                              transition="all 0.3s"
                              transform="rotate(45deg)"
                              _groupHover={{
                                borderColor: "#e0e0e0",
                                bg: "#e0e0e0",
                                boxShadow: "0 0 0 4px rgba(224,224,224,0.06)",
                              }}
                            />
                          </Box>

                          {/* Date row above card */}
                          <HStack
                            spacing={3}
                            mb={3}
                            divider={<Box w="20px" h="1px" bg="#2a2a2a" />}
                          >
                            <Text
                              fontSize="10px"
                              color="#888888"
                              letterSpacing="3px"
                              textTransform="uppercase"
                              fontWeight="500"
                              fontFamily="monospace"
                            >
                              {experience.startDate} → {experience.endDate}
                            </Text>
                            <Text
                              fontSize="10px"
                              color="#444444"
                              letterSpacing="2px"
                              fontFamily="monospace"
                            >
                              #{String(i + 1).padStart(2, "0")}
                            </Text>
                          </HStack>

                          {/* Card */}
                          <Box
                            bg="#0d0d0d"
                            border="1px solid #1f1f1f"
                            p={[5, 6, 7]}
                            position="relative"
                            overflow="hidden"
                            transition="all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
                            _groupHover={{
                              borderColor: "#333333",
                              transform: "translateY(-4px)",
                              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
                            }}
                            sx={{
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: "-100%",
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(90deg, transparent, rgba(224,224,224,0.03), transparent)",
                                transition: "left 0.6s ease",
                                pointerEvents: "none",
                              },
                              "&:hover::before": {
                                left: "100%",
                              },
                            }}
                          >
                            {/* Position + company */}
                            <Heading
                              as="h3"
                              fontSize={[20, 24, 28]}
                              fontWeight="700"
                              color="#e0e0e0"
                              letterSpacing="-0.5px"
                              lineHeight="1.15"
                              mb={2}
                            >
                              {experience.position}
                            </Heading>
                            <HStack
                              spacing={3}
                              mb={5}
                              divider={<Box w="14px" h="1px" bg="#333333" />}
                              flexWrap="wrap"
                            >
                              <Text
                                fontSize={[13, 14]}
                                fontWeight="500"
                                color="#999999"
                                letterSpacing="0.3px"
                              >
                                @ {experience.company}
                              </Text>
                              {experience.location && (
                                <Text
                                  fontSize="11px"
                                  color="#666666"
                                  letterSpacing="2px"
                                  textTransform="uppercase"
                                  fontFamily="monospace"
                                >
                                  {experience.location}
                                </Text>
                              )}
                            </HStack>

                            {/* Description with side rail */}
                            <Box
                              position="relative"
                              pl={5}
                              borderLeft="1px solid #2a2a2a"
                              mb={experience.technologies?.length > 0 ? 6 : 0}
                              transition="border-color 0.4s"
                              _groupHover={{ borderColor: "#444444" }}
                            >
                              <Text
                                fontSize={[14, 15]}
                                color="#999999"
                                fontWeight="300"
                                lineHeight="1.7"
                              >
                                {experience.description}
                              </Text>
                            </Box>

                            {/* Technologies — dot-divided typography (no chips) */}
                            {experience.technologies?.length > 0 && (
                              <Box>
                                <Text
                                  fontSize="9px"
                                  color="#555555"
                                  letterSpacing="3px"
                                  textTransform="uppercase"
                                  fontWeight="500"
                                  mb={3}
                                  fontFamily="monospace"
                                >
                                  Stack
                                </Text>
                                <HStack
                                  spacing={0}
                                  flexWrap="wrap"
                                  divider={<Box w="1px" h="10px" bg="#2a2a2a" mx={3} />}
                                >
                                  {experience.technologies.map((tech, idx) => (
                                    <Text
                                      key={idx}
                                      fontSize={[11, 12]}
                                      color="#888888"
                                      fontWeight="400"
                                      letterSpacing="1px"
                                      textTransform="uppercase"
                                      _hover={{ color: "#e0e0e0" }}
                                      transition="color 0.3s"
                                      cursor="default"
                                    >
                                      {tech}
                                    </Text>
                                  ))}
                                </HStack>
                              </Box>
                            )}

                            {/* Corner accent */}
                            <Box
                              position="absolute"
                              top={0}
                              right={0}
                              w="50px"
                              h="50px"
                              pointerEvents="none"
                              sx={{
                                background: "linear-gradient(135deg, transparent 50%, #1a1a1a 50%)",
                                transition: "background 0.3s",
                              }}
                              _groupHover={{
                                sx: { background: "linear-gradient(135deg, transparent 50%, #2a2a2a 50%)" },
                              }}
                            />
                          </Box>
                        </MotionBox>
                      ))}

                      {/* Timeline terminator */}
                      <Box position="relative">
                        <Box
                          position="absolute"
                          left={["-20px", "-24px", "-28px"]}
                          top="0"
                          w="10px"
                          h="10px"
                          bg="#0a0a0a"
                          border="1px solid #2a2a2a"
                          borderRadius="50%"
                        />
                        <Text
                          fontSize="10px"
                          color="#555555"
                          letterSpacing="3px"
                          textTransform="uppercase"
                          fontFamily="monospace"
                          pl={1}
                        >
                          — End of record
                        </Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </ParallaxSection>

              <AnimatedDivider />

              {/* ═══ CONTENT GENERATION ═══ */}
              <ParallaxSection id="content-gen-section" offset={30}>
                <ContentGenerationSection />
              </ParallaxSection>

              <AnimatedDivider />

              {/* ═══ CONTACT SECTION ═══ */}
              <ParallaxSection id="contact-section" mb={[12, 16, 20]} offset={25}>
                <Box position="relative">
                  {/* Giant ghost numeral */}
                  <Box
                    position="absolute"
                    top={["-30px", "-50px", "-70px"]}
                    left={["-10px", "-20px", "-30px"]}
                    fontSize={["120px", "180px", "240px"]}
                    fontWeight="700"
                    lineHeight="1"
                    color="transparent"
                    letterSpacing="-8px"
                    pointerEvents="none"
                    zIndex={0}
                    sx={{
                      WebkitTextStroke: "1px #1a1a1a",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                    display={{ base: "none", md: "block" }}
                  >
                    05
                  </Box>

                  {/* Editorial header */}
                  <Box mb={[10, 12, 14]} position="relative" zIndex={1} maxW="640px">
                    <HStack
                      spacing={3}
                      mb={5}
                      divider={<Box w="20px" h="1px" bg="#333333" />}
                    >
                      <Text
                        fontSize="11px"
                        color="#888888"
                        letterSpacing="3px"
                        textTransform="uppercase"
                        fontWeight="500"
                      >
                        Contact
                      </Text>
                      <Text
                        fontSize="11px"
                        color="#666666"
                        letterSpacing="2px"
                        fontFamily="monospace"
                      >
                        / 05
                      </Text>
                    </HStack>

                    <Heading
                      as="h2"
                      fontSize={[36, 48, 60]}
                      fontWeight="700"
                      color="#e0e0e0"
                      letterSpacing="-2px"
                      lineHeight="0.95"
                      mb={5}
                    >
                      Let&apos;s build
                      <Text as="span" color="#555555" fontWeight="300" fontStyle="italic">
                        {" "}something
                      </Text>
                    </Heading>

                    <Box
                      position="relative"
                      pl={5}
                      borderLeft="1px solid #2a2a2a"
                    >
                      <Text
                        fontSize={[14, 15, 16]}
                        color="#999999"
                        fontWeight="300"
                        lineHeight="1.7"
                      >
                        Have a project in mind or just want to say hi? Drop a message —
                        I read every one and reply within a couple of days.
                      </Text>
                    </Box>
                  </Box>

                  <Flex
                    direction={{ base: "column", lg: "row" }}
                    gap={[8, 10, 14]}
                    align="stretch"
                    position="relative"
                    zIndex={1}
                  >
                    {/* ── Left: Contact form ────────────────────── */}
                    <MotionBox
                      flex={{ base: "1", lg: "0 0 58%" }}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <ContactForm onSubmit={handleFormSubmit} toast={toast} />
                    </MotionBox>

                    {/* ── Right: Contact info stack ─────────────── */}
                    <MotionBox
                      flex="1"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                    >
                      <VStack spacing={4} align="stretch">
                        {/* Direct line card */}
                        <Box
                          bg="#0d0d0d"
                          border="1px solid #1f1f1f"
                          p={6}
                          position="relative"
                          overflow="hidden"
                          role="group"
                          transition="border-color 0.3s"
                          _hover={{ borderColor: "#333333" }}
                        >
                          <HStack spacing={2} mb={4}>
                            <Box
                              w="6px"
                              h="6px"
                              borderRadius="50%"
                              bg="#e0e0e0"
                              sx={{
                                animation: "contactPulse 2s ease-in-out infinite",
                                "@keyframes contactPulse": {
                                  "0%, 100%": { opacity: 1, boxShadow: "0 0 0 0 rgba(224,224,224,0.5)" },
                                  "50%": { opacity: 0.5, boxShadow: "0 0 0 6px rgba(224,224,224,0)" },
                                },
                              }}
                            />
                            <Text
                              fontSize="10px"
                              color="#888888"
                              letterSpacing="3px"
                              textTransform="uppercase"
                              fontWeight="500"
                            >
                              Direct Line
                            </Text>
                          </HStack>

                          {[
                            { key: "EMAIL", value: contactData?.email || "johnmichael.escarlan14@gmail.com", href: `mailto:${contactData?.email || "johnmichael.escarlan14@gmail.com"}` },
                            { key: "PHONE", value: contactData?.mobile || "+63 995 7128385", href: `tel:${(contactData?.mobile || "+639957128385").replace(/\s/g, "")}` },
                            { key: "BASED", value: contactData?.location || "Cebu City, PH" },
                          ].map((item, i, arr) => (
                            <Box
                              key={item.key}
                              py={3}
                              borderBottom={i === arr.length - 1 ? "none" : "1px solid #1f1f1f"}
                            >
                              <Text
                                fontSize="9px"
                                color="#555555"
                                letterSpacing="3px"
                                textTransform="uppercase"
                                fontWeight="500"
                                mb={1}
                                fontFamily="monospace"
                              >
                                {item.key}
                              </Text>
                              {item.href ? (
                                <Box
                                  as="a"
                                  href={item.href}
                                  fontSize={[13, 14]}
                                  color="#e0e0e0"
                                  fontWeight="400"
                                  letterSpacing="0.2px"
                                  transition="color 0.3s"
                                  _hover={{ color: "#ffffff", textDecoration: "underline" }}
                                  wordBreak="break-all"
                                >
                                  {item.value}
                                </Box>
                              ) : (
                                <Text
                                  fontSize={[13, 14]}
                                  color="#e0e0e0"
                                  fontWeight="400"
                                  letterSpacing="0.2px"
                                >
                                  {item.value}
                                </Text>
                              )}
                            </Box>
                          ))}

                          {/* Corner accent */}
                          <Box
                            position="absolute"
                            top={0}
                            right={0}
                            w="50px"
                            h="50px"
                            pointerEvents="none"
                            sx={{
                              background: "linear-gradient(135deg, transparent 50%, #1a1a1a 50%)",
                              transition: "background 0.3s",
                            }}
                            _groupHover={{
                              sx: { background: "linear-gradient(135deg, transparent 50%, #2a2a2a 50%)" },
                            }}
                          />
                        </Box>

                        {/* Social links card */}
                        <Box
                          bg="#0d0d0d"
                          border="1px solid #1f1f1f"
                          p={6}
                          transition="border-color 0.3s"
                          _hover={{ borderColor: "#333333" }}
                        >
                          <Text
                            fontSize="10px"
                            color="#888888"
                            letterSpacing="3px"
                            textTransform="uppercase"
                            fontWeight="500"
                            mb={4}
                          >
                            Elsewhere
                          </Text>

                          <VStack spacing={0} align="stretch">
                            {[
                              { icon: FaGithub, label: "GitHub", href: contactData?.githubLink || "https://github.com" },
                              { icon: FaLinkedin, label: "LinkedIn", href: contactData?.linkedinLink || "https://linkedin.com" },
                            ].map((social, i, arr) => {
                              const Icon = social.icon;
                              return (
                                <Box
                                  key={social.label}
                                  as="a"
                                  href={ensureAbsoluteUrl(social.href)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  role="group"
                                  py={3}
                                  borderBottom={i === arr.length - 1 ? "none" : "1px solid #1f1f1f"}
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  gap={3}
                                  transition="all 0.3s"
                                  _hover={{ pl: 2 }}
                                >
                                  <HStack spacing={3}>
                                    <Box color="#666666" _groupHover={{ color: "#e0e0e0" }} transition="color 0.3s">
                                      <Icon size={14} />
                                    </Box>
                                    <Text
                                      fontSize="13px"
                                      color="#888888"
                                      fontWeight="500"
                                      letterSpacing="2px"
                                      textTransform="uppercase"
                                      _groupHover={{ color: "#e0e0e0" }}
                                      transition="color 0.3s"
                                    >
                                      {social.label}
                                    </Text>
                                  </HStack>
                                  <Box
                                    color="#444444"
                                    transition="all 0.3s"
                                    _groupHover={{ color: "#e0e0e0", transform: "translate(4px, -2px) rotate(-45deg)" }}
                                  >
                                    →
                                  </Box>
                                </Box>
                              );
                            })}
                          </VStack>
                        </Box>

                        {/* Response time strip */}
                        <Flex
                          align="center"
                          justify="space-between"
                          px={6}
                          py={3}
                          border="1px dashed #1f1f1f"
                          fontFamily="monospace"
                          fontSize="10px"
                          letterSpacing="2px"
                          color="#555555"
                          textTransform="uppercase"
                        >
                          <Text>Avg. Response</Text>
                          <Text color="#888888">~ 24 hours</Text>
                        </Flex>
                      </VStack>
                    </MotionBox>
                  </Flex>
                </Box>
              </ParallaxSection>

              {/* ─── Footer ──────────────────────────────────────── */}
              <MotionBox
                mt={[16, 20, 24]}
                pt={8}
                borderTop="1px solid #333333"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Text
                  fontSize={[11, 12, 13]}
                  color="#666666"
                  textAlign="center"
                  fontWeight="300"
                >
                  © {new Date().getFullYear()} John Michael T. Escarlan. All
                  Rights Reserved.
                </Text>
              </MotionBox>
            </Box>
          </Box>
        </MotionDiv>
      )}
    </>
  );
};

export default PortfolioTab;
