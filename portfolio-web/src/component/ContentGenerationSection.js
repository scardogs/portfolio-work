import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Flex,
  SimpleGrid,
  Container,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);
const PAGE_LIMIT = 12;

const ROW_HEIGHT = 10; // px — fine-grained grid rows
const GAP = 16; // px — must match the grid gap

// ─── Beautiful Play Button Overlay ────────────────────────────────────────
function PlayButton({ playing, onClick }) {
  return (
    <AnimatePresence>
      {!playing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClick}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            zIndex: 2,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.4), inset 0 0 12px rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            {/* pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            />
            {/* play triangle */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              style={{ marginLeft: 4 }}
            >
              <path d="M6 4l14 8-14 8V4z" fill="#fff" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MasonryItem({ item, index, span, onSpanChange }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const measure = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const h = el.getBoundingClientRect().height;
    if (h > 0) {
      const newSpan = Math.ceil((h + GAP) / (ROW_HEIGHT + GAP));
      onSpanChange(index, newSpan);
    }
  }, [index, onSpanChange]);

  // Lazy-load: only mount media when within viewport
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || isVisible) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isVisible]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    const imgs = el.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", measure));

    measure();
    return () => {
      ro.disconnect();
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, [measure, isVisible]);

  const handlePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.volume = 1;
      v.play().catch(() => {
        // Some browsers still block unmuted autoplay; retry muted
        v.muted = true;
        v.play();
      });
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const isVideo = item.mediaType === "video";

  return (
    <Box sx={{ gridRowEnd: `span ${span || 30}` }}>
      <MotionBox
        ref={wrapperRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.05 }}
        borderRadius="12px"
        overflow="hidden"
        position="relative"
        _hover={{ transform: "translateY(-6px)", transition: "transform 0.3s ease" }}
        sx={{
          // hide native controls until played (we use our own button)
          "& video::-webkit-media-controls-overlay-play-button": { display: "none" },
        }}
      >
        {!isVisible ? (
          // Placeholder while off-screen so the grid still has shape
          <Box
            w="100%"
            h="220px"
            bg="#141414"
            border="1px solid #1f1f1f"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner size="sm" color="#444" />
          </Box>
        ) : isVideo ? (
          <Box position="relative" w="100%" onClick={playing ? handlePlay : undefined}>
            <video
              ref={videoRef}
              src={item.mediaUrl}
              poster={item.thumbnailUrl || undefined}
              loop
              playsInline
              preload="metadata"
              controls={playing}
              onLoadedMetadata={() => {
                setVideoLoaded(true);
                measure();
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <PlayButton playing={playing} onClick={handlePlay} />
          </Box>
        ) : (
          <Image
            src={item.mediaUrl}
            alt={item.title || "Gallery Image"}
            w="100%"
            h="auto"
            display="block"
            loading="lazy"
            decoding="async"
            onLoad={measure}
          />
        )}
      </MotionBox>
    </Box>
  );
}

const FILTERS = [
  { key: "video", label: "Videos" },
  { key: "image", label: "Images" },
];

