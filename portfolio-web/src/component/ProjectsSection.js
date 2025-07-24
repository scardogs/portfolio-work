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
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const projects = [
  {
    title: "StoryType",
    description: `Built a MERN stack web app (StoryType) that combines typing practice with creative storytelling—users type to progress through interactive storylines across genres like fantasy, mystery, and sci-fi. Features include real-time typing feedback, progress tracking, and genre selection.`,
    github: "https://github.com/scardogs/storytype-web",
    img: "/storytype.png",
  },
  {
    title: "Justine Cargo Services Integration System - WEB",
    description: `Developed a MERN stack system to automate and streamline company operations. The system includes modules for employee profiles, truck status tracking, delivery management, truck renewal scheduling, waybill verification, fuel monitoring, automated payroll, billing generation, and report creation. This reduces manual work, improves data accuracy, and helps the company manage information more efficiently.`,
    github: "https://github.com/scardogs/JustinesCargoServices-Web",
    img: "/LOGO.png",
  },
  {
    title: "Justine Cargo Services Integration System - Desktop Application",
    description: `Developed a C#-based desktop application to automate and streamline company operations. The system features modules for managing employee profiles (with integrated biometric login and attendance tracking), tracking truck statuses, handling deliveries, scheduling truck renewals, verifying waybills, monitoring fuel consumption, automating payroll, generating billing statements, and producing detailed reports. It also integrates with other internal systems to enable smooth data exchange and centralized control. This reduces manual processes, improves data accuracy, and enhances overall operational efficiency.`,
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
      p={[6, 10, 12]}
      bg="#272727"
      borderRadius="2xl"
      border="2px solid #232323"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
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
        Projects
      </MotionHeading>

      <MotionBox
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        mb={8}
      >
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
      </MotionBox>

      <MotionBox
        display="flex"
        flexDirection="column"
        gap={10}
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {projects.map((project, idx) => (
          <MotionBox
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{
              y: -8,
              boxShadow: "0 12px 32px 0 rgba(226,183,20,0.2)",
            }}
            transition={{
              duration: 0.6,
              delay: 0.1 * (idx + 1),
              type: "spring",
              stiffness: 300,
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 8px 24px 0 rgba(226,183,20,0.25)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                minW="140px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "-4px",
                  left: "-4px",
                  right: "-4px",
                  bottom: "-4px",
                  background:
                    "linear-gradient(45deg, #e2b714, #f7d794, #e2b714)",
                  borderRadius: "12px",
                  zIndex: "-1",
                  opacity: 0.3,
                }}
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
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </motion.div>

            <MotionBox
              textAlign={["center", "left"]}
              flex={1}
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) + 0.2 }}
            >
              <MotionText
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                fontSize={[16, 18, 20]}
                fontWeight="bold"
                mb={3}
                letterSpacing="1px"
                textShadow="0 2px 4px rgba(226,183,20,0.3)"
              >
                {project.title}
              </MotionText>

              <MotionBox
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 1) + 0.3 }}
              >
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
              </MotionBox>

              <Collapse in={openIndex === idx} animateOpacity>
                <MotionBox
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.description}
                  <MotionText
                    as="span"
                    color="#f7d794"
                    fontSize={16}
                    mb={3}
                    display="block"
                    mt={4}
                    fontWeight="bold"
                    letterSpacing="1px"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
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
                  </MotionText>
                  {project.title === "StoryType" && (
                    <MotionText
                      as="span"
                      color="#f7d794"
                      fontSize={16}
                      mb={3}
                      display="block"
                      mt={2}
                      fontWeight="bold"
                      letterSpacing="1px"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      Website:{" "}
                      <a
                        href="https://storytype-jjscrl.vercel.app/"
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
                    </MotionText>
                  )}
                  {project.title ===
                    "Justine Cargo Services Integration System - WEB" && (
                    <MotionText
                      as="span"
                      color="#f7d794"
                      fontSize={16}
                      mb={3}
                      display="block"
                      mt={2}
                      fontWeight="bold"
                      letterSpacing="1px"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      Website:{" "}
                      <a
                        href="https://apps.justinescargo.com/"
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
                    </MotionText>
                  )}
                </MotionBox>
              </Collapse>
            </MotionBox>
          </MotionBox>
        ))}
      </MotionBox>
    </MotionBox>
  );
};

export default ProjectsSection;
