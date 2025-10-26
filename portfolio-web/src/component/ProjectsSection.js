import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  Collapse,
  Text,
  Divider,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const ProjectsSection = ({ sectionRef, sectionVariant }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchProjects();
  }, []);

  const handleToggle = useCallback((idx) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  }, []);

  return (
    <MotionBox
      ref={sectionRef}
      id="projects"
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
        Projects
      </Heading>

      <Box mb={8}>
        <Divider borderColor="#e5e5e5" borderWidth="1px" w="60px" />
      </Box>

      <Box display="flex" flexDirection="column" gap={10}>
        {projects.map((project, idx) => (
          <Box
            key={project.title}
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
            justifyContent="center"
            gap={[6, 10, 14]}
            p={[6, 8, 10]}
            bg="#ffffff"
            borderRadius="0"
            border="1px solid #e5e5e5"
            _hover={{
              borderColor: "#1a1a1a",
            }}
            transition="all 0.3s ease"
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box
                minW="140px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <img
                  src={project.img}
                  alt={project.title + " Logo"}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "contain",
                    background: "white",
                    borderRadius: "0",
                    padding: "12px",
                    border: "1px solid #e5e5e5",
                  }}
                />
              </Box>
            </Box>

            <Box textAlign={["center", "left"]} flex={1}>
              <Text
                color="#1a1a1a"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize={[16, 18, 20]}
                fontWeight="300"
                mb={3}
                letterSpacing="1px"
              >
                {project.title}
              </Text>

              <Box>
                <Button
                  onClick={() => handleToggle(idx)}
                  colorScheme="gray"
                  variant="outline"
                  borderColor="#1a1a1a"
                  color="#1a1a1a"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  mb={3}
                  mt={3}
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
                  _active={{
                    transform: "translateY(0px)",
                  }}
                  transition="all 0.2s"
                >
                  {openIndex === idx ? "Hide Description" : "Show Description"}
                </Button>
              </Box>

              <Collapse in={openIndex === idx} animateOpacity>
                <Box
                  mt={4}
                  p={6}
                  bg="#f9f9f9"
                  borderRadius="0"
                  border="1px solid #e5e5e5"
                  color="#666666"
                  fontSize={15}
                  textAlign="left"
                  maxW={500}
                  fontFamily="system-ui, -apple-system, sans-serif"
                  lineHeight="1.8"
                  fontWeight="300"
                >
                  {project.description}
                  <Text
                    as="span"
                    color="#1a1a1a"
                    fontSize={14}
                    mb={3}
                    display="block"
                    mt={4}
                    fontWeight="300"
                    letterSpacing="1px"
                  >
                    GitHub:{" "}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#666666",
                        textDecoration: "none",
                        borderBottom: "1px solid #1a1a1a",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#1a1a1a";
                        e.target.style.borderBottomColor = "#1a1a1a";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#666666";
                        e.target.style.borderBottomColor = "#1a1a1a";
                      }}
                    >
                      View Project
                    </a>
                  </Text>
                  {project.website && (
                    <Text
                      as="span"
                      color="#1a1a1a"
                      fontSize={14}
                      mb={3}
                      display="block"
                      mt={2}
                      fontWeight="300"
                      letterSpacing="1px"
                    >
                      Website:{" "}
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#666666",
                          textDecoration: "none",
                          borderBottom: "1px solid #1a1a1a",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#1a1a1a";
                          e.target.style.borderBottomColor = "#1a1a1a";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#666666";
                          e.target.style.borderBottomColor = "#1a1a1a";
                        }}
                      >
                        View Website
                      </a>
                    </Text>
                  )}
                </Box>
              </Collapse>
            </Box>
          </Box>
        ))}
      </Box>
    </MotionBox>
  );
};

export default ProjectsSection;
