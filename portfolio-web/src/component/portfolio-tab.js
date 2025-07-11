import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  Avatar,
  Tooltip,
  Button,
  Collapse,
  useDisclosure,
  Text,
  Divider,
  Heading,
  useClipboard,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionTab = motion(Tab);

const sections = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const PortfolioTab = () => {
  const sectionRefs = {
    about: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
  };

  const handleTabClick = (id) => {
    sectionRefs[id].current.scrollIntoView({ behavior: "smooth" });
  };

  const { isOpen, onToggle } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard("09946760366");
  const toast = useToast();

  // Audio player logic
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.muted = isMuted;
      if (!isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  }, [isMuted, isPlaying]);

  // Animation variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box
      w={["100%", "90%", "800px"]}
      maxW="100%"
      mx="auto"
      mt={[4, 8]}
      px={[2, 4, 0]}
      position="relative"
    >
      {/* Audio element and mute button */}
      <audio ref={audioRef} src="/song1.mp3" autoPlay loop />

      <Tabs variant="enclosed" isFitted colorScheme="brand" position="relative">
        <TabList position="relative">
          {sections.map((section, idx) => (
            <MotionTab
              key={section.id}
              onClick={() => handleTabClick(section.id)}
              fontWeight="bold"
              fontSize={["sm", "md"]}
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              _selected={{
                color: "#e2b714",
                bg: "#272727",
                borderColor: "#e2b714",
                boxShadow: "none",
              }}
              _hover={{
                color: "#e2b714",
                bg: "#232323",
                transition: "all 0.2s",
              }}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {section.label}
            </MotionTab>
          ))}
        </TabList>
      </Tabs>
      {/* About Section */}
      <MotionBox
        ref={sectionRefs.about}
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
        transition={{ duration: 0.6, delay: 0.1 }}
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
          About
        </Heading>
        {/* Mute/Unmute Button in About upper left */}
        <IconButton
          aria-label={isMuted ? "Unmute" : "Mute"}
          icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          onClick={() => setIsMuted((m) => !m)}
          position="absolute"
          top={10}
          left={2}
          zIndex={10}
          colorScheme="yellow"
          variant="ghost"
          size="lg"
          fontSize="2xl"
        />
        <Divider borderColor="#232323" mb={4} />
        <Avatar
          src="/profile.png"
          name="John Michael T. Escarlan"
          boxSize="300px"
          border="2px solid #e2b714"
          mb={4}
        />
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
        <Text color="#fff" textAlign="center" fontSize={16} maxW={600} mt={2}>
          I have a passion for building reliable and efficient systems. I enjoy
          solving technical challenges and finding ways to improve processes and
          make technology work better. My goal is to create user-friendly
          solutions that help people accomplish their tasks more easily. I am
          always eager to learn new skills, explore new technologies, and
          contribute to meaningful projects. I am committed to delivering
          high-quality work and continuously growing in the field of technology.
        </Text>
      </MotionBox>
      {/* Skills Section */}
      <MotionBox
        ref={sectionRefs.skills}
        id="skills"
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
        transition={{ duration: 0.6, delay: 0.2 }}
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
          Skills
        </Heading>
        <Divider borderColor="#232323" mb={4} />
        <Box
          as="ul"
          mt={4}
          pl={0}
          style={{ listStyle: "none", textAlign: "center" }}
        >
          {[
            "Project Management",
            "Public Relations",
            "Teamwork",
            "Time Management",
            "Leadership",
            "Effective Communication",
            "Critical Thinking",
          ].map((skill, idx) => (
            <Tooltip
              key={skill}
              label={skill}
              hasArrow
              bg="#232323"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  backgroundColor: "#e2b714",
                  color: "#191919",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ display: "inline-block" }}
              >
                <Box
                  as="li"
                  mb={2}
                  px={4}
                  py={2}
                  bg="#232323"
                  borderRadius="md"
                  border="1px solid #e2b714"
                  color="#fff"
                  fontWeight="bold"
                  fontSize={["md", "lg"]}
                  m={2}
                  fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  cursor="pointer"
                >
                  {skill}
                </Box>
              </motion.div>
            </Tooltip>
          ))}
        </Box>
      </MotionBox>
      {/* Projects Section */}
      <MotionBox
        ref={sectionRefs.projects}
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
        <Box
          mt={6}
          display="flex"
          flexDirection={["column", "row"]}
          alignItems="center"
          justifyContent="center"
          gap={[6, 12]}
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
                src="/LOGO.png"
                alt="Justine Cargo Services Logo"
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
          <Box textAlign={["center", "left"]}>
            <Text
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontSize={18}
              fontWeight="bold"
            >
              Justine Cargo Services Integration System
            </Text>
            <Button
              onClick={onToggle}
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              mb={2}
              mt={4}
              size="md"
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
              }}
            >
              {isOpen ? "Hide Description" : "Show Description"}
            </Button>
            <Collapse in={isOpen} animateOpacity>
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
                Developed a MERN stack system to automate and streamline company
                operations. The system includes modules for employee profiles,
                truck status tracking, delivery management, truck renewal
                scheduling, waybill verification, fuel monitoring, automated
                payroll, billing generation, and report creation. This reduces
                manual work, improves data accuracy, and helps the company
                manage information more efficiently.
                <Text
                  as="span"
                  color="#fff"
                  fontSize={16}
                  mb={2}
                  display="block"
                >
                  GitHUb:{" "}
                  <a
                    href="https://github.com/justines-cargo-services/JCS-System"
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
      </MotionBox>
      {/* Contact Section */}
      <MotionBox
        ref={sectionRefs.contact}
        id="contact"
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
        transition={{ duration: 0.6, delay: 0.4 }}
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
          Contact
        </Heading>
        <Divider borderColor="#232323" mb={4} />
        <Box mt={4} textAlign="center">
          <Tooltip
            label="Visit Facebook Profile"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Text as="span" color="#fff" fontSize={16} mb={2} display="block">
              FB:{" "}
              <a
                href="https://www.facebook.com/johnmichael.escarlan"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#e2b714", textDecoration: "underline" }}
              >
                @johnmichael.escarlan
              </a>
            </Text>
          </Tooltip>
          <Tooltip
            label="Send Email"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Text as="span" color="#fff" fontSize={16} mb={2} display="block">
              Gmail:{" "}
              <a
                href="mailto:johnmichael.escarlan14@gmail.com"
                style={{ color: "#e2b714", textDecoration: "underline" }}
              >
                johnmichael.escarlan14@gmail.com
              </a>
            </Text>
          </Tooltip>
          <Tooltip
            label="Copy Mobile Number"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Button
              size="sm"
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              mt={2}
              onClick={() => {
                onCopy();
                toast({
                  title: hasCopied ? "Copied!" : "Copied to clipboard!",
                  status: "success",
                  duration: 1200,
                  isClosable: true,
                  position: "top",
                });
              }}
              _hover={{
                bg: "#191919",
                color: "#e2b714",
                borderColor: "#e2b714",
              }}
            >
              {hasCopied ? "Copied!" : "Copy Mobile Number"}
            </Button>
            <Text
              as="span"
              color="#e2b714"
              fontSize={16}
              mt={2}
              display="block"
            >
              09946760366
            </Text>
          </Tooltip>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default PortfolioTab;