const ContentGenerationSection = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [spans, setSpans] = useState({});
  const [filter, setFilter] = useState("video");
  const sentinelRef = useRef(null);

  const visibleItems = items.filter((i) => i.mediaType === filter);

  const handleSpanChange = useCallback((index, span) => {
    setSpans((prev) => (prev[index] === span ? prev : { ...prev, [index]: span }));
  }, []);

  const fetchPage = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/content-generation?page=${pageNum}&limit=${PAGE_LIMIT}`
      );
      const json = await res.json();
      if (json.success) {
        setItems((prev) => (pageNum === 1 ? json.data : [...prev, ...json.data]));
        setHasMore(json.pagination?.hasMore ?? false);
        setPage(pageNum);
      }
    } catch (e) {
      console.error("Fetch content gallery failed:", e);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Initial fetch (always paginated to know hasMore, even if parent prefilled)
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Infinite scroll via sentinel
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchPage(page + 1);
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, page, fetchPage]);

  if (initialized && items.length === 0) return null;

  const videoCount = items.filter((i) => i.mediaType === "video").length;
  const imageCount = items.filter((i) => i.mediaType === "image").length;

  return (
    <Container maxW="container.xl" py={20}>
      <VStack spacing={[10, 12, 14]} align="stretch">
        {/* ── Editorial Header ─────────────────────────────── */}
        <Box position="relative">
          {/* Giant ghost numeral */}
          <Box
            position="absolute"
            top={["-30px", "-50px", "-70px"]}
            right={["-10px", "-20px", "-30px"]}
            fontSize={["120px", "180px", "240px"]}
            fontWeight="700"
            lineHeight="1"
            color="transparent"
            letterSpacing="-8px"
            pointerEvents="none"
            zIndex={0}
            sx={{
              WebkitTextStroke: "1px #1a1a1a",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
            display={{ base: "none", md: "block" }}
          >
            04
          </Box>

          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={[8, 10, 14]}
            align={{ base: "stretch", lg: "end" }}
            justify="space-between"
            position="relative"
            zIndex={1}
          >
            {/* Left: title + description */}
            <Box flex="1" maxW="640px">
              <HStack
                spacing={3}
                mb={5}
                divider={<Box w="20px" h="1px" bg="#333333" />}
              >
                <Text
                  fontSize="11px"
                  color="#888888"
                  letterSpacing="3px"
                  textTransform="uppercase"
                  fontWeight="500"
                >
                  Showcase
                </Text>
                <Text
                  fontSize="11px"
                  color="#666666"
                  letterSpacing="2px"
                  fontFamily="monospace"
                >
                  / 04
                </Text>
              </HStack>

              <Heading
                as="h2"
                fontSize={[36, 48, 60]}
                fontWeight="700"
                color="#e0e0e0"
                letterSpacing="-2px"
                lineHeight="0.95"
                mb={5}
              >
                AI Content
                <Text as="span" color="#555555" fontWeight="300" fontStyle="italic">
                  {" "}Gallery
                </Text>
              </Heading>

              <Box
                position="relative"
                pl={5}
                borderLeft="1px solid #2a2a2a"
                maxW="520px"
              >
                <Text
                  fontSize={[14, 15, 16]}
                  color="#999999"
                  fontWeight="300"
                  lineHeight="1.7"
                >
                  A collection of creative work spanning images and videos —
                  generated, composed, and curated across different media formats.
                </Text>
              </Box>
            </Box>

            {/* Right: stats panel */}
            <Box flex="0 0 auto" w={{ base: "100%", lg: "auto" }}>
              <SimpleGrid
                columns={3}
                spacing={0}
                border="1px solid #1f1f1f"
                w={{ base: "100%", lg: "320px" }}
              >
                {[
                  { value: items.length, label: "Total" },
                  { value: videoCount, label: "Videos" },
                  { value: imageCount, label: "Images" },
                ].map((stat, idx) => (
                  <Box
                    key={stat.label}
                    p={4}
                    textAlign="center"
                    borderLeft={idx === 0 ? "none" : "1px solid #1f1f1f"}
                    transition="background 0.3s"
                    _hover={{ bg: "#0d0d0d" }}
                    cursor="default"
                  >
                    <Text
                      fontSize={[22, 26, 28]}
                      fontWeight="700"
                      color="#e0e0e0"
                      letterSpacing="-1px"
                      lineHeight="1"
                      mb={1}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      fontSize="9px"
                      color="#666666"
                      letterSpacing="2px"
                      textTransform="uppercase"
                      fontWeight="500"
                    >
                      {stat.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          </Flex>
        </Box>

        {/* ── Filter Tabs — Editorial style ────────────────── */}
        <Flex
          align="center"
          justify="space-between"
          gap={4}
          borderTop="1px solid #1f1f1f"
          borderBottom="1px solid #1f1f1f"
          py={4}
          flexWrap="wrap"
        >
          <HStack spacing={[6, 8, 10]}>
            {FILTERS.map((f) => {
              const active = filter === f.key;
              const count = items.filter((i) => i.mediaType === f.key).length;
              return (
                <Button
                  key={f.key}
                  variant="link"
                  onClick={() => setFilter(f.key)}
                  color={active ? "#e0e0e0" : "#666666"}
                  fontSize={[12, 13]}
                  fontWeight="500"
                  letterSpacing="2px"
                  textTransform="uppercase"
                  position="relative"
                  px={0}
                  py={2}
                  _hover={{ color: "#e0e0e0", textDecoration: "none" }}
                  _after={{
                    content: '""',
                    position: "absolute",
                    bottom: "-2px",
                    left: active ? "0" : "50%",
                    right: active ? "0" : "50%",
                    height: "1px",
                    bg: "#e0e0e0",
                    transition: "all 0.3s ease",
                  }}
                  transition="color 0.3s ease"
                >
                  {f.label}
                  <Text
                    as="span"
                    ml={2}
                    fontSize="10px"
                    color={active ? "#888888" : "#444444"}
                    letterSpacing="1px"
                    fontFamily="monospace"
                    transition="color 0.3s ease"
                  >
                    [{String(count).padStart(2, "0")}]
                  </Text>
                </Button>
              );
            })}
          </HStack>

          <Text
            fontSize="10px"
            color="#555555"
            letterSpacing="3px"
            textTransform="uppercase"
            fontFamily="monospace"
          >
            Showing {visibleItems.length} of {items.filter((i) => i.mediaType === filter).length}
          </Text>
        </Flex>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: ["repeat(2, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"],
            gridAutoRows: `${ROW_HEIGHT}px`,
            gap: `${GAP}px`,
            alignItems: "start",
          }}
        >
          {visibleItems.map((item, index) => (
            <MasonryItem
              key={item._id || index}
              item={item}
              index={index}
              span={spans[index]}
              onSpanChange={handleSpanChange}
            />
          ))}
        </Box>

        {/* Infinite-scroll sentinel + manual fallback */}
        <Box ref={sentinelRef} h="1px" />

        <VStack spacing={3} pt={2}>
          {loading && <Spinner size="md" color="#888" thickness="2px" />}
          {hasMore && !loading && (
            <Button
              onClick={() => fetchPage(page + 1)}
              variant="outline"
              borderColor="#333"
              color="#e0e0e0"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              fontSize="xs"
              px={8}
              _hover={{ borderColor: "#e2b714", color: "#e2b714", bg: "transparent" }}
            >
              Load More
            </Button>
          )}
          {!hasMore && items.length > 0 && (
            <Text fontSize="xs" color="#444" letterSpacing="2px" textTransform="uppercase">
              — End of Gallery —
            </Text>
          )}
        </VStack>
      </VStack>
    </Container>
  );
};

export default ContentGenerationSection;
