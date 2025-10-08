import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  const fullText = useMemo(
    () =>
      "Passionate about building reliable, efficient, and user-friendly systems. Skilled in solving technical challenges, improving processes, and delivering high-quality solutions. Eager to learn new technologies and contribute to impactful projects.",
    []
  );

  const languagesFullText = useMemo(
    () => "English (Intermediate)\nTagalog (Fluent)\nHiligaynon (Fluent)",
    []
  );
  const educationFullText = useMemo(
    () => "Bachelor of Science in Information Technology",
    []
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleLanguagesToggle = useCallback(() => {
    setShowLanguages((prev) => !prev);
  }, []);

  const handleEducationToggle = useCallback(() => {
    setShowEducation((prev) => !prev);
  }, []);

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
      transition={{
        duration: 0.4,
      }}
      _hover={{
        borderColor: "#e2b714",
        boxShadow: "0 8px 20px 0 rgba(226,183,20,0.15)",
      }}
      sx={{
        transition: "all 0.3s ease",
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

      <Heading
        as="h2"
        size="lg"
        color="#e2b714"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        mb={4}
        fontWeight="bold"
        letterSpacing="2px"
      >
        About Me
      </Heading>

      <Box mb={6}>
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
      </Box>

      <Box
        display="flex"
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
        justifyContent="center"
        gap={[8, 12, 16]}
        w="100%"
        maxW={800}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          w={["100%", "auto"]}
        >
          <Box position="relative">
            <Skeleton
              isLoaded={imageLoaded}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="full"
              boxSize={["200px", "240px", "280px"]}
              fadeDuration={0.4}
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
                transition="opacity 0.3s ease-in-out"
                showBorder={false}
                bg="transparent"
                boxShadow="0 4px 16px rgba(226,183,20,0.2)"
              />
            </Skeleton>
          </Box>
        </Box>

        <Box
          flex={1}
          textAlign={["center", "left"]}
          minW={0}
          w={["100%", "auto"]}
        >
          <Tooltip
            label="John Michael T. Escarlan"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            hasArrow
          >
            <Text
              color="#fff"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontSize={[20, 24, 26]}
              mb={3}
              fontWeight="bold"
            >
              John Michael T. Escarlan
            </Text>
          </Tooltip>

          <Text
            color="#f7d794"
            textAlign={["center", "left"]}
            fontSize={[15, 16, 17]}
            maxW={600}
            mt={3}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            lineHeight="1.8"
          >
            {fullText}
          </Text>

          {/* Languages Section */}
          <Box mt={8}>
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
              <Box
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
              >
                {languagesFullText}
              </Box>
            </Collapse>
          </Box>

          {/* Educational Attainment Section */}
          <Box mt={6}>
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
              <Box
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
              >
                {educationFullText}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default AboutSection;
