import React, { useState, useEffect, useMemo } from "react";
import { Box, Tooltip, Text, Divider, Heading, Skeleton } from "@chakra-ui/react";
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
      mb={[10, 16]}
      p={[6, 10, 12]}
      bg="#272727"
      borderRadius="2xl"
      border="2px solid #232323"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
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
      <Heading
        as="h2"
        size="lg"
        color="#e2b714"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        mb={4}
        fontWeight="bold"
        letterSpacing="2px"
      >
        Skills
      </Heading>

      <Box mb={8}>
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
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
        {loading ? (
          /* Loading State - Animated Skill Cards */
          Array.from({ length: 8 }).map((_, idx) => (
            <Box
              key={idx}
              p={5}
              bg="#232323"
              borderRadius="xl"
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
        ) : (
          technologies.map((tech, idx) => (
          <Tooltip
            key={tech.name}
            label={tech.name}
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Box
              p={5}
              bg="#232323"
              borderRadius="xl"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minH="140px"
              minW="120px"
              cursor="pointer"
              _hover={{
                boxShadow: "0 8px 24px 0 rgba(226,183,20,0.2)",
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
                  borderRadius: "12px",
                  padding: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Text
                color="#e2b714"
                fontSize={["sm", "md"]}
                fontWeight="bold"
                textAlign="center"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                mt={2}
                letterSpacing="0.5px"
              >
                {tech.name}
              </Text>
            </Box>
          </Tooltip>
        ))
        )}
      </Box>
    </MotionBox>
  );
};

export default SkillsSection;
