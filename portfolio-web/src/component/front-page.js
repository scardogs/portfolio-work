import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Avatar,
  Text,
  Button,
  Heading,
  Divider,
  Skeleton,
  IconButton,
  Tooltip,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaUserShield } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

// Separate component for animated background image
const AnimatedBackgroundImage = ({ src, position, delay, scrollYProgress }) => {
  const startProgress = delay;
  const endProgress = delay + 0.5;

  // Add spring physics for smooth, delayed motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const y = useTransform(
    smoothProgress,
    [startProgress, endProgress],
    [-800, 0]
  );

  const rotate = useTransform(
    smoothProgress,
    [startProgress, endProgress],
    [0, 720]
  );

  const opacity = useTransform(
    smoothProgress,
    [startProgress, endProgress],
    [0, 0.2]
  );

  return (
    <MotionImage
      src={src}
      position="fixed"
      {...position}
      transform="translate(-50%, -50%)"
      width={["120px", "150px", "200px"]}
      height={["120px", "150px", "200px"]}
      objectFit="contain"
      zIndex="0"
      pointerEvents="none"
      style={{
        y,
        rotate,
        opacity,
      }}
    />
  );
};

const FrontPage = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [aboutData, setAboutData] = useState(null);

  // Scroll tracking for background images
  const { scrollYProgress } = useScroll();

  // Responsive message text
  const scrollMessage = useBreakpointValue({
    base: "Hi, Pls Swipe",
    md: "Hi, Please Scroll",
  });

  // Stage 1: Welcome message (fades out as user scrolls)
  const welcomeOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const welcomeY = useTransform(scrollYProgress, [0, 0.1], [0, -20]);

  // Stage 2: Name and profession (appear on second scroll)
  const nameOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const nameY = useTransform(scrollYProgress, [0.15, 0.35], [30, 0]);

  // Stage 3: Button (appears only at 100% scroll progress)
  const buttonOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.9, 1], [30, 0]);

  // Background images configuration
  const backgroundImages = [
    {
      src: "https://res.cloudinary.com/dr8fl3ruc/image/upload/v1760354823/portfolio/kdrev4b1th9au9sc9w1f.png",
      position: { left: "50%", top: "35%" },
      delay: 0,
    },
    {
      src: "https://res.cloudinary.com/dr8fl3ruc/image/upload/v1760354815/portfolio/tityecgpvnkl56yft5ji.png",
      position: { left: "15%", top: "25%" },
      delay: 0.15,
    },
    {
      src: "https://res.cloudinary.com/dr8fl3ruc/image/upload/v1760354807/portfolio/ahillg47ap9hh2yct6ho.png",
      position: { left: "10%", top: "70%" },
      delay: 0.3,
    },
    {
      src: "https://res.cloudinary.com/dr8fl3ruc/image/upload/v1760354801/portfolio/xehhnhr8suuwv6pmwqni.png",
      position: { right: "15%", top: "30%" },
      delay: 0.2,
    },
    {
      src: "https://res.cloudinary.com/dr8fl3ruc/image/upload/v1760354787/portfolio/gfacc3drtrvbdlxigkkm.png",
      position: { right: "10%", top: "75%" },
      delay: 0.4,
    },
  ];

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch("/api/about");
        const data = await response.json();
        if (data.success) {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };

    fetchAboutData();
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <Box minH="200vh" bg="#191919" position="relative">
      {/* Admin Login Button - Top Right */}
      <Tooltip
        label="Admin Login"
        hasArrow
        bg="#232323"
        color="#e2b714"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      >
        <IconButton
          icon={<FaUserShield />}
          aria-label="Admin Login"
          onClick={() => router.push("/admin/login")}
          position="fixed"
          top={4}
          right={4}
          zIndex={1000}
          colorScheme="yellow"
          variant="ghost"
          size={["md", "lg"]}
          fontSize={["xl", "2xl"]}
          bg="#272727"
          border="1px solid #e2b714"
          _hover={{
            bg: "#232323",
            transform: "scale(1.05)",
          }}
          transition="all 0.2s"
        />
      </Tooltip>

      {/* Elegant background pattern */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.03"
        backgroundImage="radial-gradient(circle at 25% 25%, #e2b714 0%, transparent 50%), radial-gradient(circle at 75% 75%, #e2b714 0%, transparent 50%)"
        backgroundSize="400px 400px"
        zIndex="0"
      />

      {/* Animated Background Images */}
      {backgroundImages.map((img, index) => (
        <AnimatedBackgroundImage
          key={index}
          src={img.src}
          position={img.position}
          delay={img.delay}
          scrollYProgress={scrollYProgress}
        />
      ))}

      <MotionBox
        w={["95%", "90%", "700px"]}
        maxW="100%"
        p={[8, 12, 16]}
        bg="rgba(39, 39, 39, 0.2)"
        backdropFilter="blur(1px)"
        WebkitBackdropFilter="blur(1px)"
        borderRadius="2xl"
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.6)"
        border="1px solid rgba(226, 183, 20, 0.4)"
      >
        {/* Profile Image - Always visible */}
        <Box position="relative">
          <Skeleton
            isLoaded={imageLoaded}
            startColor="#232323"
            endColor="#e2b714"
            borderRadius="full"
            boxSize="280px"
            fadeDuration={0.4}
          >
            <Avatar
              src={aboutData?.profileImage || "/profile.png"}
              boxSize="280px"
              border="4px solid #e2b714"
              name={aboutData?.name || "John Michael T. Escarlan"}
              boxShadow="0 4px 16px rgba(226,183,20,0.3)"
              onLoad={handleImageLoad}
              onError={handleImageError}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s ease-in-out"
              showBorder={false}
              bg="transparent"
            />
          </Skeleton>
        </Box>

        {/* Divider - Always visible */}
        <Box mt={8} mb={6}>
          <Divider
            borderColor="#e2b714"
            borderWidth="2px"
            opacity="0.6"
            w="200px"
          />
        </Box>

        {/* Welcome Message - Stage 1 (fades out when scrolling) */}
        <MotionText
          color="#e2b714"
          fontSize={[20, 24, 28]}
          fontWeight="bold"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          textAlign="center"
          letterSpacing="2px"
          mb={6}
          style={{
            opacity: welcomeOpacity,
            y: welcomeY,
          }}
        >
          {scrollMessage}
        </MotionText>

        {/* Name - Stage 2 (appears on second scroll) */}
        <MotionHeading
          as="h1"
          size="2xl"
          color="#e2b714"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          mb={3}
          fontWeight="bold"
          letterSpacing="2px"
          textAlign="center"
          style={{
            opacity: nameOpacity,
            y: nameY,
          }}
        >
          {aboutData?.name || "John Michael T. Escarlan"}
        </MotionHeading>

        {/* Title - Stage 2 (appears with name) */}
        <MotionText
          color="#f7d794"
          fontSize={[16, 18, 20]}
          mb={4}
          fontWeight="medium"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          textAlign="center"
          letterSpacing="1px"
          style={{
            opacity: nameOpacity,
            y: nameY,
          }}
        >
          Software Developer & Web Developer
        </MotionText>

        {/* Second divider - Stage 2 (appears with name) */}
        <MotionBox
          mb={8}
          style={{
            opacity: nameOpacity,
          }}
        >
          <Divider borderColor="#232323" borderWidth="1px" w="150px" />
        </MotionBox>

        {/* Proceed button - Stage 3 (appears on third scroll) */}
        <MotionBox
          style={{
            opacity: buttonOpacity,
            y: buttonY,
          }}
        >
          <Button
            size="lg"
            colorScheme="yellow"
            variant="solid"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            fontWeight="bold"
            px={12}
            py={7}
            fontSize={22}
            borderRadius="full"
            boxShadow="0 4px 20px 0 rgba(226,183,20,0.2)"
            _hover={{
              bg: "#e2b714",
              color: "#191919",
              boxShadow: "0 8px 32px 0 rgba(226,183,20,0.3)",
              transform: "translateY(-2px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            onClick={() => router.push("/portfolio-tab")}
            transition="all 0.2s ease"
          >
            Proceed
          </Button>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default FrontPage;
