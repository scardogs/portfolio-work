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
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/about");
        const data = await response.json();
        if (data.success) {
          setAboutData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      } finally {
        setTimeout(() => setLoading(false), 500); // Smooth transition
      }
    };

    fetchAboutData();
  }, []);

  const fullText = useMemo(
    () =>
      aboutData?.description ||
      "Passionate about building reliable, efficient, and user-friendly systems. Skilled in solving technical challenges, improving processes, and delivering high-quality solutions. Eager to learn new technologies and contribute to impactful projects.",
    [aboutData]
  );

  const languagesFullText = useMemo(
    () =>
      aboutData?.languages?.join("\n") ||
      "English (Intermediate)\nTagalog (Fluent)\nHiligaynon (Fluent)",
    [aboutData]
  );
  const educationFullText = useMemo(
    () =>
      aboutData?.education || "Bachelor of Science in Information Technology",
    [aboutData]
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
      mb={[8, 12]}
      p={[6, 10, 12]}
      bg="#ffffff"
      borderRadius="0"
      border="1px solid #e5e5e5"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      fontFamily="system-ui, -apple-system, sans-serif"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      position="relative"
      transition={{
        duration: 0.4,
      }}
      _hover={{
        borderColor: "#1a1a1a",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
      sx={{
        transition: "all 0.3s ease",
      }}
    >
      <Heading
        as="h2"
        size="lg"
        color="#1a1a1a"
        fontFamily="system-ui, -apple-system, sans-serif"
        mb={4}
        fontWeight="300"
        letterSpacing="4px"
        textTransform="uppercase"
        fontSize="14px"
      >
        About Me
      </Heading>

      <Box mb={8}>
        <Divider borderColor="#e5e5e5" borderWidth="1px" w="60px" />
      </Box>

      {loading ? (
        /* Loading State */
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
            <Skeleton
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="full"
              boxSize={["200px", "240px", "280px"]}
              fadeDuration={1}
            />
          </Box>
          <Box
            flex={1}
            textAlign={["center", "left"]}
            minW={0}
            w={["100%", "auto"]}
          >
            <Skeleton
              height="30px"
              width="60%"
              mb={3}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Skeleton
              height="20px"
              width="40%"
              mb={6}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Skeleton
              height="15px"
              width="100%"
              mb={2}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Skeleton
              height="15px"
              width="100%"
              mb={2}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Skeleton
              height="15px"
              width="90%"
              mb={2}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Skeleton
              height="15px"
              width="85%"
              mb={6}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="md"
            />
            <Box
              display="flex"
              gap={4}
              justifyContent={["center", "flex-start"]}
              flexWrap="wrap"
              mt={6}
            >
              <Skeleton
                height="40px"
                width="120px"
                startColor="#232323"
                endColor="#e2b714"
                borderRadius="md"
              />
              <Skeleton
                height="40px"
                width="120px"
                startColor="#232323"
                endColor="#e2b714"
                borderRadius="md"
              />
            </Box>
          </Box>
        </Box>
      ) : (
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
                  src={aboutData?.profileImage || "/profile.png"}
                  name={aboutData?.name || "John Michael T. Escarlan"}
                  boxSize={["200px", "240px", "260px"]}
                  border="1px solid #e5e5e5"
                  mb={[4, 0]}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  opacity={imageLoaded ? 1 : 0}
                  transition="opacity 0.3s ease-in-out"
                  showBorder={false}
                  bg="#f5f5f5"
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
              label={aboutData?.name || "John Michael T. Escarlan"}
              fontFamily="system-ui, -apple-system, sans-serif"
              hasArrow
            >
              <Text
                color="#1a1a1a"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize={[20, 24, 26]}
                mb={3}
                fontWeight="300"
              >
                {aboutData?.name || "John Michael T. Escarlan"}
              </Text>
            </Tooltip>

            <Text
              color="#666666"
              textAlign={["center", "left"]}
              fontSize={[15, 16, 17]}
              maxW={600}
              mt={3}
              fontFamily="system-ui, -apple-system, sans-serif"
              lineHeight="1.8"
              fontWeight="300"
            >
              {fullText}
            </Text>

            {/* Languages Section */}
            <Box mt={8}>
              <Button
                onClick={handleLanguagesToggle}
                colorScheme="gray"
                variant="outline"
                borderColor="#1a1a1a"
                color="#1a1a1a"
                fontFamily="system-ui, -apple-system, sans-serif"
                size="md"
                fontWeight="300"
                letterSpacing="2px"
                textTransform="uppercase"
                borderRadius="0"
                _hover={{
                  bg: "#1a1a1a",
                  color: "#ffffff",
                  borderColor: "#1a1a1a",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
              >
                {showLanguages ? "Hide Languages" : "Show Languages"}
              </Button>
              <Collapse in={showLanguages} animateOpacity>
                <Box
                  mt={4}
                  p={5}
                  bg="#f9f9f9"
                  borderRadius="0"
                  border="1px solid #e5e5e5"
                  color="#666666"
                  fontSize={15}
                  textAlign="left"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  whiteSpace="pre-line"
                  fontWeight="300"
                >
                  {languagesFullText}
                </Box>
              </Collapse>
            </Box>

            {/* Educational Attainment Section */}
            <Box mt={6}>
              <Button
                onClick={handleEducationToggle}
                colorScheme="gray"
                variant="outline"
                borderColor="#1a1a1a"
                color="#1a1a1a"
                fontFamily="system-ui, -apple-system, sans-serif"
                size="md"
                fontWeight="300"
                letterSpacing="2px"
                textTransform="uppercase"
                borderRadius="0"
                _hover={{
                  bg: "#1a1a1a",
                  color: "#ffffff",
                  borderColor: "#1a1a1a",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
              >
                {showEducation ? "Hide Education" : "Show Education"}
              </Button>
              <Collapse in={showEducation} animateOpacity>
                <Box
                  mt={4}
                  p={5}
                  bg="#f9f9f9"
                  borderRadius="0"
                  border="1px solid #e5e5e5"
                  color="#666666"
                  fontSize={15}
                  textAlign="left"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fontWeight="300"
                >
                  {educationFullText}
                </Box>
              </Collapse>
            </Box>
          </Box>
        </Box>
      )}
    </MotionBox>
  );
};

export default AboutSection;
