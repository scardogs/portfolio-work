import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Tabs,
  TabList,
  Tab,
  useDisclosure,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

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

      {/* Imported Section Components */}
      <AboutSection
        sectionRef={sectionRefs.about}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        sectionVariant={sectionVariant}
      />

      <SkillsSection
        sectionRef={sectionRefs.skills}
        sectionVariant={sectionVariant}
      />

      <ProjectsSection
        sectionRef={sectionRefs.projects}
        sectionVariant={sectionVariant}
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <ContactSection
        sectionRef={sectionRefs.contact}
        sectionVariant={sectionVariant}
        onCopy={onCopy}
        hasCopied={hasCopied}
        toast={toast}
      />
    </Box>
  );
};

export default PortfolioTab;
