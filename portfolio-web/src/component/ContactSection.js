import React, { useState, useEffect, useMemo } from "react";
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
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        if (data.success) {
          setContactData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      }
    };

    fetchContactData();
  }, []);

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
        Contact
      </Heading>

      <Box mb={8}>
        <Divider
          borderColor="#e2b714"
          borderWidth="2px"
          opacity="0.6"
          w="150px"
        />
      </Box>

      <Box mt={6} textAlign="center">
        <Box mb={6}>
          <Tooltip
            label="Visit Facebook Profile"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Text
              as="span"
              color="#fff"
              fontSize={[16, 18]}
              mb={3}
              display="block"
              fontWeight="medium"
              letterSpacing="1px"
            >
              FB:{" "}
              <a
                href={
                  contactData?.facebook ||
                  "https://www.facebook.com/johnmichael.escarlan"
                }
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
                {contactData?.facebookUsername || "@johnmichael.escarlan"}
              </a>
            </Text>
          </Tooltip>
        </Box>

        <Box mb={6}>
          <Tooltip
            label="Send Email"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Text
              as="span"
              color="#fff"
              fontSize={[16, 18]}
              mb={3}
              display="block"
              fontWeight="medium"
              letterSpacing="1px"
            >
              Gmail:{" "}
              <a
                href={`mailto:${
                  contactData?.email || "johnmichael.escarlan14@gmail.com"
                }`}
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
                {contactData?.email || "johnmichael.escarlan14@gmail.com"}
              </a>
            </Text>
          </Tooltip>
        </Box>

        <Box>
          <Tooltip
            label="Copy Mobile Number"
            hasArrow
            bg="#232323"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            <Box>
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
            </Box>
            <Text
              as="span"
              color="#e2b714"
              fontSize={[16, 18]}
              mt={4}
              display="block"
              fontWeight="bold"
              letterSpacing="2px"
            >
              {contactData?.mobile || "09946760366"}
            </Text>
          </Tooltip>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default ContactSection;
