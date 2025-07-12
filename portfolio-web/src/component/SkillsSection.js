import React from "react";
import { Box, Tooltip, Text, Divider, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const SkillsSection = ({ sectionRef, sectionVariant }) => {
  const technologies = [
    { name: "MongoDB", icon: "/mongodb.svg" },
    { name: "Express.js", icon: "/express.svg" },
    { name: "React", icon: "/react.svg" },
    { name: "Node.js", icon: "/nodejs.svg" },
    { name: "Next.js", icon: "/next-js.svg" },
    { name: "CSS", icon: "/css.svg" },
    { name: "PHP", icon: "/php.svg" },
    { name: ".NET", icon: "/dotnet.svg" },
    { name: "Python", icon: "/python.svg" },
    { name: "C#", icon: "/csharp.svg" },
    { name: "Chakra UI", icon: "/chakra-ui.svg" },
  ];

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
        Skills
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
        {technologies.map((tech, idx) => (
          <Tooltip
            key={tech.name}
            label={tech.name}
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 * idx,
                type: "spring",
                stiffness: 300,
              }}
              whileHover={{
                scale: 1.08,
                y: -8,
                boxShadow: "0 12px 32px 0 rgba(226,183,20,0.25)",
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
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
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: "absolute",
                  top: "0",
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(226,183,20,0.1), transparent)",
                  transition: "left 0.5s",
                }}
                _hover={{
                  boxShadow: "0 8px 24px 0 rgba(226,183,20,0.2)",
                  _before: {
                    left: "100%",
                  },
                }}
                transition="all 0.3s"
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
                  textShadow="0 1px 2px rgba(226,183,20,0.3)"
                >
                  {tech.name}
                </Text>
              </Box>
            </motion.div>
          </Tooltip>
        ))}
      </Box>
    </MotionBox>
  );
};

export default SkillsSection;
