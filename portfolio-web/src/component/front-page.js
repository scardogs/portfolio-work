import React, { useState, useCallback } from "react";
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

const FrontPage = () => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        position="relative"
        zIndex="1"
      >
        {/* Profile Image */}
        <Box position="relative">
          <Skeleton
            isLoaded={imageLoaded}
            startColor="#232323"
            endColor="#e2b714"
            borderRadius="full"
            boxSize="280px"
            fadeDuration={0.4}
          >
            <Avatar
              src="/profile.png"
              boxSize="280px"
              border="4px solid #e2b714"
              name="John Michael T. Escarlan"
              boxShadow="0 4px 16px rgba(226,183,20,0.3)"
              onLoad={handleImageLoad}
              onError={handleImageError}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.3s ease-in-out"
              showBorder={false}
              bg="transparent"
            />
          </Skeleton>
        </Box>

        {/* Divider */}
        <Box mt={8} mb={6}>
          <Divider
            borderColor="#e2b714"
            borderWidth="2px"
            opacity="0.6"
            w="200px"
          />
        </Box>

        {/* Name */}
        <Heading
          as="h1"
          size="2xl"
          color="#e2b714"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          mb={3}
          fontWeight="bold"
          letterSpacing="2px"
          textAlign="center"
        >
          John Michael T. Escarlan
        </Heading>

        {/* Title */}
        <Text
          color="#f7d794"
          fontSize={[16, 18, 20]}
          mb={4}
          fontWeight="medium"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          textAlign="center"
          letterSpacing="1px"
          opacity="0.9"
        >
          Software Developer & Web Developer
        </Text>

        {/* Second divider */}
        <Box mb={8}>
          <Divider borderColor="#232323" borderWidth="1px" w="150px" />
        </Box>

        {/* Proceed button */}
        <Box>
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
            boxShadow="0 4px 20px 0 rgba(226,183,20,0.2)"
            _hover={{
              bg: "#e2b714",
              color: "#191919",
              boxShadow: "0 8px 32px 0 rgba(226,183,20,0.3)",
              transform: "translateY(-2px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            onClick={() => router.push("/portfolio-tab")}
            transition="all 0.2s ease"
          >
            Proceed
          </Button>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default FrontPage;
