import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Avatar,
  Text,
  Button,
  Heading,
  Divider,
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

// ─── Cursor Sparkle Particles ────────────────────────────────────────
const CursorParticles = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      // Spawn particles
      for (let i = 0; i < 2; i++) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          life: 1,
          size: Math.random() * 3 + 1,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.size *= 0.98;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.4})`;
        ctx.fill();
        return true;
      });

      animationFrame.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame.current);
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
        zIndex: 10,
      }}
    />
  );
};

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

  return (
    <Box minH="200vh" bg="#ffffff" position="relative">
      {/* Cursor sparkle particles */}
      <CursorParticles />

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

      {/* Geometric shapes — animated floating & rotating */}
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
        sx={{
          animation: "floatRotate1 20s ease-in-out infinite",
          "@keyframes floatRotate1": {
            "0%": { transform: "rotate(45deg) translateY(0px)" },
            "50%": { transform: "rotate(55deg) translateY(-20px)" },
            "100%": { transform: "rotate(45deg) translateY(0px)" },
          },
        }}
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
        sx={{
          animation: "floatRotate2 15s ease-in-out infinite",
          "@keyframes floatRotate2": {
            "0%": { transform: "translateY(0px) scale(1)" },
            "50%": { transform: "translateY(-15px) scale(1.05)" },
            "100%": { transform: "translateY(0px) scale(1)" },
          },
        }}
      />
      {/* Third floating shape */}
      <Box
        position="fixed"
        top="60%"
        right="25%"
        width="150px"
        height="150px"
        border="1px solid #e5e5e5"
        zIndex="0"
        opacity="0.15"
        sx={{
          animation: "floatRotate3 18s ease-in-out infinite",
          "@keyframes floatRotate3": {
            "0%": { transform: "rotate(0deg) translateX(0px)" },
            "50%": { transform: "rotate(30deg) translateX(15px)" },
            "100%": { transform: "rotate(0deg) translateX(0px)" },
          },
        }}
      />

      {/* Scroll indicator with animated dotted trail */}
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
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <Text fontSize="inherit" letterSpacing="inherit">Scroll</Text>
          {/* Animated dots trail */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <Box w="3px" h="3px" borderRadius="50%" bg="#999999" />
            </motion.div>
          ))}
        </Box>
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
          <Avatar
            src={aboutData?.profileImage}
            boxSize={["200px", "240px", "260px"]}
            border="1px solid #e5e5e5"
            name={aboutData?.name || "John Michael T. Escarlan"}
            showBorder={false}
            bg="#f5f5f5"
          />
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

        {/* Proceed button - Stage 3 with pulsing border */}
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
            sx={{
              animation: "pulsingBorder 2s ease-in-out infinite",
              "@keyframes pulsingBorder": {
                "0%": { boxShadow: "0 0 0 0 rgba(26, 26, 26, 0.4)" },
                "50%": { boxShadow: "0 0 0 8px rgba(26, 26, 26, 0)" },
                "100%": { boxShadow: "0 0 0 0 rgba(26, 26, 26, 0)" },
              },
            }}
          >
            Enter Portfolio
          </Button>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default FrontPage;
