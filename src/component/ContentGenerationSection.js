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
const PAGE_LIMIT = 100;

const ROW_HEIGHT = 10; // px — fine-grained grid rows
const GAP = 16; // px — must match the grid gap

// Derive a still-frame poster from a Cloudinary video URL (so_0 = first second).
// Falls back to undefined for non-Cloudinary URLs so the <video> can still render.
function getVideoPoster(url) {
  if (!url || typeof url !== "string") return undefined;
  if (!url.includes("/video/upload/")) return undefined;
  return url
    .replace("/video/upload/", "/video/upload/so_0,q_auto,f_jpg/")
    .replace(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i, ".jpg$2");
}

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

function MasonryItem({ item, index, span, onSpanChange, activeTag, onSelectTag }) {
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
  const itemTags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];

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
              src={`${item.mediaUrl}#t=0.1`}
              poster={item.thumbnailUrl || getVideoPoster(item.mediaUrl)}
              loop
              muted
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

        {/* Tag Badges Overlay on Card */}
        {isVisible && itemTags.length > 0 && !playing && (
          <Flex
            position="absolute"
            bottom={2.5}
            left={2.5}
            right={2.5}
            gap={1.5}
            flexWrap="wrap"
            zIndex={3}
            pointerEvents="auto"
          >
            {itemTags.map((tag) => {
              const isSelectedTag =
                activeTag && activeTag.toLowerCase() === String(tag).toLowerCase();
              return (
                <Box
                  as="button"
                  type="button"
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag?.(isSelectedTag ? "all" : tag);
                  }}
                  px={2.5}
                  py={0.5}
                  borderRadius="4px"
                  fontSize="9px"
                  fontWeight="700"
                  letterSpacing="1px"
                  textTransform="uppercase"
                  fontFamily="monospace"
                  bg={isSelectedTag ? "#e2b714" : "rgba(10, 10, 10, 0.82)"}
                  color={isSelectedTag ? "#0a0a0a" : "#e0e0e0"}
                  border={`1px solid ${
                    isSelectedTag ? "#e2b714" : "rgba(255, 255, 255, 0.22)"
                  }`}
                  backdropFilter="blur(6px)"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: "#e2b714",
                    color: "#0a0a0a",
                    borderColor: "#e2b714",
                  }}
                >
                  #{tag}
                </Box>
              );
            })}
          </Flex>
        )}
      </MotionBox>
    </Box>
  );
}

const FILTERS = [
  { key: "video", label: "Videos" },
  { key: "image", label: "Images" },
];

const INITIAL_VISIBLE = 6;
const VISIBLE_STEP = 6;

