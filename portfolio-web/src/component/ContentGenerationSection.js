import React, { useRef, useEffect, useState, useCallback } from "react";
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

const ROW_HEIGHT = 10; // px — fine-grained grid rows
const GAP = 16; // px — must match the grid gap

function MasonryItem({ item, index, span, onSpanChange }) {
  const wrapperRef = useRef(null);

  const measure = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const h = el.getBoundingClientRect().height;
    if (h > 0) {
      const newSpan = Math.ceil((h + GAP) / (ROW_HEIGHT + GAP));
      onSpanChange(index, newSpan);
    }
  }, [index, onSpanChange]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Re-measure when images/videos finish loading
    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", measure));

    measure();
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [measure]);

  return (
    // Outer box owns the grid span; no overflow so the inner hover can breathe
    <Box sx={{ gridRowEnd: `span ${span || 30}` }}>
      <MotionBox
        ref={wrapperRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.07 }}
        borderRadius="12px"
        overflow="hidden"
        _hover={{ transform: "translateY(-6px)", transition: "transform 0.3s ease" }}
      >
        {item.mediaType === "video" ? (
          <video
            src={item.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={measure}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ) : (
          <Image
            src={item.mediaUrl}
            alt={item.title || "Gallery Image"}
            w="100%"
            h="auto"
            display="block"
            onLoad={measure}
          />
        )}
      </MotionBox>
    </Box>
  );
}

const ContentGenerationSection = ({ items }) => {
  if (!items || items.length === 0) return null;

  const [spans, setSpans] = useState({});

  const handleSpanChange = useCallback((index, span) => {
    setSpans((prev) => (prev[index] === span ? prev : { ...prev, [index]: span }));
  }, []);

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
            color="#e0e0e0"
          >
            AI CONTENT GALLERY
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

        {/* CSS Grid masonry: small auto-rows + measured spans per item */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: ["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"],
            gridAutoRows: `${ROW_HEIGHT}px`,
            gap: `${GAP}px`,
            alignItems: "start",
          }}
        >
          {items.map((item, index) => (
            <MasonryItem
              key={item._id || index}
              item={item}
              index={index}
              span={spans[index]}
              onSpanChange={handleSpanChange}
            />
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default ContentGenerationSection;
