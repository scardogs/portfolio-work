import React from "react";
import { Box, Tooltip, Button, Text, Divider, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

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
          <Text as="span" color="#e2b714" fontSize={16} mt={2} display="block">
            09946760366
          </Text>
        </Tooltip>
      </Box>
    </MotionBox>
  );
};

export default ContactSection;
