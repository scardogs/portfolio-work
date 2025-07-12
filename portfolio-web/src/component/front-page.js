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
    >
      <MotionBox
        w={["100%", "90%", "600px"]}
        maxW="100%"
        p={[8, 12]}
        bg="#272727"
        borderRadius="lg"
        border="1.5px solid #e2b714"
        boxShadow="0 2px 24px 0 rgba(0,0,0,0.12)"
        display="flex"
        flexDirection="column"
        alignItems="center"
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Box position="relative">
          <Skeleton
            isLoaded={imageLoaded}
            startColor="#232323"
            endColor="#e2b714"
            borderRadius="full"
            boxSize="250px"
            fadeDuration={0.8}
          >
            <Avatar
              src="/profile.png"
              boxSize="250px"
              border="4px solid #e2b714"
              mb={4}
              name="John Michael T. Escarlan"
              boxShadow="0 0 0 6px #191919, 0 0 0 10px #e2b714"
              onLoad={handleImageLoad}
              onError={handleImageError}
              opacity={imageLoaded ? 1 : 0}
              transition="opacity 0.5s ease-in-out"
              showBorder={false}
              bg="transparent"
            />
          </Skeleton>
        </Box>
        <Divider borderColor="#232323" mb={4} />
        <Heading
          as="h1"
          size="xl"
          color="#e2b714"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          mb={1}
          fontWeight="bold"
          letterSpacing={1}
        >
          John Michael T. Escarlan
        </Heading>
        <Text
          color="#e2b714"
          fontSize={18}
          mb={2}
          fontWeight="medium"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        >
          Software Developer & Web Developer
        </Text>
        <Divider borderColor="#232323" mb={6} />
        {/* <Text color="#fff" textAlign="center" fontSize={17} maxW={600} mb={8}>
          I build efficient, user-friendly systems that solve problems and
          improve workflows. I'm driven to learn, grow, and contribute to
          impactful tech projects.
        </Text> */}
        <MotionBox
          whileHover={{
            scale: 1.04,
            rotate: [-3, 3, -3, 3, -3, 3, -3, 3, -2, 2, -2, 2, 0],
            transition: { duration: 0.4 },
          }}
        >
          <Button
            mt={2}
            size="lg"
            colorScheme="yellow"
            variant="solid"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            fontWeight="bold"
            px={10}
            py={6}
            fontSize={20}
            borderRadius="full"
            boxShadow="0 2px 16px 0 rgba(226,183,20,0.10)"
            _hover={{
              bg: "#e2b714",
              color: "#191919",
              boxShadow: "0 4px 32px 0 rgba(226,183,20,0.18)",
            }}
            onClick={() => router.push("/portfolio-tab")}
          >
            Proceed
          </Button>
        </MotionBox>
      </MotionBox>
    </Box>
  );
};

export default FrontPage;
