import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Text,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const projects = [
  {
    title: "Justine Cargo Services Integration System - WEB",
    description: `Developed a MERN stack system to automate and streamline company operations. The system includes modules for employee profiles, truck status tracking, delivery management, truck renewal scheduling, waybill verification, fuel monitoring, automated payroll, billing generation, and report creation. This reduces manual work, improves data accuracy, and helps the company manage information more efficiently.`,
    github: "https://github.com/justines-cargo-services/JCS-System",
    img: "/LOGO.png",
  },
  {
    title: "Justine Cargo Services Integration System - Desktop Application",
    description: `Developed a C#-based desktop application to automate and streamline company operations. The system features modules for managing employee profiles, tracking truck statuses, handling deliveries, scheduling truck renewals, verifying waybills, monitoring fuel consumption, automating payroll, generating billing statements, and producing detailed reports. It also integrates with other internal systems to enable smooth data exchange and centralized control. This reduces manual processes, improves data accuracy, and enhances overall operational efficiency.`,
    github: "https://github.com/scardogs/justines-cargo-services-desktop-app",
    img: "/LOGO.png",
  },
];

const ProjectsSection = ({ sectionRef, sectionVariant }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <MotionBox
      ref={sectionRef}
      id="projects"
      minH="200px"
      mb={[10, 16]}
      p={[5, 10]}
      bg="#272727"
      borderRadius="md"
      border="1px solid #232323"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.3 }}
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
        Projects
      </Heading>
      <Divider borderColor="#232323" mb={4} />
      <Box display="flex" flexDirection="column" gap={8}>
        {projects.map((project, idx) => (
          <Box
            key={project.title}
            display="flex"
            flexDirection={["column", "row"]}
            alignItems="center"
            justifyContent="center"
            gap={[4, 8, 12]}
            p={[4, 6]}
            bg="#232323"
            borderRadius="md"
            border="1px solid #e2b714"
            boxShadow="0 2px 16px 0 rgba(226,183,20,0.08)"
          >
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: "0 8px 32px 0 rgba(226,183,20,0.18)",
                borderColor: "#e2b714",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                minW="120px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <img
                  src={project.img}
                  alt={project.title + " Logo"}
                  style={{
                    width: "110px",
                    height: "110px",
                    objectFit: "contain",
                    background: "#191919",
                    borderRadius: "8px",
                    marginBottom: 16,
                    border: "1px solid #e2b714",
                  }}
                />
              </Box>
            </motion.div>
            <Box textAlign={["center", "left"]} flex={1}>
              <Text
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                fontSize={18}
                fontWeight="bold"
                mb={2}
              >
                {project.title}
              </Text>
              <Button
                onClick={() => handleToggle(idx)}
                colorScheme="yellow"
                variant="outline"
                borderColor="#e2b714"
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                mb={2}
                mt={2}
                size="md"
                _hover={{
                  bg: "#191919",
                  color: "#e2b714",
                  borderColor: "#e2b714",
                }}
              >
                {openIndex === idx ? "Hide Description" : "Show Description"}
              </Button>
              <Collapse in={openIndex === idx} animateOpacity>
                <Box
                  mt={2}
                  p={4}
                  bg="#232323"
                  borderRadius="md"
                  border="1px solid #e2b714"
                  color="#fff"
                  fontSize={15}
                  textAlign="left"
                  maxW={500}
                  fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                >
                  {project.description}
                  <Text
                    as="span"
                    color="#fff"
                    fontSize={16}
                    mb={2}
                    display="block"
                  >
                    GitHUb:{" "}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#e2b714", textDecoration: "underline" }}
                    >
                      Link
                    </a>
                  </Text>
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
