import React, { useRef, useState, useEffect } from "react";
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
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaUserShield, FaGithub, FaLinkedin, FaBars } from "react-icons/fa";

const MotionBox = motion.create(Box);
const MotionDiv = motion.div;

const ensureAbsoluteUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url;
  }
  return `https://${url}`;
};

const PortfolioTab = () => {
  const router = useRouter();
  const [aboutData, setAboutData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contactData, setContactData] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [years, setYears] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    subject: "",
    message: "",
  });

  const toast = useToast();

  // Audio player logic for loading screen
  const audioRef = useRef(null);

  // Intro animation state
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (showIntro) {
      // Try to play the loading sound
      const playSound = async () => {
        if (audioRef.current) {
          try {
            audioRef.current.volume = 0.3;
            await audioRef.current.play();
          } catch (error) {
            // Browser blocks autoplay - this is normal for loading screens
            // Audio won't play but the loading animation will still show
            console.log("Audio autoplay blocked by browser (this is normal)");
          }
        }
      };

      // Small delay to ensure audio element is ready
      setTimeout(playSound, 100);

      const timer = setTimeout(() => {
        // Stop the sound when loading finishes
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setShowIntro(false);
      }, 5000); // 2 seconds for the loading animation
      return () => clearTimeout(timer);
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

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setFormData({ name: "", company: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {showIntro && (
        <Box
          position="fixed"
          zIndex={9999}
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="#0a0a0a"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          {/* Audio element for loading sound */}
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

            {/* Main Loading Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative Lines */}
              <Box
                mb={8}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "80px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  style={{ display: "flex" }}
                >
                  <Box h="1px" bg="#888888" />
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
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  style={{ display: "flex" }}
                >
                  <Box h="1px" bg="#888888" />
                </motion.div>
              </Box>

              {/* Name with Typing Effect */}
              <Box mb={4}>
                <Text
                  color="#e0e0e0"
                  fontSize={[28, 32, 36]}
                  fontWeight="300"
                  letterSpacing="4px"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {aboutData?.name
                    ? aboutData.name.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.08, delay: 0.3 + i * 0.03 }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))
                    : "John Michael T. Escarlan".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.08, delay: 0.3 + i * 0.03 }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                </Text>
              </Box>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
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
              </motion.div>

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
      )}

      {!showIntro && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dark background */}
          <Box bg="#0a0a0a" minH="100vh" color="#e0e0e0">
            {/* Top Navigation */}
            <Flex
              maxW="1200px"
              mx="auto"
              px={[4, 6, 8]}
              py={6}
              justify="space-between"
              align="center"
            >
              <HStack spacing={8} display={{ base: "none", md: "flex" }}>
                <Button
                  variant="link"
                  color="#888888"
                  fontSize={[13, 14]}
                  fontWeight="400"
                  letterSpacing="1px"
                  _hover={{ color: "#e0e0e0" }}
                  onClick={() =>
                    document
                      .getElementById("about-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  About
                </Button>
                <Button
                  variant="link"
                  color="#888888"
                  fontSize={[13, 14]}
                  fontWeight="400"
                  letterSpacing="1px"
                  _hover={{ color: "#e0e0e0" }}
                  onClick={() =>
                    document
                      .getElementById("projects-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Work
                </Button>
                <Button
                  variant="link"
                  color="#888888"
                  fontSize={[13, 14]}
                  fontWeight="400"
                  letterSpacing="1px"
                  _hover={{ color: "#e0e0e0" }}
                  onClick={() =>
                    document
                      .getElementById("contact-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Contact
                </Button>
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
                      <Button
                        variant="link"
                        color="#888888"
                        fontSize="18px"
                        fontWeight="300"
                        letterSpacing="1px"
                        onClick={() => {
                          onClose();
                          document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        ABOUT
                      </Button>
                      <Button
                        variant="link"
                        color="#888888"
                        fontSize="18px"
                        fontWeight="300"
                        letterSpacing="1px"
                        onClick={() => {
                          onClose();
                          document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        WORK
                      </Button>
                      <Button
                        variant="link"
                        color="#888888"
                        fontSize="18px"
                        fontWeight="300"
                        letterSpacing="1px"
                        onClick={() => {
                          onClose();
                          document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        CONTACT
                      </Button>
                    </VStack>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Flex>

            {/* Hero Section - Full Screen */}
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
                {/* Profile Picture - First on mobile, right side on desktop */}
                <Box
                  flex="0 0 auto"
                  order={{ base: 0, md: 2 }}
                  mb={{ base: 8, md: 0 }}
                >
                  <Box position="relative">
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
                        transition="opacity 0.3s ease-in-out"
                        bg="#1a1a1a"
                      />
                    </Skeleton>
                  </Box>
                </Box>

                {/* Text Block - Second on mobile, left side on desktop */}
                <Box
                  flex="1"
                  maxW="600px"
                  order={{ base: 1, md: 0 }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <Heading
                    as="h1"
                    fontSize={[48, 56, 64, 72]}
                    fontWeight="700"
                    color="#e0e0e0"
                    mb={4}
                    letterSpacing="-2px"
                    lineHeight="1.1"
                  >
                    {aboutData?.name || "John Michael T. Escarlan"}
                  </Heading>

                  <Text
                    fontSize={[18, 20, 22, 24]}
                    fontWeight="400"
                    color="#e0e0e0"
                    mb={6}
                    letterSpacing="0.5px"
                    textTransform="uppercase"
                  >
                    {aboutData?.currentJobTitle || "Web Developer"}
                  </Text>

                  <Text
                    fontSize={[16, 18, 20]}
                    fontWeight="300"
                    color="#888888"
                    mb={8}
                    letterSpacing="0.5px"
                  >
                    {aboutData?.tagline ||
                      "Building thoughtful digital experiences"}
                  </Text>

                  {/* Social Icons */}
                  <HStack
                    spacing={6}
                    justify={{ base: "center", md: "flex-start" }}
                  >
                    {aboutData?.githubLink && (
                      <IconButton
                        icon={<FaGithub />}
                        aria-label="GitHub"
                        variant="ghost"
                        fontSize="24px"
                        color="#e0e0e0"
                        _hover={{
                          color: "#e0e0e0",
                          transform: "translateY(-3px)",
                        }}
                        onClick={() =>
                          window.open(ensureAbsoluteUrl(aboutData.githubLink), "_blank")
                        }
                      />
                    )}
                    {aboutData?.linkedinLink && (
                      <IconButton
                        icon={<FaLinkedin />}
                        aria-label="LinkedIn"
                        variant="ghost"
                        fontSize="24px"
                        color="#e0e0e0"
                        _hover={{
                          color: "#e0e0e0",
                          transform: "translateY(-3px)",
                        }}
                        onClick={() =>
                          window.open(ensureAbsoluteUrl(aboutData.linkedinLink), "_blank")
                        }
                      />
                    )}
                    {aboutData?.portfolioLink && (
                      <IconButton
                        icon={<span>🌐</span>}
                        aria-label="Portfolio"
                        variant="ghost"
                        fontSize="24px"
                        color="#e0e0e0"
                        _hover={{
                          color: "#e0e0e0",
                          transform: "translateY(-3px)",
                        }}
                        onClick={() =>
                          window.open(ensureAbsoluteUrl(aboutData.portfolioLink), "_blank")
                        }
                      />
                    )}
                    {contactData?.email && (
                      <IconButton
                        icon={<span>📧</span>}
                        aria-label="Email"
                        variant="ghost"
                        fontSize="24px"
                        color="#e0e0e0"
                        _hover={{
                          color: "#e0e0e0",
                          transform: "translateY(-3px)",
                        }}
                        onClick={() =>
                        (window.location.href = `mailto:${contactData?.email ||
                          "johnmichael.escarlan14@gmail.com"
                          }`)
                        }
                      />
                    )}
                  </HStack>
                </Box>
              </Flex>
            </Box>

            {/* About Section */}
            <Box maxW="1200px" mx="auto" px={[4, 6, 8]} py={[8, 12, 16]}>
              <Box my={[12, 16, 20]}>
                <Divider borderColor="#333333" borderWidth="1px" />
              </Box>

              <Box id="about-section" mb={[12, 16, 20]}>
                <Heading
                  as="h2"
                  fontSize={[32, 36, 40]}
                  fontWeight="600"
                  color="#e0e0e0"
                  mb={2}
                  letterSpacing="-1px"
                >
                  About Me
                </Heading>
                <Text
                  fontSize={[11, 12, 13]}
                  fontWeight="400"
                  color="#888888"
                  mb={8}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  My Professional Journey and Expertise
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} mb={8} align="stretch">
                  {/* Quote Box */}
                  <Box
                    bg="#1a1a1a"
                    p={6}
                    border="1px solid #333333"
                    display="flex"
                    alignItems="center"
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
                  </Box>

                  {/* Education Box */}
                  <Box border="1px solid #333333" p={6} bg="#141414">
                    <Text
                      fontSize={[16, 17]}
                      fontWeight="600"
                      color="#e0e0e0"
                      mb={2}
                    >
                      {aboutData?.education ||
                        "Bachelor of Science in Information Technology"}
                    </Text>
                    <Text
                      fontSize={[13, 14]}
                      fontWeight="400"
                      color="#888888"
                      mb={1}
                    >
                      {aboutData?.education || "University"}
                    </Text>
                    <Text
                      fontSize={[12, 13]}
                      fontWeight="300"
                      color="#666666"
                    >
                      Graduated
                    </Text>
                  </Box>

                  {/* Experience Box */}
                  <Box border="1px solid #333333" p={6} bg="#141414">
                    <Text
                      fontSize={[16, 17]}
                      fontWeight="600"
                      color="#e0e0e0"
                      mb={2}
                    >
                      {aboutData?.currentJobTitle || "Software Developer"}
                    </Text>
                    <Text
                      fontSize={[13, 14]}
                      fontWeight="400"
                      color="#888888"
                      mb={1}
                    >
                      {aboutData?.currentCompany || "Current Company"}
                    </Text>
                    <Text
                      fontSize={[12, 13]}
                      fontWeight="300"
                      color="#666666"
                    >
                      Present
                    </Text>
                  </Box>
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
                <Box overflow="hidden" position="relative" w="100%" mb={4}>
                  <Box display="flex" className="infinite-slide">
                    {/* Duplicate the skills to create infinite loop */}
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
                        _hover={{ borderColor: "#555555", bg: "#1a1a1a" }}
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

              <Box my={[12, 16, 20]}>
                <Divider borderColor="#333333" borderWidth="1px" />
              </Box>

              {/* Featured Projects Section */}
              <Box id="projects-section" mb={[12, 16, 20]}>
                <Heading
                  as="h2"
                  fontSize={[32, 36, 40]}
                  fontWeight="600"
                  color="#e0e0e0"
                  mb={2}
                  letterSpacing="-1px"
                >
                  Featured Projects
                </Heading>
                <Text
                  fontSize={[11, 12, 13]}
                  fontWeight="400"
                  color="#888888"
                  mb={8}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  What Did I Do?
                </Text>

                <VStack spacing={12} align="stretch">
                  {projects.slice(0, 5).map((project, index) => (
                    <Box key={project._id || index}>
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
                                  {
                                    month: "long",
                                    year: "numeric",
                                    day: "numeric"
                                  }
                                ).toUpperCase()
                              : new Date(project.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  year: "numeric",
                                }
                              ).toUpperCase()}
                          </Text>

                          {/* Tech Stack */}
                          <HStack spacing={2} mb={4} flexWrap="wrap">
                            {project.technologies
                              ?.slice(0, 6)
                              .map((tech, idx) => (
                                <Box
                                  key={idx}
                                  px={3}
                                  py={1}
                                  borderRadius="2px"
                                  bg="#141414"
                                  border="1px solid #333333"
                                >
                                  <Text
                                    fontSize={[11, 12]}
                                    color="#888888"
                                    fontWeight="400"
                                  >
                                    {tech}
                                  </Text>
                                </Box>
                              ))}
                          </HStack>

                          {/* Description */}
                          <VStack align="start" spacing={2} mb={4}>
                            {project.description
                              ?.split("\n")
                              .map((line, idx) => (
                                <HStack key={idx} align="start" spacing={2}>
                                  <Text fontSize={16} color="#888888">
                                    •
                                  </Text>
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

                          {/* Links */}
                          <HStack spacing={6}>
                            <Button
                              variant="link"
                              color="#888888"
                              fontSize={[13, 14]}
                              fontWeight="400"
                              letterSpacing="1px"
                              textTransform="uppercase"
                              _hover={{ color: "#e0e0e0" }}
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
                                _hover={{ color: "#e0e0e0" }}
                                onClick={() =>
                                  window.open(ensureAbsoluteUrl(project.website), "_blank")
                                }
                              >
                                Preview
                              </Button>
                            )}
                          </HStack>
                        </Box>

                        {/* Project Icon */}
                        <Box flex="0 0 auto" w={["140px", "160px", "180px"]}>
                          <img
                            src={project.img}
                            alt={project.title}
                            style={{
                              width: "100%",
                              height: "auto",
                              objectFit: "contain",
                              filter: "grayscale(100%)",
                              border: "1px solid #333333",
                              padding: "12px",
                            }}
                          />
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Box my={[12, 16, 20]}>
                <Divider borderColor="#333333" borderWidth="1px" />
              </Box>

              {/* Milestones Section */}
              <Box id="milestones-section" mb={[12, 16, 20]}>
                <Heading
                  as="h2"
                  fontSize={[32, 36, 40]}
                  fontWeight="600"
                  color="#e0e0e0"
                  mb={2}
                  letterSpacing="-1px"
                >
                  Key Milestones
                </Heading>
                <Text
                  fontSize={[11, 12, 13]}
                  fontWeight="400"
                  color="#888888"
                  mb={8}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Significant Years and Achievements
                </Text>

                <Flex
                  gap={4}
                  overflowX="auto"
                  pb={4}
                  css={{
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#0a0a0a",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#333333",
                    },
                  }}
                >
                  {years.map((y) => (
                    <Box
                      key={y._id}
                      minW={["200px", "240px"]}
                      bg="#141414"
                      p={6}
                      border="1px solid #333333"
                      _hover={{
                        borderColor: "#555555",
                        transform: "translateY(-4px)",
                      }}
                      transition="all 0.3s"
                    >
                      <Text
                        fontSize="28px"
                        fontWeight="700"
                        color="#e0e0e0"
                        mb={2}
                        letterSpacing="-1px"
                      >
                        {y.year}
                      </Text>
                      <Text
                        fontSize="13px"
                        color="#888888"
                        fontWeight="300"
                        lineHeight="1.5"
                      >
                        {y.label}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </Box>

              <Box my={[12, 16, 20]}>
                <Divider borderColor="#333333" borderWidth="1px" />
              </Box>

              {/* Work Experience Section */}
              <Box id="experience-section" mb={[12, 16, 20]}>
                <Heading
                  as="h2"
                  fontSize={[32, 36, 40]}
                  fontWeight="600"
                  color="#e0e0e0"
                  mb={2}
                  letterSpacing="-1px"
                >
                  Work Experience
                </Heading>
                <Text
                  fontSize={[11, 12, 13]}
                  fontWeight="400"
                  color="#888888"
                  mb={8}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Professional Journey
                </Text>

                <VStack spacing={8} align="stretch">
                  {workExperiences.map((experience) => (
                    <Box
                      key={experience._id}
                      bg="#141414"
                      p={6}
                      border="1px solid #333333"
                      _hover={{
                        borderColor: "#555555",
                        transform: "translateX(4px)",
                      }}
                      transition="all 0.3s"
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
                            <Box
                              key={idx}
                              px={3}
                              py={1}
                              bg="#1a1a1a"
                              border="1px solid #333333"
                              borderRadius="0"
                            >
                              <Text
                                fontSize="11px"
                                color="#888888"
                                fontWeight="400"
                              >
                                {tech}
                              </Text>
                            </Box>
                          ))}
                        </HStack>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>

              <Box my={[12, 16, 20]}>
                <Divider borderColor="#333333" borderWidth="1px" />
              </Box>

              {/* Get in Touch Section */}
              <Box id="contact-section" mb={[12, 16, 20]}>
                <Heading
                  as="h2"
                  fontSize={[32, 36, 40]}
                  fontWeight="600"
                  color="#e0e0e0"
                  mb={2}
                  letterSpacing="-1px"
                >
                  Get in Touch with Me
                </Heading>
                <Text
                  fontSize={[11, 12, 13]}
                  fontWeight="400"
                  color="#888888"
                  mb={8}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Want to Connect?
                </Text>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} align="start">
                  {/* Left column - Contact Form */}
                  <Box>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text
                            fontSize={[11, 12]}
                            color="#888888"
                            mb={1}
                            fontWeight="400"
                          >
                            NAME
                          </Text>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            border="1px solid #333333"
                            borderRadius="0"
                            bg="#141414"
                            color="#e0e0e0"
                            _focus={{ borderColor: "#888888" }}
                            fontWeight="300"
                          />
                        </Box>
                        <Box>
                          <Text
                            fontSize={[11, 12]}
                            color="#888888"
                            mb={1}
                            fontWeight="400"
                          >
                            COMPANY (OPTIONAL)
                          </Text>
                          <Input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            border="1px solid #333333"
                            borderRadius="0"
                            bg="#141414"
                            color="#e0e0e0"
                            _focus={{ borderColor: "#888888" }}
                            fontWeight="300"
                          />
                        </Box>
                        <Box>
                          <Text
                            fontSize={[11, 12]}
                            color="#888888"
                            mb={1}
                            fontWeight="400"
                          >
                            EMAIL
                          </Text>
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            border="1px solid #333333"
                            borderRadius="0"
                            bg="#141414"
                            color="#e0e0e0"
                            _focus={{ borderColor: "#888888" }}
                            fontWeight="300"
                          />
                        </Box>
                        <Box>
                          <Text
                            fontSize={[11, 12]}
                            color="#888888"
                            mb={1}
                            fontWeight="400"
                          >
                            SUBJECT
                          </Text>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            border="1px solid #333333"
                            borderRadius="0"
                            bg="#141414"
                            color="#e0e0e0"
                            _focus={{ borderColor: "#888888" }}
                            fontWeight="300"
                          />
                        </Box>
                        <Box>
                          <Text
                            fontSize={[11, 12]}
                            color="#888888"
                            mb={1}
                            fontWeight="400"
                          >
                            MESSAGE
                          </Text>
                          <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            border="1px solid #333333"
                            borderRadius="0"
                            bg="#141414"
                            color="#e0e0e0"
                            _focus={{ borderColor: "#888888" }}
                            fontWeight="300"
                            rows={5}
                          />
                        </Box>
                        <Button
                          type="submit"
                          bg="#1a1a1a"
                          color="#e0e0e0"
                          border="1px solid #333333"
                          borderRadius="0"
                          fontWeight="300"
                          letterSpacing="1px"
                          textTransform="uppercase"
                          _hover={{ bg: "#2a2a2a", borderColor: "#555555" }}
                          px={6}
                          py={6}
                          leftIcon={<span>✉️</span>}
                        >
                          Send Message
                        </Button>
                      </VStack>
                    </form>
                  </Box>

                  {/* Right column - Contact Info */}
                  <Box>
                    <VStack spacing={6} align="start">
                      <HStack spacing={4}>
                        <Box
                          w="24px"
                          h="24px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="20px">📧</Text>
                        </Box>
                        <Text
                          fontSize={[14, 15, 16]}
                          color="#e0e0e0"
                          fontWeight="300"
                        >
                          {contactData?.email ||
                            "johnmichael.escarlan14@gmail.com"}
                        </Text>
                      </HStack>

                      <HStack spacing={4}>
                        <Box
                          w="24px"
                          h="24px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="20px">📱</Text>
                        </Box>
                        <Text
                          fontSize={[14, 15, 16]}
                          color="#e0e0e0"
                          fontWeight="300"
                        >
                          {contactData?.mobile || "+63 995 7128385"}
                        </Text>
                      </HStack>

                      <HStack spacing={4}>
                        <Box
                          w="24px"
                          h="24px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize="20px">📍</Text>
                        </Box>
                        <Text
                          fontSize={[14, 15, 16]}
                          color="#e0e0e0"
                          fontWeight="300"
                        >
                          {contactData?.location || "Cebu City, Central Visayas, PH"}
                        </Text>
                      </HStack>

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
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Footer */}
              <Box mt={[16, 20, 24]} pt={8} borderTop="1px solid #333333">
                <Text
                  fontSize={[11, 12, 13]}
                  color="#666666"
                  textAlign="center"
                  fontWeight="300"
                >
                  © {new Date().getFullYear()} John Michael T. Escarlan. All
                  Rights Reserved.
                </Text>
              </Box>
            </Box>
          </Box>
        </MotionDiv >
      )}
    </>
  );
};

export default PortfolioTab;
