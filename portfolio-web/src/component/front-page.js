import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Text,
  Button,
  Heading,
  Divider,
  Skeleton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const FrontPage = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Stop loading state even if image fails
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="#191919"
      position="relative"
      overflow="hidden"
    >
      {/* Elegant background pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.03"
        backgroundImage="radial-gradient(circle at 25% 25%, #e2b714 0%, transparent 50%), radial-gradient(circle at 75% 75%, #e2b714 0%, transparent 50%)"
        backgroundSize="400px 400px"
        zIndex="0"
      />

      <MotionBox
        w={["95%", "90%", "700px"]}
        maxW="100%"
        p={[8, 12, 16]}
        bg="#272727"
        borderRadius="2xl"
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        position="relative"
        zIndex="1"
        backdropFilter="blur(10px)"
        _before={{
          content: '""',
          position: "absolute",
          top: "-2px",
          left: "-2px",
          right: "-2px",
          bottom: "-2px",
          borderRadius: "2xl",
          zIndex: "-1",
          opacity: 0, // Hide the highlight background
        }}
      >
        {/* Profile Image with enhanced styling */}
        <MotionBox
          position="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box
            position="relative"
            /* Removed the rotating gradient border */
          >
            <Skeleton
              isLoaded={imageLoaded}
              startColor="#232323"
              endColor="#e2b714"
              borderRadius="full"
              boxSize="280px"
              fadeDuration={0.8}
            >
              <Avatar
                src="/profile.png"
                boxSize="280px"
                border="4px solid #e2b714"
                name="John Michael T. Escarlan"
                boxShadow="0 8px 32px rgba(226,183,20,0.3)"
                onLoad={handleImageLoad}
                onError={handleImageError}
                opacity={imageLoaded ? 1 : 0}
                transition="opacity 0.5s ease-in-out"
                showBorder={false}
                bg="transparent"
              />
            </Skeleton>
          </Box>
        </MotionBox>

        {/* Elegant divider */}
        <MotionBox
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          mt={8}
          mb={6}
        >
          <Divider
            borderColor="#e2b714"
            borderWidth="2px"
            opacity="0.6"
            w="200px"
          />
        </MotionBox>

        {/* Name with enhanced typography */}
        <MotionHeading
          as="h1"
          size="2xl"
          color="#e2b714"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          mb={3}
          fontWeight="bold"
          letterSpacing="2px"
          textAlign="center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          textShadow="0 2px 4px rgba(226,183,20,0.3)"
        >
          John Michael T. Escarlan
        </MotionHeading>

        {/* Title with elegant styling */}
        <MotionText
          color="#f7d794"
          fontSize={[16, 18, 20]}
          mb={4}
          fontWeight="medium"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          textAlign="center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          letterSpacing="1px"
          opacity="0.9"
        >
          Software Developer & Web Developer
        </MotionText>

        {/* Second divider */}
        <MotionBox
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          mb={8}
        >
          <Divider borderColor="#232323" borderWidth="1px" w="150px" />
        </MotionBox>

        {/* Enhanced proceed button */}
        <MotionBox
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{
            scale: 1.05,
            rotate: [-2, 2, -2, 2, -1, 1, -1, 1, 0],
            transition: { duration: 0.4 },
          }}
        >
          <Button
            size="lg"
            colorScheme="yellow"
            variant="solid"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            fontWeight="bold"
            px={12}
            py={7}
            fontSize={22}
            borderRadius="full"
            boxShadow="0 4px 20px 0 rgba(226,183,20,0.2), 0 0 0 1px rgba(226,183,20,0.1)"
            _hover={{
              bg: "#e2b714",
              color: "#191919",
              boxShadow:
                "0 8px 40px 0 rgba(226,183,20,0.3), 0 0 0 2px rgba(226,183,20,0.2)",
              transform: "translateY(-2px)",
              _before: {
                left: "100%",
              },
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            onClick={() => router.push("/portfolio-tab")}
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
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              transition: "left 0.5s",
            }}
          >
            Proceed
          </Button>
        </MotionBox>
      </MotionBox>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default FrontPage;
