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
import { FaUserShield, FaChevronDown } from "react-icons/fa";

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
    base: "Hi, Please Swipe to show the Button",
    md: "Hi, Please Scroll to show the Button",
  });

  // Stage 1: Welcome message (fades out as user scrolls)
  const welcomeOpacityRaw = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const welcomeYRaw = useTransform(scrollYProgress, [0, 0.1], [0, -20]);

  // Stage 2: Name and profession (appear on second scroll with spring animation)
  const nameOpacityRaw = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const nameYRaw = useTransform(scrollYProgress, [0.15, 0.35], [50, 0]);
  const nameScaleRaw = useTransform(scrollYProgress, [0.15, 0.35], [0.8, 1]);

  // Stage 3: Button (appears at 90% scroll progress with spring animation)
  const buttonOpacityRaw = useTransform(scrollYProgress, [0.85, 0.9], [0, 1]);
  const buttonYRaw = useTransform(scrollYProgress, [0.85, 0.9], [50, 0]);
  const buttonScaleRaw = useTransform(scrollYProgress, [0.85, 0.9], [0.8, 1]);

  // Apply bouncy spring physics to each animation value
  const welcomeOpacity = useSpring(welcomeOpacityRaw, {
    stiffness: 120,
    damping: 15,
  });
  const welcomeY = useSpring(welcomeYRaw, {
    stiffness: 120,
    damping: 15,
  });

  const nameOpacity = useSpring(nameOpacityRaw, {
    stiffness: 150,
    damping: 12,
  });
  const nameY = useSpring(nameYRaw, {
    stiffness: 150,
    damping: 12,
  });
  const nameScale = useSpring(nameScaleRaw, {
    stiffness: 150,
    damping: 12,
  });

  const buttonOpacity = useSpring(buttonOpacityRaw, {
    stiffness: 200,
    damping: 15,
  });
  const buttonY = useSpring(buttonYRaw, {
    stiffness: 200,
    damping: 15,
  });
  const buttonScale = useSpring(buttonScaleRaw, {
    stiffness: 200,
    damping: 15,
  });

  // Floating "Scroll more" message - appears after first scroll, disappears at 90%
  const scrollMoreOpacityRaw = useTransform(
    scrollYProgress,
    [0.15, 0.25, 0.85, 0.9],
    [0, 1, 1, 0]
  );
  const scrollMoreOpacity = useSpring(scrollMoreOpacityRaw, {
    stiffness: 100,
    damping: 20,
  });

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
    <Box minH="200vh" bg="#ffffff" position="relative">
      {/* Minimal grid background */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.03"
        backgroundImage="linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)"
        backgroundSize="40px 40px"
        zIndex="0"
      />

      {/* Geometric shapes - minimal */}
      <Box
        position="fixed"
        top="15%"
        right="10%"
        width="300px"
        height="300px"
        border="1px solid #e5e5e5"
        transform="rotate(45deg)"
        zIndex="0"
        opacity="0.3"
      />
      <Box
        position="fixed"
        bottom="20%"
        left="8%"
        width="200px"
        height="200px"
        border="1px solid #e5e5e5"
        borderRadius="50%"
        zIndex="0"
        opacity="0.2"
      />

      {/* Minimal scroll indicator */}
      <MotionText
        position="fixed"
        top={["auto", "auto", "calc(50% - 320px)"]}
        bottom={["20px", "30px", "auto"]}
        right={["20px", "30px", "calc(50% - 370px)"]}
        color="#999999"
        fontSize={[12, 13, 14]}
        fontWeight="300"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2px"
        zIndex="999"
        pointerEvents="none"
        textTransform="uppercase"
        style={{
          opacity: scrollMoreOpacity,
        }}
      >
        Scroll
      </MotionText>

      <MotionBox
        w={["95%", "90%", "600px"]}
        maxW="100%"
        p={[8, 10, 12]}
        bg="#ffffff"
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontFamily="system-ui, -apple-system, sans-serif"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
        border="1px solid #e5e5e5"
        boxShadow="0 1px 3px rgba(0,0,0,0.05)"
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
              src={aboutData?.profileImage}
              boxSize={["200px", "240px", "260px"]}
              border="1px solid #e5e5e5"
              name={aboutData?.name || "John Michael T. Escarlan"}
              onLoad={handleImageLoad}
              onError={handleImageError}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s ease-in-out"
              showBorder={false}
              bg="#f5f5f5"
            />
          </Skeleton>
        </Box>

        {/* Minimal divider */}
        <Box mt={6} mb={4}>
          <Divider borderColor="#e5e5e5" borderWidth="1px" w="60px" />
        </Box>

        {/* Welcome Message - Stage 1 (fades out when scrolling) */}
        <MotionBox
          style={{
            opacity: welcomeOpacity,
            y: welcomeY,
          }}
        >
          <Text
            color="#999999"
            fontSize={[13, 14, 15]}
            fontWeight="300"
            fontFamily="system-ui, -apple-system, sans-serif"
            textAlign="center"
            letterSpacing="3px"
            mb={4}
            textTransform="uppercase"
          >
            {scrollMessage}
          </Text>

          {/* Minimal arrow */}
          <MotionBox
            display="flex"
            justifyContent="center"
            mb={6}
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <FaChevronDown
              style={{
                color: "#cccccc",
                fontSize: "20px",
              }}
            />
          </MotionBox>
        </MotionBox>

        {/* Name - Stage 2 (appears on second scroll) */}
        <MotionHeading
          as="h1"
          size="2xl"
          color="#1a1a1a"
          fontFamily="system-ui, -apple-system, sans-serif"
          mb={2}
          fontWeight="300"
          textAlign="center"
          marginTop={-80}
          style={{
            opacity: nameOpacity,
            y: nameY,
            scale: nameScale,
          }}
        >
          {aboutData?.name || "John Michael T. Escarlan"}
        </MotionHeading>

        {/* Title - Stage 2 (appears with name) */}
        <MotionText
          color="#666666"
          fontSize={[14, 15, 16]}
          mb={6}
          fontWeight="300"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAlign="center"
          letterSpacing="1px"
          style={{
            opacity: nameOpacity,
            y: nameY,
            scale: nameScale,
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
          <Divider borderColor="#e5e5e5" borderWidth="1px" w="80px" />
        </MotionBox>

        {/* Proceed button - Stage 3 (appears on third scroll) */}
        <MotionBox
          style={{
            opacity: buttonOpacity,
            y: buttonY,
            scale: buttonScale,
          }}
        >
          <Button
            size="lg"
            colorScheme="gray"
            variant="outline"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="300"
            px={10}
            py={6}
            fontSize={14}
            borderRadius="0"
            borderColor="#1a1a1a"
            color="#1a1a1a"
            letterSpacing="2px"
            textTransform="uppercase"
            _hover={{
              bg: "#1a1a1a",
              color: "#ffffff",
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            onClick={() => router.push("/portfolio-tab")}
            transition="all 0.2s ease"
          >
            Enter Portfolio
          </Button>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default FrontPage;
