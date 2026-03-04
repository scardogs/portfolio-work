import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const ContentGenerationSection = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={12} align="stretch">
        <VStack spacing={4} align="center" textAlign="center">
          <Heading
            as="h2"
            size="2xl"
            fontWeight="300"
            letterSpacing="4px"
            textTransform="uppercase"
            color="#1a1a1a"
          >
            CONTENT GALLERY
          </Heading>
          <Box w="80px" h="1px" bg="#e2b714" />
          <Text
            fontSize="lg"
            color="#666"
            maxW="2xl"
            fontWeight="300"
            lineHeight="tall"
          >
            A collection of my creative work spanning across different media formats.
          </Text>
        </VStack>

        {/* Masonry Layout Container */}
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }}
          gap="1.5rem"
          sx={{
            "& > *": {
              height: "fit-content"
            }
          }}
        >
          {items.map((item, index) => (
            <MotionBox
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              borderRadius="12px"
              overflow="hidden"
              sx={{
                transition: "all 0.3s",
              }}
              _hover={{ transform: "translateY(-5px)" }}
            >
              {item.mediaType === "video" ? (
                <video
                  src={item.mediaUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "12px"
                  }}
                />
              ) : (
                <Image
                  src={item.mediaUrl}
                  alt={item.title || "Gallery Image"}
                  w="100%"
                  h="auto"
                  display="block"
                  borderRadius="12px"
                  objectFit="cover"
                />
              )}
            </MotionBox>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default ContentGenerationSection;
