import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Tooltip,
  Text,
  Divider,
  Heading,
  IconButton,
  Skeleton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const MotionBox = motion(Box);

const AboutSection = ({ sectionRef, isMuted, setIsMuted, sectionVariant }) => {
  const [displayText, setDisplayText] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fullText =
    "I have a passion for building reliable and efficient systems. I enjoy solving technical challenges and finding ways to improve processes and make technology work better. My goal is to create user-friendly solutions that help people accomplish their tasks more easily. I am always eager to learn new skills, explore new technologies, and contribute to meaningful projects. I am committed to delivering high-quality work and continuously growing in the field of technology.";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 5); // Speed of typing

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Stop loading state even if image fails
  };

  return (
    <MotionBox
      ref={sectionRef}
      id="about"
      minH="200px"
      mb={[10, 16]}
      p={[5, 10]}
      bg="#272727"
      borderRadius="md"
      border="1px solid #232323"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Heading
        as="h2"
        size="md"
        color="#e2b714"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        mb={2}
        fontWeight="bold"
        letterSpacing={1}
      >
        About Me
      </Heading>
      {/* Mute/Unmute Button in About upper left */}
      <IconButton
        aria-label={isMuted ? "Unmute" : "Mute"}
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        onClick={() => setIsMuted((m) => !m)}
        position="absolute"
        top={10}
        left={2}
        zIndex={10}
        colorScheme="yellow"
        variant="ghost"
        size="lg"
        fontSize="2xl"
      />
      <Divider borderColor="#232323" mb={4} />
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems="center"
        justifyContent="center"
        gap={[6, 10, 16]}
        w="100%"
        maxW={800}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box position="relative">
            <Skeleton
              isLoaded={imageLoaded}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="full"
              boxSize={["180px", "220px", "260px"]}
              fadeDuration={0.8}
            >
              <Avatar
                src="/profile.png"
                name="John Michael T. Escarlan"
                boxSize={["180px", "220px", "260px"]}
                border="2px solid #e2b714"
                mb={[4, 0]}
                onLoad={handleImageLoad}
                onError={handleImageError}
                opacity={imageLoaded ? 1 : 0}
                transition="opacity 0.5s ease-in-out"
                showBorder={false}
                bg="transparent"
              />
            </Skeleton>
          </Box>
        </Box>
        <Box flex={1} textAlign={["center", "left"]}>
          <Tooltip
            label="John Michael T. Escarlan"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            hasArrow
          >
            <Text
              color="#fff"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontSize={22}
              mb={2}
              fontWeight="bold"
            >
              John Michael T. Escarlan
            </Text>
          </Tooltip>
          <Text
            color="#fff"
            textAlign={["center", "left"]}
            fontSize={16}
            maxW={600}
            mt={2}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            {displayText}
            <span style={{ animation: "blink 1s infinite" }}>|</span>
          </Text>
        </Box>
      </Box>
      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </MotionBox>
  );
};

export default AboutSection;
