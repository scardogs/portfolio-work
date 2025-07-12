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
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

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
      p={[6, 10, 12]}
      bg="#272727"
      borderRadius="2xl"
      border="2px solid #232323"
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
        boxShadow:
          "0 12px 40px 0 rgba(226,183,20,0.15), 0 0 0 1px rgba(226,183,20,0.1)",
        borderColor: "#e2b714",
      }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: "spring",
        stiffness: 300,
      }}
      backdropFilter="blur(10px)"
      _before={{
        content: '""',
        position: "absolute",
        top: "-2px",
        left: "-2px",
        right: "-2px",
        bottom: "-2px",
        background: "linear-gradient(45deg, #e2b714, #f7d794, #e2b714)",
        borderRadius: "2xl",
        zIndex: "-1",
        opacity: 0.1,
      }}
    >
      {/* Mute/Unmute Button - Mobile Only */}
      <IconButton
        aria-label={isMuted ? "Unmute" : "Mute"}
        icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        onClick={() => setIsMuted((m) => !m)}
        position="absolute"
        top={3}
        left={3}
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

      <MotionHeading
        as="h2"
        size="lg"
        color="#e2b714"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        mb={4}
        fontWeight="bold"
        letterSpacing="2px"
        textShadow="0 2px 4px rgba(226,183,20,0.3)"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        About Me
      </MotionHeading>

      <MotionBox
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        mb={6}
      >
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
      </MotionBox>

      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
        justifyContent="center"
        gap={[8, 12, 16]}
        w="100%"
        maxW={800}
      >
        <MotionBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          w={["100%", "auto"]}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box position="relative">
            <Box
              position="relative"
              /* Removed the rotating gradient border */
            >
              <Skeleton
                isLoaded={imageLoaded}
                startColor="#232323"
                endColor="#e2b714"
                borderRadius="full"
                boxSize={["200px", "240px", "280px"]}
                fadeDuration={0.8}
              >
                <Avatar
                  src="/profile.png"
                  name="John Michael T. Escarlan"
                  boxSize={["200px", "240px", "280px"]}
                  border="3px solid #e2b714"
                  mb={[4, 0]}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  opacity={imageLoaded ? 1 : 0}
                  transition="opacity 0.5s ease-in-out"
                  showBorder={false}
                  bg="transparent"
                  boxShadow="0 8px 32px rgba(226,183,20,0.2)"
                />
              </Skeleton>
            </Box>
          </Box>
        </MotionBox>

        <MotionBox
          flex={1}
          textAlign={["center", "left"]}
          minW={0}
          w={["100%", "auto"]}
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Tooltip
            label="John Michael T. Escarlan"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            hasArrow
          >
            <MotionText
              color="#fff"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontSize={[20, 24, 26]}
              mb={3}
              fontWeight="bold"
              textShadow="0 2px 4px rgba(255,255,255,0.1)"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              John Michael T. Escarlan
            </MotionText>
          </Tooltip>

          <MotionText
            color="#f7d794"
            textAlign={["center", "left"]}
            fontSize={[15, 16, 17]}
            maxW={600}
            mt={3}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            lineHeight="1.8"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {displayText}
            <span style={{ animation: "blink 1s infinite" }}>|</span>
          </MotionText>

          {/* Languages Section */}
          <MotionBox
            mt={8}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              onClick={handleLanguagesToggle}
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              size="md"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              transition="all 0.2s"
            >
              {showLanguages ? "Hide Languages" : "Show Languages"}
            </Button>
            <Collapse in={showLanguages} animateOpacity>
              <MotionBox
                mt={4}
                p={5}
                bg="#232323"
                borderRadius="xl"
                border="1px solid #e2b714"
                color="#fff"
                fontSize={15}
                textAlign="left"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                whiteSpace="pre-line"
                boxShadow="0 4px 16px rgba(226,183,20,0.1)"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {languagesText}
                <span style={{ animation: "blink 1s infinite" }}>|</span>
              </MotionBox>
            </Collapse>
          </MotionBox>

          {/* Educational Attainment Section */}
          <MotionBox
            mt={6}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Button
              onClick={handleEducationToggle}
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              size="md"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              transition="all 0.2s"
            >
              {showEducation ? "Hide Education" : "Show Education"}
            </Button>
            <Collapse in={showEducation} animateOpacity>
              <MotionBox
                mt={4}
                p={5}
                bg="#232323"
                borderRadius="xl"
                border="1px solid #e2b714"
                color="#fff"
                fontSize={15}
                textAlign="left"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                boxShadow="0 4px 16px rgba(226,183,20,0.1)"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {educationText}
                <span style={{ animation: "blink 1s infinite" }}>|</span>
              </MotionBox>
            </Collapse>
          </MotionBox>
        </MotionBox>
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
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </MotionBox>
  );
};

export default AboutSection;
