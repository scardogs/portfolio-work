import React from "react";
import { Box, Tooltip, Button, Text, Divider, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const ContactSection = ({
  sectionRef,
  sectionVariant,
  onCopy,
  hasCopied,
  toast,
}) => {
  return (
    <MotionBox
      ref={sectionRef}
      id="contact"
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
        Contact
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
        mt={6}
        textAlign="center"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          mb={6}
        >
          <Tooltip
            label="Visit Facebook Profile"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <MotionText
              as="span"
              color="#fff"
              fontSize={[16, 18]}
              mb={3}
              display="block"
              fontWeight="medium"
              letterSpacing="1px"
              textShadow="0 1px 2px rgba(255,255,255,0.1)"
            >
              FB:{" "}
              <a
                href="https://www.facebook.com/johnmichael.escarlan"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#e2b714",
                  textDecoration: "underline",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#f7d794";
                  e.target.style.textShadow = "0 2px 4px rgba(226,183,20,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#e2b714";
                  e.target.style.textShadow = "none";
                }}
              >
                @johnmichael.escarlan
              </a>
            </MotionText>
          </Tooltip>
        </MotionBox>

        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          mb={6}
        >
          <Tooltip
            label="Send Email"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <MotionText
              as="span"
              color="#fff"
              fontSize={[16, 18]}
              mb={3}
              display="block"
              fontWeight="medium"
              letterSpacing="1px"
              textShadow="0 1px 2px rgba(255,255,255,0.1)"
            >
              Gmail:{" "}
              <a
                href="mailto:johnmichael.escarlan14@gmail.com"
                style={{
                  color: "#e2b714",
                  textDecoration: "underline",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#f7d794";
                  e.target.style.textShadow = "0 2px 4px rgba(226,183,20,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#e2b714";
                  e.target.style.textShadow = "none";
                }}
              >
                johnmichael.escarlan14@gmail.com
              </a>
            </MotionText>
          </Tooltip>
        </MotionBox>

        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Tooltip
            label="Copy Mobile Number"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                size="md"
                colorScheme="yellow"
                variant="outline"
                borderColor="#e2b714"
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                mt={3}
                fontWeight="bold"
                letterSpacing="1px"
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
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
              >
                {hasCopied ? "Copied!" : "Copy Mobile Number"}
              </Button>
            </MotionBox>
            <MotionText
              as="span"
              color="#e2b714"
              fontSize={[16, 18]}
              mt={4}
              display="block"
              fontWeight="bold"
              letterSpacing="2px"
              textShadow="0 2px 4px rgba(226,183,20,0.3)"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              09946760366
            </MotionText>
          </Tooltip>
        </MotionBox>
      </MotionBox>
    </MotionBox>
  );
};

export default ContactSection;
