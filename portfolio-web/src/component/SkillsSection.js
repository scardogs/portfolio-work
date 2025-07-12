import React from "react";
import { Box, Tooltip, Text, Divider, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

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
  ];

  return (
    <MotionBox
      ref={sectionRef}
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
      whileHover={{
        y: -8,
        boxShadow: "0 8px 32px 0 rgba(226,183,20,0.18)",
        borderColor: "#e2b714",
      }}
      transition={{
        duration: 0.6,
        delay: 0.1,
        type: "spring",
        stiffness: 300,
      }}
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
        display="grid"
        gridTemplateColumns={[
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={[4, 6, 8]}
        mt={6}
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
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 8px 32px 0 rgba(226,183,20,0.18)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                p={4}
                bg="#232323"
                borderRadius="lg"
                border="1px solid #e2b714"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="120px"
                minW="100px"
                cursor="pointer"
                _hover={{
                  borderColor: "#e2b714",
                  boxShadow: "0 4px 16px 0 rgba(226,183,20,0.15)",
                }}
              >
                <img
                  src={tech.icon}
                  alt={`${tech.name} icon`}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "contain",
                    marginBottom: "8px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                />
                <Text
                  color="#e2b714"
                  fontSize={["sm", "md"]}
                  fontWeight="bold"
                  textAlign="center"
                  fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  mt={2}
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