const ContentGenerationSection = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems || []);
  const [availableTags, setAvailableTags] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totals, setTotals] = useState({ total: 0, video: 0, image: 0 });
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [spans, setSpans] = useState({});
  const [filter, setFilter] = useState("video");
  const [activeTag, setActiveTag] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  // Compute all unique tags across items and API availableTags
  const allGalleryTags = React.useMemo(() => {
    const map = new Map();
    for (const t of availableTags) {
      const clean = String(t || "").trim();
      if (clean && !map.has(clean.toLowerCase())) {
        map.set(clean.toLowerCase(), clean);
      }
    }
    for (const item of items) {
      if (Array.isArray(item.tags)) {
        for (const t of item.tags) {
          const clean = String(t || "").trim();
          if (clean && !map.has(clean.toLowerCase())) {
            map.set(clean.toLowerCase(), clean);
          }
        }
      }
    }
    return Array.from(map.values());
  }, [availableTags, items]);

  const mediaFilteredItems = React.useMemo(
    () => items.filter((i) => i.mediaType === filter),
    [items, filter]
  );

  const filteredItems = React.useMemo(() => {
    if (activeTag === "all") return mediaFilteredItems;
    return mediaFilteredItems.filter((item) =>
      (item.tags || []).some(
        (t) => String(t).toLowerCase() === activeTag.toLowerCase()
      )
    );
  }, [mediaFilteredItems, activeTag]);

  const visibleItems = filteredItems.slice(0, visibleCount);

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
        if (Array.isArray(json.availableTags)) {
          setAvailableTags(json.availableTags);
        }
        setHasMore(json.pagination?.hasMore ?? false);
        setPage(pageNum);
        if (json.pagination) {
          setTotals((prev) => ({
            total: json.pagination.total ?? prev.total,
            video: json.pagination.videoCount ?? prev.video,
            image: json.pagination.imageCount ?? prev.image,
          }));
        }
      }
    } catch (e) {
      console.error("Fetch content gallery failed:", e);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // Initial fetch (manual "See More" controls subsequent loads — no auto infinite scroll)
  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const handleFilterChange = async (nextFilter) => {
    setFilter(nextFilter);
    setVisibleCount(INITIAL_VISIBLE);
    setSpans({});
    // If activeTag has 0 items in nextFilter, reset activeTag to "all"
    if (activeTag !== "all") {
      const hasInNext = items.some(
        (i) =>
          i.mediaType === nextFilter &&
          (i.tags || []).some(
            (t) => String(t).toLowerCase() === activeTag.toLowerCase()
          )
      );
      if (!hasInNext) setActiveTag("all");
    }
    const nextFilteredCount = items.filter((i) => i.mediaType === nextFilter).length;
    const nextTotalForFilter = nextFilter === "video" ? totals.video : totals.image;
    if (
      nextFilteredCount < INITIAL_VISIBLE &&
      hasMore &&
      (!nextTotalForFilter || nextFilteredCount < nextTotalForFilter) &&
      !loading
    ) {
      await fetchPage(page + 1);
    }
  };

  const handleTagFilterChange = (nextTag) => {
    setActiveTag(nextTag);
    setVisibleCount(INITIAL_VISIBLE);
    setSpans({});
    if (nextTag !== "all") {
      const countInCurrentMedia = items.filter(
        (i) =>
          i.mediaType === filter &&
          (i.tags || []).some(
            (t) => String(t).toLowerCase() === nextTag.toLowerCase()
          )
      ).length;
      if (countInCurrentMedia === 0) {
        const otherMedia = filter === "video" ? "image" : "video";
        const countInOther = items.filter(
          (i) =>
            i.mediaType === otherMedia &&
            (i.tags || []).some(
              (t) => String(t).toLowerCase() === nextTag.toLowerCase()
            )
        ).length;
        if (countInOther > 0) {
          setFilter(otherMedia);
        }
      }
    }
  };

  const handleSeeMore = async () => {
    const nextVisible = visibleCount + VISIBLE_STEP;
    setVisibleCount(nextVisible);
    if (nextVisible > filteredItems.length && hasMore && !loading) {
      await fetchPage(page + 1);
    }
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
    document
      .getElementById("content-gen-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (initialized && items.length === 0) return null;

  const videoCount = totals.video || items.filter((i) => i.mediaType === "video").length;
  const imageCount = totals.image || items.filter((i) => i.mediaType === "image").length;
  const totalCount = totals.total || items.length;
  const totalForFilter =
    activeTag === "all"
      ? filter === "video"
        ? videoCount
        : imageCount
      : filteredItems.length;
  const canSeeMore =
    visibleItems.length < totalForFilter &&
    (visibleCount < filteredItems.length || (activeTag === "all" && hasMore));
  const remainingCount = Math.max(0, totalForFilter - visibleItems.length);

  return (
    <Container maxW="container.xl" pt={2} pb={12} px={0}>
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
                  { value: totalCount, label: "Total" },
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

        {/* ── Filter Tabs + Tag Filter Bar — Editorial style ────────────────── */}
        <Box borderTop="1px solid #1f1f1f" borderBottom="1px solid #1f1f1f">
          <Flex
            align="center"
            justify="space-between"
            gap={4}
            py={4}
            flexWrap="wrap"
          >
            <HStack spacing={[6, 8, 10]}>
              {FILTERS.map((f) => {
                const active = filter === f.key;
                const count = f.key === "video" ? videoCount : imageCount;
                return (
                  <Button
                    key={f.key}
                    variant="link"
                    onClick={() => handleFilterChange(f.key)}
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
              Showing {visibleItems.length} of {totalForFilter}
              {activeTag !== "all" ? ` · #${activeTag}` : ""}
            </Text>
          </Flex>

          {/* Tag Filter Pills */}
          {allGalleryTags.length > 0 && (
            <Flex
              align="center"
              gap={2}
              py={3}
              borderTop="1px solid #161616"
              flexWrap="wrap"
            >
              <Text
                fontSize="10px"
                color="#666666"
                letterSpacing="2px"
                textTransform="uppercase"
                fontFamily="monospace"
                mr={2}
              >
                Filter by Tag:
              </Text>

              <Box
                as="button"
                type="button"
                onClick={() => handleTagFilterChange("all")}
                px={3}
                py={1.5}
                borderRadius="2px"
                fontSize="10px"
                fontWeight="600"
                letterSpacing="1.5px"
                textTransform="uppercase"
                fontFamily="monospace"
                bg={activeTag === "all" ? "#e0e0e0" : "#111111"}
                color={activeTag === "all" ? "#0a0a0a" : "#888888"}
                border={`1px solid ${activeTag === "all" ? "#e0e0e0" : "#222222"}`}
                transition="all 0.2s ease"
                _hover={{
                  borderColor: "#e0e0e0",
                  color: activeTag === "all" ? "#0a0a0a" : "#e0e0e0",
                }}
              >
                All [{String(mediaFilteredItems.length).padStart(2, "0")}]
              </Box>

              {allGalleryTags.map((tag) => {
                const isActive = activeTag.toLowerCase() === tag.toLowerCase();
                const countInMedia = mediaFilteredItems.filter((item) =>
                  (item.tags || []).some(
                    (t) => String(t).toLowerCase() === tag.toLowerCase()
                  )
                ).length;
                const countTotal = items.filter((item) =>
                  (item.tags || []).some(
                    (t) => String(t).toLowerCase() === tag.toLowerCase()
                  )
                ).length;

                if (countTotal === 0) return null;

                return (
                  <Box
                    as="button"
                    type="button"
                    key={tag}
                    onClick={() =>
                      handleTagFilterChange(isActive ? "all" : tag)
                    }
                    px={3}
                    py={1.5}
                    borderRadius="2px"
                    fontSize="10px"
                    fontWeight="600"
                    letterSpacing="1.5px"
                    textTransform="uppercase"
                    fontFamily="monospace"
                    bg={isActive ? "#e2b714" : "#111111"}
                    color={isActive ? "#0a0a0a" : "#999999"}
                    border={`1px solid ${isActive ? "#e2b714" : "#222222"}`}
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: "#e2b714",
                      color: isActive ? "#0a0a0a" : "#e2b714",
                    }}
                  >
                    #{tag} [
                    {String(
                      countInMedia > 0 ? countInMedia : countTotal
                    ).padStart(2, "0")}
                    ]
                  </Box>
                );
              })}
            </Flex>
          )}
        </Box>

        <Box position="relative">
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
                activeTag={activeTag}
                onSelectTag={handleTagFilterChange}
              />
            ))}
          </Box>

          {/* Subtle bottom fade when more items are waiting */}
          {canSeeMore && visibleItems.length > 0 && (
            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              h="100px"
              pointerEvents="none"
              background="linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0) 100%)"
              zIndex={2}
            />
          )}
        </Box>

        {/* ── Prominent "See More" Call-to-Action Footer ────────────────── */}
        <Box pt={4} pb={2}>
          {canSeeMore ? (
            <VStack spacing={4}>
              <Flex align="center" w="100%" gap={[4, 6]}>
                <Box
                  flex="1"
                  h="1px"
                  bg="linear-gradient(90deg, transparent 0%, #333333 100%)"
                />
                <Button
                  onClick={handleSeeMore}
                  isLoading={loading}
                  loadingText="LOADING MORE..."
                  size="lg"
                  h={["54px", "60px"]}
                  minW={["240px", "320px"]}
                  px={[8, 12]}
                  bg="#e0e0e0"
                  color="#0a0a0a"
                  border="2px solid #e0e0e0"
                  borderRadius="2px"
                  fontWeight="700"
                  letterSpacing="3px"
                  textTransform="uppercase"
                  fontSize={["12px", "13px"]}
                  fontFamily="monospace"
                  boxShadow="0 14px 40px rgba(0,0,0,0.65), 0 0 25px rgba(226,183,20,0.15)"
                  transition="all 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
                  _hover={{
                    bg: "#e2b714",
                    borderColor: "#e2b714",
                    color: "#0a0a0a",
                    transform: "translateY(-3px) scale(1.02)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(226,183,20,0.35)",
                  }}
                  _active={{
                    transform: "translateY(0) scale(0.99)",
                  }}
                  rightIcon={
                    <Box as="span" fontSize="15px" ml={1}>
                      ↓
                    </Box>
                  }
                >
                  See More{remainingCount > 0 ? ` (${remainingCount} More)` : ""}
                </Button>
                <Box
                  flex="1"
                  h="1px"
                  bg="linear-gradient(90deg, #333333 0%, transparent 100%)"
                />
              </Flex>

              <Text
                fontSize="10px"
                color="#777777"
                letterSpacing="2.5px"
                textTransform="uppercase"
                fontFamily="monospace"
              >
                Viewing {visibleItems.length} of {totalForFilter} {filter === "video" ? "Videos" : "Images"}
              </Text>
            </VStack>
          ) : (
            items.length > 0 && (
              <VStack spacing={4}>
                <Flex align="center" w="100%" gap={4}>
                  <Box flex="1" h="1px" bg="#1f1f1f" />
                  <Text
                    fontSize="10px"
                    color="#555555"
                    letterSpacing="3px"
                    textTransform="uppercase"
                    fontFamily="monospace"
                  >
                    — All {visibleItems.length} {filter === "video" ? "Videos" : "Images"} Displayed —
                  </Text>
                  <Box flex="1" h="1px" bg="#1f1f1f" />
                </Flex>

                {visibleItems.length > INITIAL_VISIBLE && (
                  <Button
                    onClick={handleShowLess}
                    variant="outline"
                    size="sm"
                    borderColor="#333333"
                    color="#999999"
                    borderRadius="2px"
                    fontWeight="500"
                    letterSpacing="2px"
                    textTransform="uppercase"
                    fontSize="10px"
                    fontFamily="monospace"
                    px={6}
                    _hover={{ borderColor: "#e0e0e0", color: "#e0e0e0", bg: "#141414" }}
                  >
                    Show Less ↑
                  </Button>
                )}
              </VStack>
            )
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default ContentGenerationSection;
