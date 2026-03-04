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
  Avatar,
  Skeleton,
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
  const [contentGenData, setContentGenData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contactData, setContactData] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [years, setYears] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  // Tech marquee hover pause
  const [marquePaused, setMarqueePaused] = useState(false);

  // ─── Intersection Observer for active nav section ──────────────────
  useEffect(() => {
    if (showIntro) return;
    const sectionIds = ["about-section", "projects-section", "content-gen-section", "contact-section"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
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
          return prev + 1.5;
        });
      }, 60);

      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setIntroExiting(true);
        setTimeout(() => setShowIntro(false), 800);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [showIntro]);

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
          contentGenRes,
        ] = await Promise.all([
          fetch("/api/about"),
          fetch("/api/projects"),
          fetch("/api/skills"),
          fetch("/api/contact"),
          fetch("/api/work-experience"),
          fetch("/api/years"),
          fetch("/api/content-generation"),
        ]);

        const aboutData = await aboutRes.json();
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();
        const contactData = await contactRes.json();
        const workExperienceData = await workExperienceRes.json();
        const yearsData = await yearsRes.json();
        const contentGenData = await contentGenRes.json();

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
        if (contentGenData.success) setContentGenData(contentGenData.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

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
            {/* ─── Sticky Navigation ──────────────────────────── */}
            <Box
              position="sticky"
              top="0"
              zIndex={1000}
              bg="rgba(10, 10, 10, 0.8)"
              backdropFilter="blur(12px)"
              borderBottom="1px solid rgba(51, 51, 51, 0.5)"
            >
              <Flex
                maxW="1200px"
                mx="auto"
                px={[4, 6, 8]}
                py={4}
                justify="space-between"
                align="center"
              >
                <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                  <Button {...navLinkProps("about-section")}>About</Button>
                  <Button {...navLinkProps("projects-section")}>Work</Button>
                  <Button {...navLinkProps("content-gen-section")}>Content</Button>
                  <Button {...navLinkProps("contact-section")}>Contact</Button>
                </HStack>

                <HStack spacing={4}>
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
              </Flex>
            </Box>

            {/* ─── Hero Section ───────────────────────────────── */}
            <Box
              minH="100vh"
              display="flex"
              alignItems="center"
              maxW="1200px"
              mx="auto"
              px={[4, 6, 8, 12]}
              py={16}
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                w="100%"
                gap={8}
              >
                {/* Profile Picture with parallax */}
                <MotionBox
                  flex="0 0 auto"
                  order={{ base: 0, md: 2 }}
                  mb={{ base: 8, md: 0 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box
                    position="relative"
                    _hover={{
                      "& > div:first-of-type": {
                        boxShadow: "0 0 40px rgba(224, 224, 224, 0.1)",
                      },
                    }}
                  >
                    <Skeleton
                      isLoaded={imageLoaded}
                      startColor="#1a1a1a"
                      endColor="#2a2a2a"
                      borderRadius="full"
                      boxSize={["200px", "240px", "280px", "400px"]}
                      fadeDuration={0.3}
                    >
                      <Avatar
                        src={aboutData?.profileImage}
                        boxSize={["200px", "240px", "280px", "400px"]}
                        border="4px solid #333333"
                        name={aboutData?.name || "John Michael T. Escarlan"}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        opacity={imageLoaded ? 1 : 0}
                        transition="all 0.5s ease-in-out"
                        bg="#1a1a1a"
                        sx={{
                          "&:hover": {
                            boxShadow: "0 0 60px rgba(224, 224, 224, 0.08)",
                          },
                        }}
                      />
                    </Skeleton>
                  </Box>
                </MotionBox>

                {/* Text Block with staggered entrance */}
                <Box
                  flex="1"
                  maxW="600px"
                  order={{ base: 1, md: 0 }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <MotionHeading
                    as="h1"
                    fontSize={[48, 56, 64, 72]}
                    fontWeight="700"
                    color="#e0e0e0"
                    mb={4}
                    letterSpacing="-2px"
                    lineHeight="1.1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {aboutData?.name || "John Michael T. Escarlan"}
                  </MotionHeading>

                  <MotionText
                    fontSize={[18, 20, 22, 24]}
                    fontWeight="400"
                    color="#e0e0e0"
                    mb={6}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {aboutData?.currentJobTitle || "Web Developer"}
                  </MotionText>

                  <MotionText
                    fontSize={[16, 18, 20]}
                    fontWeight="300"
                    color="#888888"
                    mb={8}
                    letterSpacing="0.5px"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    {aboutData?.tagline ||
                      "Building thoughtful digital experiences"}
                  </MotionText>

                  {/* Social Icons with wave entrance */}
                  <HStack
                    spacing={6}
                    justify={{ base: "center", md: "flex-start" }}
                  >
                    {[
                      { icon: <FaGithub />, label: "GitHub", link: aboutData?.githubLink, show: !!aboutData?.githubLink },
                      { icon: <FaLinkedin />, label: "LinkedIn", link: aboutData?.linkedinLink, show: !!aboutData?.linkedinLink },
                      { icon: <span>🌐</span>, label: "Portfolio", link: aboutData?.portfolioLink, show: !!aboutData?.portfolioLink },
                      { icon: <span>📧</span>, label: "Email", link: contactData?.email ? `mailto:${contactData.email}` : null, show: !!contactData?.email, isMail: true },
                    ].filter(s => s.show).map((social, i) => (
                      <motion.div
                        key={social.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + i * 0.1, type: "spring", stiffness: 200 }}
                      >
                        <IconButton
                          icon={social.icon}
                          aria-label={social.label}
                          variant="ghost"
                          fontSize="24px"
                          color="#e0e0e0"
                          _hover={{
                            color: "#e0e0e0",
                            transform: "translateY(-3px)",
                          }}
                          transition="all 0.3s ease"
                          onClick={() => {
                            if (social.isMail) {
                              window.location.href = social.link;
                            } else {
                              window.open(ensureAbsoluteUrl(social.link), "_blank");
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </HStack>
                </Box>
              </Flex>
            </Box>

            {/* ─── Main Content ───────────────────────────────── */}
            <Box maxW="1200px" mx="auto" px={[4, 6, 8]} py={[8, 12, 16]}>

              <AnimatedDivider />

              {/* ═══ ABOUT SECTION ═══ */}
              <Box mb={[12, 16, 20]}>
                <SectionHeading id="about-section" subtitle="My Professional Journey and Expertise">
                  About Me
                </SectionHeading>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8} align="stretch">
                  {/* Quote Box */}
                  <TiltCard>
                    <MotionBox
                      bg="#1a1a1a"
                      p={6}
                      border="1px solid #333333"
                      display="flex"
                      alignItems="center"
                      minH="100%"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <Text
                        color="#e0e0e0"
                        fontSize={[16, 17, 18]}
                        fontWeight="300"
                        fontStyle="italic"
                        lineHeight="1.6"
                        textAlign="center"
                      >
                        {aboutData?.description ||
                          "Passionate about building reliable, efficient, and user-friendly systems. Skilled in solving technical challenges, improving processes, and delivering high-quality solutions."}
                      </Text>
                    </MotionBox>
                  </TiltCard>

                  {/* Education Box */}
                  <TiltCard>
                    <MotionBox
                      border="1px solid #333333"
                      p={6}
                      bg="#141414"
                      minH="100%"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Text fontSize={[16, 17]} fontWeight="600" color="#e0e0e0" mb={2}>
                        {aboutData?.education || "Bachelor of Science in Information Technology"}
                      </Text>
                      <Text fontSize={[13, 14]} fontWeight="400" color="#888888" mb={1}>
                        {aboutData?.education || "University"}
                      </Text>
                      <Text fontSize={[12, 13]} fontWeight="300" color="#666666">
                        Graduated
                      </Text>
                    </MotionBox>
                  </TiltCard>

                  {/* Experience Box */}
                  <TiltCard>
                    <MotionBox
                      border="1px solid #333333"
                      p={6}
                      bg="#141414"
                      minH="100%"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Text fontSize={[16, 17]} fontWeight="600" color="#e0e0e0" mb={2}>
                        {aboutData?.currentJobTitle || "Software Developer"}
                      </Text>
                      <Text fontSize={[13, 14]} fontWeight="400" color="#888888" mb={1}>
                        {aboutData?.currentCompany || "Current Company"}
                      </Text>
                      <Text fontSize={[12, 13]} fontWeight="300" color="#666666">
                        Present
                      </Text>
                    </MotionBox>
                  </TiltCard>
                </SimpleGrid>

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
              </Box>

              <AnimatedDivider />

              {/* ═══ FEATURED PROJECTS ═══ */}
              <Box mb={[12, 16, 20]}>
                <SectionHeading id="projects-section" subtitle="What Did I Do?">
                  Featured Projects
                </SectionHeading>

                <VStack spacing={12} align="stretch">
                  {projects.slice(0, 5).map((project, index) => (
                    <MotionBox
                      key={project._id || index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Flex
                        direction={{ base: "column-reverse", md: "row" }}
                        gap={8}
                        align="start"
                      >
                        <Box flex="1" w="100%">
                          <Text
                            fontSize={[18, 20, 22]}
                            fontWeight="600"
                            color="#e0e0e0"
                            mb={1}
                            letterSpacing="-0.5px"
                          >
                            {project.title}
                          </Text>
                          <Text
                            fontSize={[10, 11, 12]}
                            fontWeight="400"
                            color="#888888"
                            mb={2}
                            letterSpacing="1px"
                            textTransform="uppercase"
                          >
                            {project.type || "Full-Stack Application"}
                          </Text>
                          <Text
                            fontSize={[11, 12, 13]}
                            fontWeight="400"
                            color="#666666"
                            mb={4}
                            letterSpacing="0.5px"
                          >
                            {project.projectDate
                              ? isNaN(Date.parse(project.projectDate))
                                ? project.projectDate.toUpperCase()
                                : new Date(project.projectDate).toLocaleDateString(
                                  "en-US",
                                  { month: "long", year: "numeric", day: "numeric" }
                                ).toUpperCase()
                              : new Date(project.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "long", year: "numeric" }
                              ).toUpperCase()}
                          </Text>

                          {/* Tech Stack with cascading pop-in */}
                          <HStack spacing={2} mb={4} flexWrap="wrap">
                            {project.technologies
                              ?.slice(0, 6)
                              .map((tech, idx) => (
                                <MotionBox
                                  key={idx}
                                  px={3}
                                  py={1}
                                  borderRadius="2px"
                                  bg="#141414"
                                  border="1px solid #333333"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                  <Text
                                    fontSize={[11, 12]}
                                    color="#888888"
                                    fontWeight="400"
                                  >
                                    {tech}
                                  </Text>
                                </MotionBox>
                              ))}
                          </HStack>

                          {/* Description */}
                          <VStack align="start" spacing={2} mb={4}>
                            {project.description
                              ?.split("\n")
                              .map((line, idx) => (
                                <HStack key={idx} align="start" spacing={2}>
                                  <Text fontSize={16} color="#888888">•</Text>
                                  <Text
                                    fontSize={[14, 15]}
                                    lineHeight="1.6"
                                    color="#888888"
                                    fontWeight="300"
                                    flex="1"
                                  >
                                    {line.trim()}
                                  </Text>
                                </HStack>
                              ))}
                          </VStack>

                          {/* Links with underline-expand hover */}
                          <HStack spacing={6}>
                            <Button
                              variant="link"
                              color="#888888"
                              fontSize={[13, 14]}
                              fontWeight="400"
                              letterSpacing="1px"
                              textTransform="uppercase"
                              position="relative"
                              _hover={{ color: "#e0e0e0" }}
                              sx={{
                                "&::after": {
                                  content: '""',
                                  position: "absolute",
                                  bottom: "-2px",
                                  left: "50%",
                                  right: "50%",
                                  height: "1px",
                                  bg: "#e0e0e0",
                                  transition: "all 0.3s ease",
                                },
                                "&:hover::after": {
                                  left: "0",
                                  right: "0",
                                },
                              }}
                              onClick={() =>
                                window.open(ensureAbsoluteUrl(project.github), "_blank")
                              }
                            >
                              GitHub
                            </Button>
                            {project.website && (
                              <Button
                                variant="link"
                                color="#888888"
                                fontSize={[13, 14]}
                                fontWeight="400"
                                letterSpacing="1px"
                                textTransform="uppercase"
                                position="relative"
                                _hover={{ color: "#e0e0e0" }}
                                sx={{
                                  "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: "-2px",
                                    left: "50%",
                                    right: "50%",
                                    height: "1px",
                                    bg: "#e0e0e0",
                                    transition: "all 0.3s ease",
                                  },
                                  "&:hover::after": {
                                    left: "0",
                                    right: "0",
                                  },
                                }}
                                onClick={() =>
                                  window.open(ensureAbsoluteUrl(project.website), "_blank")
                                }
                              >
                                Preview
                              </Button>
                            )}
                          </HStack>
                        </Box>

                        {/* Project Image — grayscale → color on hover */}
                        <Box flex="0 0 auto" w={["140px", "160px", "180px"]} overflow="hidden">
                          <Box
                            as="img"
                            src={project.img}
                            alt={project.title}
                            w="100%"
                            h="auto"
                            objectFit="contain"
                            border="1px solid #333333"
                            p="12px"
                            filter="grayscale(100%)"
                            transition="all 0.5s ease"
                            _hover={{ filter: "grayscale(0%)", transform: "scale(1.05)" }}
                          />
                        </Box>
                      </Flex>
                    </MotionBox>
                  ))}
                </VStack>
              </Box>

              <AnimatedDivider />

              {/* ═══ KEY MILESTONES ═══ */}
              <Box mb={[12, 16, 20]}>
                <SectionHeading id="milestones-section" subtitle="Significant Years and Achievements">
                  Key Milestones
                </SectionHeading>

                <Flex
                  gap={4}
                  overflowX="auto"
                  pb={4}
                  sx={{
                    scrollSnapType: "x mandatory",
                    "&::-webkit-scrollbar": { height: "4px" },
                    "&::-webkit-scrollbar-track": { background: "#0a0a0a" },
                    "&::-webkit-scrollbar-thumb": { background: "#333333" },
                  }}
                >
                  {years.map((y, i) => (
                    <MotionBox
                      key={y._id}
                      minW={["200px", "240px"]}
                      bg="#141414"
                      p={6}
                      border="1px solid #333333"
                      _hover={{
                        borderColor: "#555555",
                        transform: "translateY(-4px) scale(1.02)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                      }}
                      transition="all 0.3s"
                      sx={{ scrollSnapAlign: "start" }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      // @ts-ignore
                      transition_framer={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <AnimatedYear year={y.year} />
                      <Text
                        fontSize="13px"
                        color="#888888"
                        fontWeight="300"
                        lineHeight="1.5"
                      >
                        {y.label}
                      </Text>
                    </MotionBox>
                  ))}
                </Flex>
              </Box>

              <AnimatedDivider />

              {/* ═══ WORK EXPERIENCE — Timeline ═══ */}
              <Box mb={[12, 16, 20]}>
                <SectionHeading id="experience-section" subtitle="Professional Journey">
                  Work Experience
                </SectionHeading>

                <Box position="relative" pl={[0, 0, 8]}>
                  {/* Timeline vertical line (desktop only) */}
                  <Box
                    display={{ base: "none", md: "block" }}
                    position="absolute"
                    left="15px"
                    top="0"
                    bottom="0"
                    w="1px"
                    bg="#333333"
                  />

                  <VStack spacing={8} align="stretch">
                    {workExperiences.map((experience, i) => (
                      <MotionBox
                        key={experience._id}
                        position="relative"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        {/* Timeline dot (desktop only) */}
                        <Box
                          display={{ base: "none", md: "block" }}
                          position="absolute"
                          left="-25px"
                          top="24px"
                          w="10px"
                          h="10px"
                          bg="#333333"
                          borderRadius="50%"
                          border="2px solid #0a0a0a"
                          zIndex={1}
                        />

                        <Box
                          bg="#141414"
                          p={6}
                          border="1px solid #333333"
                          position="relative"
                          overflow="hidden"
                          _hover={{
                            borderColor: "#555555",
                            transform: "translateX(4px)",
                          }}
                          transition="all 0.3s"
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
                            },
                            "&:hover::before": {
                              left: "100%",
                            },
                          }}
                        >
                          <HStack justify="space-between" align="start" mb={4}>
                            <VStack align="start" spacing={1}>
                              <Heading
                                fontSize={[18, 20, 22]}
                                fontWeight="600"
                                color="#e0e0e0"
                              >
                                {experience.position}
                              </Heading>
                              <Text
                                fontSize={[14, 15]}
                                fontWeight="400"
                                color="#888888"
                              >
                                {experience.company}
                                {experience.location && ` · ${experience.location}`}
                              </Text>
                              <Text
                                fontSize={[12, 13]}
                                fontWeight="300"
                                color="#666666"
                              >
                                {experience.startDate} - {experience.endDate}
                              </Text>
                            </VStack>
                          </HStack>

                          <Text
                            fontSize={[14, 15]}
                            color="#e0e0e0"
                            fontWeight="300"
                            mb={4}
                            lineHeight="1.6"
                          >
                            {experience.description}
                          </Text>

                          {experience.technologies?.length > 0 && (
                            <HStack spacing={2} flexWrap="wrap">
                              {experience.technologies.map((tech, idx) => (
                                <MotionBox
                                  key={idx}
                                  px={3}
                                  py={1}
                                  bg="#1a1a1a"
                                  border="1px solid #333333"
                                  borderRadius="0"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                                >
                                  <Text
                                    fontSize="11px"
                                    color="#888888"
                                    fontWeight="400"
                                  >
                                    {tech}
                                  </Text>
                                </MotionBox>
                              ))}
                            </HStack>
                          )}
                        </Box>
                      </MotionBox>
                    ))}
                  </VStack>
                </Box>
              </Box>

              <AnimatedDivider />

              {/* ═══ CONTENT GENERATION ═══ */}
              <Box id="content-gen-section">
                <ContentGenerationSection items={contentGenData} />
              </Box>

              <AnimatedDivider />

              {/* ═══ CONTACT SECTION ═══ */}
              <Box mb={[12, 16, 20]}>
                <SectionHeading id="contact-section" subtitle="Want to Connect?">
                  Get in Touch with Me
                </SectionHeading>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} align="start">
                  {/* Left column - Contact Form */}
                  <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <ContactForm onSubmit={handleFormSubmit} toast={toast} />
                  </MotionBox>

                  {/* Right column - Contact Info */}
                  <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <VStack spacing={6} align="start">
                      {[
                        { emoji: "📧", value: contactData?.email || "johnmichael.escarlan14@gmail.com" },
                        { emoji: "📱", value: contactData?.mobile || "+63 995 7128385" },
                        { emoji: "📍", value: contactData?.location || "Cebu City, Central Visayas, PH" },
                      ].map((item, i) => (
                        <motion.div
                          key={item.emoji}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                        >
                          <HStack spacing={4}>
                            <Box
                              w="24px"
                              h="24px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="20px">{item.emoji}</Text>
                            </Box>
                            <Text
                              fontSize={[14, 15, 16]}
                              color="#e0e0e0"
                              fontWeight="300"
                            >
                              {item.value}
                            </Text>
                          </HStack>
                        </motion.div>
                      ))}

                      <HStack spacing={6} mt={4}>
                        <Button
                          variant="link"
                          color="#888888"
                          fontSize={[14, 15]}
                          fontWeight="400"
                          _hover={{ color: "#e0e0e0" }}
                          leftIcon={<FaGithub />}
                          onClick={() =>
                            window.open(ensureAbsoluteUrl(contactData?.githubLink || "https://github.com"), "_blank")
                          }
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="link"
                          color="#888888"
                          fontSize={[14, 15]}
                          fontWeight="400"
                          _hover={{ color: "#e0e0e0" }}
                          leftIcon={<FaLinkedin />}
                          onClick={() =>
                            window.open(ensureAbsoluteUrl(contactData?.linkedinLink || "https://linkedin.com"), "_blank")
                          }
                        >
                          Connect
                        </Button>
                      </HStack>
                    </VStack>
                  </MotionBox>
                </SimpleGrid>
              </Box>

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
