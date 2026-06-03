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
      mb={[8, 12]}
      p={[6, 10, 12]}
      bg="#ffffff"
      borderRadius="0"
      border="1px solid #e5e5e5"
      fontFamily="system-ui, -apple-system, sans-serif"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.4,
      }}
      _hover={{
        borderColor: "#1a1a1a",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
      sx={{
        transition: "all 0.3s ease",
      }}
    >
      <Heading
        as="h2"
        size="lg"
        color="#1a1a1a"
        fontFamily="system-ui, -apple-system, sans-serif"
        mb={4}
        fontWeight="300"
        letterSpacing="4px"
        textTransform="uppercase"
        fontSize="14px"
      >
        Contact
      </Heading>

      <Box mb={8}>
        <Divider borderColor="#e5e5e5" borderWidth="1px" w="60px" />
      </Box>

      <Box mt={6} textAlign="center">
        <Box mb={6}>
          <Tooltip
            label="Visit Facebook Profile"
            hasArrow
            bg="#1a1a1a"
            color="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <Text
              as="span"
              color="#666666"
              fontSize={[15, 16]}
              mb={3}
              display="block"
              fontWeight="300"
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
                  color: "#1a1a1a",
                  textDecoration: "none",
                  borderBottom: "1px solid #1a1a1a",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#666666";
                  e.target.style.borderBottomColor = "#666666";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#1a1a1a";
                  e.target.style.borderBottomColor = "#1a1a1a";
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
            bg="#1a1a1a"
            color="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <Text
              as="span"
              color="#666666"
              fontSize={[15, 16]}
              mb={3}
              display="block"
              fontWeight="300"
              letterSpacing="1px"
            >
              Gmail:{" "}
              <a
                href={`mailto:${
                  contactData?.email || "johnmichael.escarlan14@gmail.com"
                }`}
                style={{
                  color: "#1a1a1a",
                  textDecoration: "none",
                  borderBottom: "1px solid #1a1a1a",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#666666";
                  e.target.style.borderBottomColor = "#666666";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#1a1a1a";
                  e.target.style.borderBottomColor = "#1a1a1a";
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
            bg="#1a1a1a"
            color="#ffffff"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            <Box>
              <Button
                size="md"
                colorScheme="gray"
                variant="outline"
                borderColor="#1a1a1a"
                color="#1a1a1a"
                fontFamily="system-ui, -apple-system, sans-serif"
                mt={3}
                fontWeight="300"
                letterSpacing="2px"
                textTransform="uppercase"
                borderRadius="0"
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
                  bg: "#1a1a1a",
                  color: "#ffffff",
                  borderColor: "#1a1a1a",
                  transform: "translateY(-1px)",
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
              color="#1a1a1a"
              fontSize={[16, 18]}
              mt={4}
              display="block"
              fontWeight="300"
              letterSpacing="1px"
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
