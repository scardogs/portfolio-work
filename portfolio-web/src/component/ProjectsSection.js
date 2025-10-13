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
        Projects
      </Heading>

      <Box mb={8}>
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
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
            bg="#232323"
            borderRadius="xl"
            boxShadow="0 4px 20px 0 rgba(226,183,20,0.1)"
            _hover={{
              boxShadow: "0 8px 24px 0 rgba(226,183,20,0.2)",
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
                    borderRadius: "12px",
                    padding: "12px",
                    border: "2px solid #e2b714",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Box>

            <Box textAlign={["center", "left"]} flex={1}>
              <Text
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                fontSize={[16, 18, 20]}
                fontWeight="bold"
                mb={3}
                letterSpacing="1px"
              >
                {project.title}
              </Text>

              <Box>
                <Button
                  onClick={() => handleToggle(idx)}
                  colorScheme="yellow"
                  variant="outline"
                  borderColor="#e2b714"
                  color="#e2b714"
                  fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  mb={3}
                  mt={3}
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
                  bg="#1a1a1a"
                  borderRadius="xl"
                  border="1px solid #e2b714"
                  color="#fff"
                  fontSize={15}
                  textAlign="left"
                  maxW={500}
                  fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  lineHeight="1.8"
                  boxShadow="0 4px 16px rgba(226,183,20,0.1)"
                >
                  {project.description}
                  <Text
                    as="span"
                    color="#f7d794"
                    fontSize={16}
                    mb={3}
                    display="block"
                    mt={4}
                    fontWeight="bold"
                    letterSpacing="1px"
                  >
                    GitHub:{" "}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#e2b714",
                        textDecoration: "underline",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "#f7d794";
                        e.target.style.textShadow =
                          "0 2px 4px rgba(226,183,20,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "#e2b714";
                        e.target.style.textShadow = "none";
                      }}
                    >
                      View Project
                    </a>
                  </Text>
                  {project.website && (
                    <Text
                      as="span"
                      color="#f7d794"
                      fontSize={16}
                      mb={3}
                      display="block"
                      mt={2}
                      fontWeight="bold"
                      letterSpacing="1px"
                    >
                      Website:{" "}
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#e2b714",
                          textDecoration: "underline",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "#f7d794";
                          e.target.style.textShadow =
                            "0 2px 4px rgba(226,183,20,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "#e2b714";
                          e.target.style.textShadow = "none";
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
