import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Tooltip,
  Text,
  Divider,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SkillsSection = ({ sectionRef, sectionVariant }) => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        if (data.success) {
          setTechnologies(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchSkills();
  }, []);

  return (
    <MotionBox
      ref={sectionRef}
      id="skills"
      minH="200px"
      mb={[8, 12]}
      p={[6, 10, 12]}
      bg="#ffffff"
      borderRadius="0"
      border="1px solid #e5e5e5"
      fontFamily="system-ui, -apple-system, sans-serif"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
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
        Skills
      </Heading>

      <Box mb={8}>
        <Divider borderColor="#e5e5e5" borderWidth="1px" w="60px" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={[
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={[5, 7, 9]}
        mt={8}
        px={[2, 4]}
      >
        {loading
          ? /* Loading State - Animated Skill Cards */
            Array.from({ length: 8 }).map((_, idx) => (
              <Box
                key={idx}
                p={5}
                bg="#ffffff"
                borderRadius="0"
                border="1px solid #e5e5e5"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="140px"
                minW="120px"
              >
                <Skeleton
                  width="55px"
                  height="55px"
                  borderRadius="12px"
                  mb={3}
                  startColor="#232323"
                  endColor="#e2b714"
                  fadeDuration={1}
                  speed={0.8}
                />
                <Skeleton
                  height="20px"
                  width="80%"
                  borderRadius="md"
                  startColor="#232323"
                  endColor="#e2b714"
                  fadeDuration={1}
                  speed={0.8}
                />
              </Box>
            ))
          : technologies.map((tech, idx) => (
              <Tooltip
                key={tech.name}
                label={tech.name}
                hasArrow
                bg="#1a1a1a"
                color="#ffffff"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                <Box
                  p={5}
                  bg="#ffffff"
                  borderRadius="0"
                  border="1px solid #e5e5e5"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minH="140px"
                  minW="120px"
                  cursor="pointer"
                  _hover={{
                    borderColor: "#1a1a1a",
                  }}
                  transition="all 0.3s ease"
                >
                  <img
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    style={{
                      width: "55px",
                      height: "55px",
                      objectFit: "contain",
                      marginBottom: "12px",
                      backgroundColor: "white",
                      borderRadius: "0",
                      padding: "10px",
                      border: "1px solid #e5e5e5",
                    }}
                  />
                  <Text
                    color="#1a1a1a"
                    fontSize={["sm", "md"]}
                    fontWeight="300"
                    textAlign="center"
                    fontFamily="system-ui, -apple-system, sans-serif"
                    mt={2}
                    letterSpacing="0.5px"
                  >
                    {tech.name}
                  </Text>
                </Box>
              </Tooltip>
            ))}
      </Box>
    </MotionBox>
  );
};

export default SkillsSection;
