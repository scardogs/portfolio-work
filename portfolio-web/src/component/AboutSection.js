import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Tooltip,
  Text,
  Divider,
  Heading,
  Skeleton,
  Button,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const MotionBox = motion(Box);

const AboutSection = ({ sectionRef, sectionVariant, isMuted, setIsMuted }) => {
  const [displayText, setDisplayText] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const [languagesText, setLanguagesText] = useState("");
  const [educationText, setEducationText] = useState("");

  const fullText =
    "I have a passion for building reliable and efficient systems. I enjoy solving technical challenges and finding ways to improve processes and make technology work better. My goal is to create user-friendly solutions that help people accomplish their tasks more easily. I am always eager to learn new skills, explore new technologies, and contribute to meaningful projects. I am committed to delivering high-quality work and continuously growing in the field of technology.";

  const languagesFullText =
    "English (Intermediate)\nTagalog (Fluent)\nHiligaynon (Fluent)";
  const educationFullText = "Bachelor of Science in Information Technology";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20); // Speed of typing

    return () => clearInterval(timer);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Stop loading state even if image fails
  };

  const handleLanguagesToggle = () => {
    if (!showLanguages) {
      setLanguagesText("");
      let index = 0;
      const timer = setInterval(() => {
        if (index < languagesFullText.length) {
          setLanguagesText(languagesFullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
    }
    setShowLanguages(!showLanguages);
  };

  const handleEducationToggle = () => {
    if (!showEducation) {
      setEducationText("");
      let index = 0;
      const timer = setInterval(() => {
        if (index < educationFullText.length) {
          setEducationText(educationFullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
    }
    setShowEducation(!showEducation);
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
      position="relative"
      whileHover={{
        y: -8,
        boxShadow: "0 8px 32px 0 rgba(226,183,20,0.18)",
        borderColor: "#e2b714",
      }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: "spring",
        stiffness: 300,
      }}
    >
      {/* Mute/Unmute Button - Mobile Only */}
      <IconButton
        aria-label={isMuted ? "Unmute" : "Mute"}
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        onClick={() => setIsMuted((m) => !m)}
        position="absolute"
        top={2}
        left={2}
        zIndex={10}
        colorScheme="yellow"
        variant="ghost"
        size="md"
        fontSize="xl"
        display={["flex", "flex", "none"]}
        bg="#232323"
        border="1px solid #e2b714"
        _hover={{
          bg: "#191919",
          transform: "scale(1.05)",
        }}
        transition="all 0.2s"
      />

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
      <Divider borderColor="#232323" mb={4} />
      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems="flex-start"
        justifyContent="center"
        gap={[6, 10, 16]}
        w="100%"
        maxW={800}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          flexShrink={0}
        >
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
        <Box flex={1} textAlign={["center", "left"]} minW={0}>
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

          {/* Languages Section */}
          <Box mt={6}>
            <Button
              onClick={handleLanguagesToggle}
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              size="sm"
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
              }}
            >
              {showLanguages ? "Hide Languages" : "Show Languages"}
            </Button>
            <Collapse in={showLanguages} animateOpacity>
              <Box
                mt={3}
                p={4}
                bg="#232323"
                borderRadius="md"
                border="1px solid #e2b714"
                color="#fff"
                fontSize={15}
                textAlign="left"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                whiteSpace="pre-line"
              >
                {languagesText}
                <span style={{ animation: "blink 1s infinite" }}>|</span>
              </Box>
            </Collapse>
          </Box>

          {/* Educational Attainment Section */}
          <Box mt={4}>
            <Button
              onClick={handleEducationToggle}
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              size="sm"
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
              }}
            >
              {showEducation ? "Hide Education" : "Show Education"}
            </Button>
            <Collapse in={showEducation} animateOpacity>
              <Box
                mt={3}
                p={4}
                bg="#232323"
                borderRadius="md"
                border="1px solid #e2b714"
                color="#fff"
                fontSize={15}
                textAlign="left"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              >
                {educationText}
                <span style={{ animation: "blink 1s infinite" }}>|</span>
              </Box>
            </Collapse>
          </Box>
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
