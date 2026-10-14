import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  IconButton,
  VStack,
  HStack,
  useToast,
  Text,
  Flex,
  Icon,
  Grid,
  SimpleGrid,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaUser,
  FaFolderOpen,
  FaLaptopCode,
  FaEnvelope,
  FaInbox,
  FaBriefcase,
  FaCalendarAlt,
  FaImages,
  FaBookOpen,
  FaBell,
  FaArrowRight,
  FaMagic,
  FaEye,
  FaEyeSlash,
  FaHome,
  FaGripVertical,
  FaArrowUp,
  FaArrowDown,
  FaUndo,
} from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminLayout, { COLORS } from "../../component/admin/AdminLayout";

const PUBLIC_SECTIONS = [
  {
    key: "hero",
    title: "Hero Banner",
    description: "Main landing banner with portrait, name, role, and social links.",
    icon: FaHome,
  },
  {
    key: "about",
    title: "About Section",
    description: "Personal bio, tagline, education, languages, and status cards.",
    icon: FaUser,
  },
  {
    key: "skills",
    title: "Tech Stack",
    description: "Infinite scrolling marquee of skills and technologies.",
    icon: FaLaptopCode,
  },
  {
    key: "projects",
    title: "Featured Projects",
    description: "Portfolio showcase and case studies section.",
    icon: FaFolderOpen,
  },
  {
    key: "contentGeneration",
    title: "Content Gallery",
    description: "AI content generation and media showcase gallery.",
    icon: FaImages,
  },
  {
    key: "milestones",
    title: "Key Milestones",
    description: "Horizontal timeline of key years and achievements.",
    icon: FaCalendarAlt,
  },
  {
    key: "experience",
    title: "Work Experience",
    description: "Chronological career and work history timeline.",
    icon: FaBriefcase,
  },
  {
    key: "blog",
    title: "Blog & Notes",
    description: "Navigation link to Notes and public /blog listing.",
    icon: FaBookOpen,
  },
  {
    key: "contact",
    title: "Contact Section",
    description: "Inbound message form, direct contact info, and social links.",
    icon: FaEnvelope,
  },
];

const DEFAULT_SECTION_ORDER = PUBLIC_SECTIONS.map((s) => s.key);
const SECTION_BY_KEY = PUBLIC_SECTIONS.reduce((acc, sec) => {
  acc[sec.key] = sec;
  return acc;
}, {});

function SortableSectionCard({
  sec,
  index,
  total,
  isVisible,
  isUpdating,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sec.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.65 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={COLORS.card}
      border={`1px solid ${
        isDragging
          ? COLORS.accent
          : isVisible
          ? COLORS.border
          : "rgba(255,107,107,0.28)"
      }`}
      borderRadius="12px"
      p={5}
      transition="border-color 0.25s ease, box-shadow 0.25s ease"
      boxShadow={isDragging ? "0 16px 40px rgba(0,0,0,0.55)" : "none"}
      _hover={{ borderColor: isVisible ? COLORS.borderStrong : "rgba(255,107,107,0.5)" }}
    >
      <Flex justify="space-between" align="center" gap={3}>
        <HStack spacing={3} align="start" flex="1" overflow="hidden">
          {/* Drag handle */}
          <Tooltip
            label="Drag to reorder section"
            bg={COLORS.card}
            color={COLORS.text}
            border={`1px solid ${COLORS.border}`}
            fontSize="11px"
          >
            <IconButton
              {...attributes}
              {...listeners}
              icon={<FaGripVertical size={12} />}
              aria-label={`Drag ${sec.title}`}
              size="xs"
              w="28px"
              h="38px"
              bg="rgba(255,255,255,0.02)"
              color={COLORS.muted}
              border={`1px solid ${COLORS.border}`}
              borderRadius="8px"
              cursor="grab"
              _active={{ cursor: "grabbing" }}
              _hover={{ color: COLORS.accent, borderColor: COLORS.accent }}
              flexShrink={0}
            />
          </Tooltip>

          <Flex
            align="center"
            justify="center"
            w="38px"
            h="38px"
            borderRadius="9px"
            bg={isVisible ? "rgba(226,183,20,0.08)" : "rgba(255,107,107,0.08)"}
            border={`1px solid ${isVisible ? "rgba(226,183,20,0.2)" : "rgba(255,107,107,0.2)"}`}
            color={isVisible ? COLORS.accent : "#ff6b6b"}
            flexShrink={0}
          >
            <Icon as={sec.icon} boxSize="15px" />
          </Flex>

          <Box overflow="hidden" flex="1">
            <HStack spacing={2} mb={0.5} flexWrap="wrap">
              <Text
                fontSize="10px"
                fontFamily="monospace"
                color={COLORS.muted}
                letterSpacing="1px"
                px={1.5}
                py={0.5}
                borderRadius="4px"
                bg="rgba(255,255,255,0.04)"
                border={`1px solid ${COLORS.border}`}
              >
                #{String(index + 1).padStart(2, "0")}
              </Text>
              <Text
                fontSize="14px"
                color={isVisible ? COLORS.text : COLORS.muted}
                fontWeight="600"
                letterSpacing="0.3px"
                noOfLines={1}
              >
                {sec.title}
              </Text>
              <Box
                px={1.5}
                py={0.5}
                borderRadius="4px"
                fontSize="9px"
                fontWeight="600"
                letterSpacing="1px"
                textTransform="uppercase"
                bg={isVisible ? "rgba(226,183,20,0.1)" : "rgba(255,107,107,0.12)"}
                color={isVisible ? COLORS.accent : "#ff6b6b"}
              >
                {isVisible ? "Visible" : "Hidden"}
              </Box>
            </HStack>
            <Text color={COLORS.muted} fontSize="11px" lineHeight="1.5" noOfLines={2}>
              {sec.description}
            </Text>
          </Box>
        </HStack>

        <HStack spacing={2} flexShrink={0}>
          {/* Up / Down order controls */}
          <VStack spacing={1}>
            <IconButton
              icon={<FaArrowUp size={9} />}
              aria-label={`Move ${sec.title} up`}
              size="xs"
              w="22px"
              h="18px"
              minW="22px"
              isDisabled={index === 0 || isUpdating}
              onClick={onMoveUp}
              bg="transparent"
              color={COLORS.muted}
              border={`1px solid ${COLORS.border}`}
              borderRadius="4px"
              _hover={{ color: COLORS.accent, borderColor: COLORS.accent }}
            />
            <IconButton
              icon={<FaArrowDown size={9} />}
              aria-label={`Move ${sec.title} down`}
              size="xs"
              w="22px"
              h="18px"
              minW="22px"
              isDisabled={index === total - 1 || isUpdating}
              onClick={onMoveDown}
              bg="transparent"
              color={COLORS.muted}
              border={`1px solid ${COLORS.border}`}
              borderRadius="4px"
              _hover={{ color: COLORS.accent, borderColor: COLORS.accent }}
            />
          </VStack>

          {/* Switch toggle */}
          <Box
            as="button"
            type="button"
            onClick={onToggleVisibility}
            disabled={isUpdating}
            position="relative"
            w="48px"
            h="26px"
            borderRadius="999px"
            bg={isVisible ? "rgba(226,183,20,0.25)" : "#0c0c0c"}
            border={`1px solid ${isVisible ? COLORS.accent : COLORS.border}`}
            cursor={isUpdating ? "wait" : "pointer"}
            transition="all 0.25s ease"
            opacity={isUpdating ? 0.6 : 1}
            _hover={{ borderColor: isVisible ? COLORS.accent : COLORS.borderStrong }}
            aria-label={`Toggle ${sec.title} visibility`}
            flexShrink={0}
          >
            <Box
              position="absolute"
              top="2px"
              left={isVisible ? "23px" : "2px"}
              w="20px"
              h="20px"
              borderRadius="50%"
              bg={isVisible ? COLORS.accent : COLORS.muted}
              transition="left 0.25s ease, background 0.25s ease"
              boxShadow="0 2px 6px rgba(0,0,0,0.4)"
            />
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
}

// ─── Reusable card components ────────────────────────────────────────────
function StatCard({ label, value, icon, loading }) {
  return (
    <Box
      bg={COLORS.card}
      border={`1px solid ${COLORS.border}`}
      borderRadius="12px"
      p={5}
      transition="all 0.3s"
      _hover={{
        borderColor: COLORS.borderStrong,
        transform: "translateY(-2px)",
      }}
      position="relative"
      overflow="hidden"
    >
      <Flex justify="space-between" align="start" mb={3}>
        <Text
          fontSize="10px"
          color={COLORS.muted}
          letterSpacing="2px"
          textTransform="uppercase"
          fontWeight="400"
        >
          {label}
        </Text>
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          borderRadius="8px"
          bg="rgba(226,183,20,0.08)"
          color={COLORS.accent}
          flexShrink={0}
        >
          <Icon as={icon} boxSize="14px" />
        </Flex>
      </Flex>
      <Text
        fontSize="32px"
        color={COLORS.text}
        fontWeight="600"
        letterSpacing="-1px"
        lineHeight="1"
      >
        {loading ? <Spinner size="sm" color={COLORS.muted} /> : value ?? 0}
      </Text>
    </Box>
  );
}

function QuickCard({ title, description, icon, path, router, badge, isVisible = true, onToggleVisibility, toggleLoading }) {
  return (
    <Box
      bg={COLORS.card}
      border={`1px solid ${isVisible ? COLORS.border : "rgba(255,107,107,0.28)"}`}
      borderRadius="12px"
      p={6}
      cursor="pointer"
      onClick={() => router.push(path)}
      transition="all 0.3s ease"
      position="relative"
      overflow="hidden"
      role="group"
      opacity={isVisible ? 1 : 0.78}
      _hover={{
        borderColor: COLORS.accent,
        transform: "translateY(-3px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
        opacity: 1,
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        w: "100%",
        h: "100%",
        bg: "linear-gradient(90deg, transparent, rgba(226,183,20,0.04), transparent)",
        transition: "left 0.6s ease",
      }}
      sx={{
        "&:hover::before": { left: "100%" },
      }}
    >
      <Flex justify="space-between" align="start" mb={4} position="relative" zIndex={1}>
        <Flex
          align="center"
          justify="center"
          w="42px"
          h="42px"
          borderRadius="10px"
          bg="rgba(226,183,20,0.08)"
          border={`1px solid rgba(226,183,20,0.2)`}
          color={COLORS.accent}
          transition="all 0.3s"
          _groupHover={{
            bg: "rgba(226,183,20,0.15)",
            borderColor: COLORS.accent,
          }}
        >
          <Icon as={icon} boxSize="18px" />
        </Flex>
        <HStack spacing={2}>
          {onToggleVisibility && (
            <Tooltip
              label={isVisible ? "Visible on public site (click to hide)" : "Hidden on public site (click to unhide)"}
              bg={COLORS.card}
              color={COLORS.text}
              border={`1px solid ${COLORS.border}`}
              fontSize="11px"
            >
              <Box
                as="button"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
                disabled={toggleLoading}
                display="inline-flex"
                alignItems="center"
                gap={1.5}
                fontSize="10px"
                color={isVisible ? COLORS.muted : "#ff6b6b"}
                letterSpacing="1px"
                textTransform="uppercase"
                px={2}
                py={1}
                borderRadius="4px"
                bg={isVisible ? "rgba(255,255,255,0.03)" : "rgba(255,107,107,0.1)"}
                border={`1px solid ${isVisible ? COLORS.border : "rgba(255,107,107,0.3)"}`}
                _hover={{
                  color: isVisible ? COLORS.accent : "#ff8787",
                  borderColor: isVisible ? COLORS.accent : "#ff6b6b",
                }}
                transition="all 0.2s"
              >
                <Icon as={isVisible ? FaEye : FaEyeSlash} boxSize="11px" />
                <Text as="span">{isVisible ? "Shown" : "Hidden"}</Text>
              </Box>
            </Tooltip>
          )}
          {badge && (
            <Box
              fontSize="10px"
              color={COLORS.accent}
              letterSpacing="1px"
              textTransform="uppercase"
              px={2}
              py={1}
              borderRadius="4px"
              bg="rgba(226,183,20,0.1)"
              border={`1px solid rgba(226,183,20,0.25)`}
            >
              {badge}
            </Box>
          )}
        </HStack>
      </Flex>
      <Heading
        as="h3"
        fontSize="15px"
        color={COLORS.text}
        fontWeight="600"
        mb={2}
        letterSpacing="0.5px"
        position="relative"
        zIndex={1}
      >
        {title}
      </Heading>
      <Text
        color={COLORS.muted}
        fontSize="12px"
        lineHeight="1.6"
        mb={4}
        position="relative"
        zIndex={1}
      >
        {description}
      </Text>
      <Flex
        align="center"
        gap={2}
        color={COLORS.muted}
        fontSize="11px"
        letterSpacing="2px"
        textTransform="uppercase"
        transition="color 0.3s"
        _groupHover={{ color: COLORS.accent }}
        position="relative"
        zIndex={1}
      >
        <Text fontWeight="400">Manage</Text>
        <Icon
          as={FaArrowRight}
          boxSize="10px"
          transition="transform 0.3s"
          _groupHover={{ transform: "translateX(4px)" }}
        />
      </Flex>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ projects: null, skills: null, experience: null, content: null, messages: null, blog: null });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [cursorLoading, setCursorLoading] = useState(false);
  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    about: true,
    skills: true,
    projects: true,
    contentGeneration: true,
    milestones: true,
    experience: true,
    blog: true,
    contact: true,
  });
  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);
  const [sectionLoadingKey, setSectionLoadingKey] = useState(null);
  const [orderSaving, setOrderSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch (e) {}
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pr, sk, we, cg, msg, bl] = await Promise.all([
          fetch("/api/projects").then((r) => r.json()).catch(() => ({})),
          fetch("/api/skills").then((r) => r.json()).catch(() => ({})),
          fetch("/api/work-experience").then((r) => r.json()).catch(() => ({})),
          fetch("/api/content-generation?page=1&limit=1").then((r) => r.json()).catch(() => ({})),
          (async () => {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) return { data: [] };
            const r = await fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } });
            return r.json().catch(() => ({}));
          })(),
          fetch("/api/blog?admin=1&page=1&limit=1").then((r) => r.json()).catch(() => ({})),
        ]);
        setStats({
          projects: Array.isArray(pr?.data) ? pr.data.length : 0,
          skills: Array.isArray(sk?.data) ? sk.data.length : 0,
          experience: Array.isArray(we?.data) ? we.data.length : 0,
          content: cg?.pagination?.total ?? (Array.isArray(cg?.data) ? cg.data.length : 0),
          messages: Array.isArray(msg?.data) ? msg.data.length : 0,
          blog: bl?.pagination?.total ?? (Array.isArray(bl?.data) ? bl.data.length : 0),
        });
      } catch (e) {
        console.error("Stats fetch failed:", e);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
    checkSubscription();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const r = await fetch("/api/settings");
      const json = await r.json();
      if (json?.success && json.data) {
        setCursorEnabled(json.data.splashCursorEnabled !== false);
        if (json.data.sectionVisibility) {
          setSectionVisibility((prev) => ({
            ...prev,
            ...json.data.sectionVisibility,
          }));
        }
        if (Array.isArray(json.data.sectionOrder) && json.data.sectionOrder.length > 0) {
          setSectionOrder(json.data.sectionOrder);
        }
      }
    } catch (e) {}
  };

  const saveSectionOrder = async (newOrder, descriptionMsg = "Public website section order updated.") => {
    const previousOrder = sectionOrder;
    setSectionOrder(newOrder);
    setOrderSaving(true);
    try {
      const token = localStorage.getItem("token");
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sectionOrder: newOrder }),
      });
      const json = await r.json();
      if (json.success && Array.isArray(json.data?.sectionOrder)) {
        setSectionOrder(json.data.sectionOrder);
        toast({
          title: "Section Order Saved",
          description: descriptionMsg,
          status: "success",
          duration: 2000,
        });
      } else {
        throw new Error(json.message || "Failed to update section order");
      }
    } catch (e) {
      setSectionOrder(previousOrder);
      toast({
        title: "Error",
        description: e.message || "Failed to update section order",
        status: "error",
        duration: 3000,
      });
    } finally {
      setOrderSaving(false);
    }
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const nextOrder = arrayMove(sectionOrder, oldIndex, newIndex);
    const secTitle = SECTION_BY_KEY[active.id]?.title || active.id;
    saveSectionOrder(nextOrder, `Moved ${secTitle} to position #${newIndex + 1}.`);
  };

  const moveSectionByOffset = (index, offset) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= sectionOrder.length) return;
    const nextOrder = arrayMove(sectionOrder, index, targetIndex);
    const secTitle = SECTION_BY_KEY[sectionOrder[index]]?.title || sectionOrder[index];
    saveSectionOrder(nextOrder, `Moved ${secTitle} to position #${targetIndex + 1}.`);
  };

  const resetSectionOrder = () => {
    saveSectionOrder(DEFAULT_SECTION_ORDER, "Restored default section order.");
  };

  const toggleSectionVisibility = async (key, label) => {
    setSectionLoadingKey(key);
    const nextVisible = sectionVisibility[key] === false ? true : false;
    const updatedMap = {
      ...sectionVisibility,
      [key]: nextVisible,
    };
    try {
      const token = localStorage.getItem("token");
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sectionVisibility: updatedMap }),
      });
      const json = await r.json();
      if (json.success && json.data?.sectionVisibility) {
        setSectionVisibility(json.data.sectionVisibility);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("section-visibility-updated", {
              detail: { sectionVisibility: json.data.sectionVisibility },
            })
          );
        }
        toast({
          title: nextVisible ? "Section Unhidden" : "Section Hidden",
          description: `${label} is now ${nextVisible ? "visible" : "hidden"} on the public website.`,
          status: nextVisible ? "success" : "info",
          duration: 2500,
        });
      } else {
        throw new Error(json.message || "Failed to update section visibility");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e.message || "Failed to update section visibility",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSectionLoadingKey(null);
    }
  };

  const setAllSectionsVisibility = async (visible) => {
    setSectionLoadingKey("__all__");
    const updatedMap = {};
    PUBLIC_SECTIONS.forEach((s) => {
      updatedMap[s.key] = visible;
    });
    try {
      const token = localStorage.getItem("token");
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sectionVisibility: updatedMap }),
      });
      const json = await r.json();
      if (json.success && json.data?.sectionVisibility) {
        setSectionVisibility(json.data.sectionVisibility);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("section-visibility-updated", {
              detail: { sectionVisibility: json.data.sectionVisibility },
            })
          );
        }
        toast({
          title: visible ? "All Sections Unhidden" : "All Sections Hidden",
          description: `All public website sections are now ${visible ? "visible" : "hidden"}.`,
          status: visible ? "success" : "info",
          duration: 3000,
        });
      } else {
        throw new Error(json.message || "Failed to update sections");
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e.message || "Failed to update sections",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSectionLoadingKey(null);
    }
  };

  const toggleCursor = async () => {
    setCursorLoading(true);
    const next = !cursorEnabled;
    try {
      const token = localStorage.getItem("token");
      const r = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ splashCursorEnabled: next }),
      });
      const json = await r.json();
      if (json.success) {
        setCursorEnabled(next);
        toast({
          title: next ? "Enabled" : "Disabled",
          description: `Cursor effect ${next ? "enabled" : "disabled"} on the public site`,
          status: next ? "success" : "info",
          duration: 3000,
        });
      } else throw new Error(json.message);
    } catch (e) {
      toast({ title: "Error", description: e.message || "Failed to update", status: "error", duration: 3000 });
    } finally {
      setCursorLoading(false);
    }
  };

  // ─── Push subscription helpers ──────────────────────────────────
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  };

  const checkSubscription = async () => {
    if (typeof window === "undefined") return;
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (e) {}
    }
  };

  const subscribeUser = async () => {
    setSubLoading(true);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window))
        throw new Error("Push notifications not supported");
      const registration = await navigator.serviceWorker.ready;
      const pKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BMfwOcQ_e7U9hbi2XWE-BKgzCNIu8c3BS00m1V49-MW_X";
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pKey),
      });
      const token = localStorage.getItem("token");
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(subscription),
      });
      const data = await response.json();
      if (data.success) {
        setIsSubscribed(true);
        toast({ title: "Enabled", description: "Push notifications enabled", status: "success", duration: 3000 });
      } else throw new Error(data.message);
    } catch (error) {
      toast({ title: "Error", description: error.message || "Failed to enable", status: "error", duration: 3000 });
    } finally {
      setSubLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setSubLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        toast({ title: "Disabled", description: "Push notifications disabled", status: "info", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to disable", status: "error", duration: 3000 });
    } finally {
      setSubLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const visibleCount = PUBLIC_SECTIONS.filter((s) => sectionVisibility[s.key] !== false).length;
  const orderedSections = sectionOrder
    .map((key) => SECTION_BY_KEY[key])
    .filter(Boolean);
  const isDefaultOrder =
    sectionOrder.length === DEFAULT_SECTION_ORDER.length &&
    sectionOrder.every((k, idx) => k === DEFAULT_SECTION_ORDER[idx]);

  return (
    <AdminLayout title="Dashboard" subtitle="Overview">
      {/* Greeting */}
      <Box mb={8}>
        <Text fontSize="11px" color={COLORS.muted} letterSpacing="2px" textTransform="uppercase" mb={2}>
          {today}
        </Text>
        <Heading
          as="h1"
          fontSize={["24px", "28px", "32px"]}
          color={COLORS.text}
          fontWeight="600"
          letterSpacing="-1px"
          mb={2}
        >
          Welcome back,{" "}
          <Text as="span" color={COLORS.accent}>
            {user?.username || "Admin"}
          </Text>
        </Heading>
        <Text color={COLORS.muted} fontSize="14px" fontWeight="300">
          Here's what's happening with your portfolio today.
        </Text>
      </Box>

      {/* Stats grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4} mb={10}>
        <StatCard label="Projects" value={stats.projects} icon={FaFolderOpen} loading={statsLoading} />
        <StatCard label="Skills" value={stats.skills} icon={FaLaptopCode} loading={statsLoading} />
        <StatCard label="Experience" value={stats.experience} icon={FaBriefcase} loading={statsLoading} />
        <StatCard label="Content" value={stats.content} icon={FaImages} loading={statsLoading} />
        <StatCard label="Messages" value={stats.messages} icon={FaInbox} loading={statsLoading} />
      </SimpleGrid>

      {/* Section divider */}
      <Flex align="center" gap={4} mb={6}>
        <Text
          fontSize="11px"
          color={COLORS.muted}
          letterSpacing="3px"
          textTransform="uppercase"
          fontWeight="400"
        >
          Quick Access
        </Text>
        <Box flex="1" h="1px" bg={COLORS.border} />
      </Flex>

      {/* Quick access grid */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4} mb={10}>
        <QuickCard
          title="About Section"
          description="Personal info, education, and social links."
          icon={FaUser}
          path="/admin/manage/about"
          router={router}
          isVisible={sectionVisibility.about !== false}
          onToggleVisibility={() => toggleSectionVisibility("about", "About Section")}
          toggleLoading={sectionLoadingKey === "about"}
        />
        <QuickCard
          title="Projects"
          description="Add, edit, or reorder portfolio work."
          icon={FaFolderOpen}
          path="/admin/manage/projects"
          router={router}
          badge={stats.projects ? `${stats.projects}` : null}
          isVisible={sectionVisibility.projects !== false}
          onToggleVisibility={() => toggleSectionVisibility("projects", "Featured Projects")}
          toggleLoading={sectionLoadingKey === "projects"}
        />
        <QuickCard
          title="Tech Stack"
          description="Skills and technologies marquee."
          icon={FaLaptopCode}
          path="/admin/manage/skills"
          router={router}
          badge={stats.skills ? `${stats.skills}` : null}
          isVisible={sectionVisibility.skills !== false}
          onToggleVisibility={() => toggleSectionVisibility("skills", "Tech Stack")}
          toggleLoading={sectionLoadingKey === "skills"}
        />
        <QuickCard
          title="Work Experience"
          description="Professional timeline entries."
          icon={FaBriefcase}
          path="/admin/manage/work-experience"
          router={router}
          badge={stats.experience ? `${stats.experience}` : null}
          isVisible={sectionVisibility.experience !== false}
          onToggleVisibility={() => toggleSectionVisibility("experience", "Work Experience")}
          toggleLoading={sectionLoadingKey === "experience"}
        />
        <QuickCard
          title="Milestones"
          description="Key years and achievements."
          icon={FaCalendarAlt}
          path="/admin/manage/years"
          router={router}
          isVisible={sectionVisibility.milestones !== false}
          onToggleVisibility={() => toggleSectionVisibility("milestones", "Key Milestones")}
          toggleLoading={sectionLoadingKey === "milestones"}
        />
        <QuickCard
          title="Content Gallery"
          description="AI content gallery items."
          icon={FaImages}
          path="/admin/manage/content-generation"
          router={router}
          badge={stats.content ? `${stats.content}` : null}
          isVisible={sectionVisibility.contentGeneration !== false}
          onToggleVisibility={() => toggleSectionVisibility("contentGeneration", "Content Gallery")}
          toggleLoading={sectionLoadingKey === "contentGeneration"}
        />
        <QuickCard
          title="Blog & Notes"
          description="Write markdown posts and notes."
          icon={FaBookOpen}
          path="/admin/manage/blog"
          router={router}
          badge={stats.blog ? `${stats.blog}` : null}
          isVisible={sectionVisibility.blog !== false}
          onToggleVisibility={() => toggleSectionVisibility("blog", "Blog & Notes")}
          toggleLoading={sectionLoadingKey === "blog"}
        />
        <QuickCard
          title="Contact Info"
          description="Email, phone, location, social."
          icon={FaEnvelope}
          path="/admin/manage/contact"
          router={router}
          isVisible={sectionVisibility.contact !== false}
          onToggleVisibility={() => toggleSectionVisibility("contact", "Contact Section")}
          toggleLoading={sectionLoadingKey === "contact"}
        />
        <QuickCard
          title="Messages"
          description="Read inbound contact-form messages."
          icon={FaInbox}
          path="/admin/manage/messages"
          router={router}
          badge={stats.messages ? `${stats.messages}` : null}
        />
      </Grid>

      {/* Public Website Section Visibility & Order */}
      <Flex align="center" justify="space-between" gap={4} mb={3} flexWrap="wrap">
        <HStack spacing={4} flex="1" minW="220px">
          <Text
            fontSize="11px"
            color={COLORS.muted}
            letterSpacing="3px"
            textTransform="uppercase"
            fontWeight="400"
            whiteSpace="nowrap"
          >
            Public Website Sections ({visibleCount}/{PUBLIC_SECTIONS.length} Visible)
          </Text>
          <Box flex="1" h="1px" bg={COLORS.border} />
        </HStack>
        <HStack spacing={2} flexWrap="wrap">
          {!isDefaultOrder && (
            <Button
              size="xs"
              h="30px"
              px={3}
              leftIcon={<FaUndo size={10} />}
              onClick={resetSectionOrder}
              isLoading={orderSaving}
              bg="transparent"
              color={COLORS.muted}
              border={`1px solid ${COLORS.border}`}
              borderRadius="6px"
              fontSize="10px"
              letterSpacing="1.5px"
              textTransform="uppercase"
              _hover={{ color: COLORS.accent, borderColor: COLORS.accent, bg: "rgba(226,183,20,0.08)" }}
            >
              Reset Order
            </Button>
          )}
          <Button
            size="xs"
            h="30px"
            px={3}
            onClick={() => setAllSectionsVisibility(true)}
            isLoading={sectionLoadingKey === "__all__"}
            bg="transparent"
            color={COLORS.accent}
            border={`1px solid rgba(226,183,20,0.35)`}
            borderRadius="6px"
            fontSize="10px"
            letterSpacing="1.5px"
            textTransform="uppercase"
            _hover={{ bg: "rgba(226,183,20,0.08)", borderColor: COLORS.accent }}
          >
            Unhide All
          </Button>
          <Button
            size="xs"
            h="30px"
            px={3}
            onClick={() => setAllSectionsVisibility(false)}
            isLoading={sectionLoadingKey === "__all__"}
            bg="transparent"
            color={COLORS.muted}
            border={`1px solid ${COLORS.border}`}
            borderRadius="6px"
            fontSize="10px"
            letterSpacing="1.5px"
            textTransform="uppercase"
            _hover={{ color: "#ff6b6b", borderColor: "rgba(255,107,107,0.4)", bg: "rgba(255,107,107,0.06)" }}
          >
            Hide All
          </Button>
        </HStack>
      </Flex>

      <Text color={COLORS.muted} fontSize="12px" mb={5}>
        Drag the grip handle or use the up/down arrows to rearrange the order of sections on your public website.
      </Text>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={orderedSections.map((s) => s.key)}
          strategy={rectSortingStrategy}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mb={10}>
            {orderedSections.map((sec, idx) => {
              const isVisible = sectionVisibility[sec.key] !== false;
              const isUpdating =
                sectionLoadingKey === sec.key ||
                sectionLoadingKey === "__all__" ||
                orderSaving;
              return (
                <SortableSectionCard
                  key={sec.key}
                  sec={sec}
                  index={idx}
                  total={orderedSections.length}
                  isVisible={isVisible}
                  isUpdating={isUpdating}
                  onToggleVisibility={() => toggleSectionVisibility(sec.key, sec.title)}
                  onMoveUp={() => moveSectionByOffset(idx, -1)}
                  onMoveDown={() => moveSectionByOffset(idx, 1)}
                />
              );
            })}
          </SimpleGrid>
        </SortableContext>
      </DndContext>

      {/* Settings / Notifications */}
      <Flex align="center" gap={4} mb={6}>
        <Text
          fontSize="11px"
          color={COLORS.muted}
          letterSpacing="3px"
          textTransform="uppercase"
          fontWeight="400"
        >
          Settings
        </Text>
        <Box flex="1" h="1px" bg={COLORS.border} />
      </Flex>

      <Box
        bg={COLORS.card}
        border={`1px solid ${COLORS.border}`}
        borderRadius="12px"
        p={6}
        mb={6}
      >
        <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <HStack spacing={4} align="start">
            <Flex
              align="center"
              justify="center"
              w="42px"
              h="42px"
              borderRadius="10px"
              bg="rgba(226,183,20,0.08)"
              border={`1px solid rgba(226,183,20,0.2)`}
              color={COLORS.accent}
              flexShrink={0}
            >
              <Icon as={FaBell} boxSize="18px" />
            </Flex>
            <VStack align="start" spacing={1}>
              <Heading as="h3" fontSize="15px" color={COLORS.text} fontWeight="600" letterSpacing="0.5px">
                Push Notifications
              </Heading>
              <Text color={COLORS.muted} fontSize="12px" lineHeight="1.6">
                Receive alerts on this device when new messages arrive.
              </Text>
            </VStack>
          </HStack>
          <Button
            onClick={isSubscribed ? unsubscribeUser : subscribeUser}
            isLoading={subLoading}
            size="sm"
            minW="120px"
            bg="transparent"
            color={isSubscribed ? "#ff6b6b" : COLORS.accent}
            border={`1px solid ${isSubscribed ? "rgba(255,107,107,0.35)" : "rgba(226,183,20,0.35)"}`}
            borderRadius="8px"
            fontWeight="500"
            letterSpacing="2px"
            textTransform="uppercase"
            fontSize="11px"
            _hover={{
              bg: isSubscribed ? "rgba(255,107,107,0.08)" : "rgba(226,183,20,0.08)",
              borderColor: isSubscribed ? "#ff6b6b" : COLORS.accent,
            }}
            transition="all 0.3s"
          >
            {isSubscribed ? "Disable" : "Enable"}
          </Button>
        </Flex>
      </Box>

      {/* Splash cursor toggle */}
      <Box
        bg={COLORS.card}
        border={`1px solid ${COLORS.border}`}
        borderRadius="12px"
        p={6}
      >
        <Flex justify="space-between" align={{ base: "start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <HStack spacing={4} align="start">
            <Flex
              align="center"
              justify="center"
              w="42px"
              h="42px"
              borderRadius="10px"
              bg="rgba(226,183,20,0.08)"
              border={`1px solid rgba(226,183,20,0.2)`}
              color={COLORS.accent}
              flexShrink={0}
            >
              <Icon as={FaMagic} boxSize="16px" />
            </Flex>
            <VStack align="start" spacing={1}>
              <Heading as="h3" fontSize="15px" color={COLORS.text} fontWeight="600" letterSpacing="0.5px">
                Cursor Effect
              </Heading>
              <Text color={COLORS.muted} fontSize="12px" lineHeight="1.6">
                Toggle the animated splash cursor that follows the mouse on the public portfolio.
              </Text>
            </VStack>
          </HStack>

          {/* Switch-style toggle */}
          <Box
            as="button"
            onClick={toggleCursor}
            disabled={cursorLoading}
            position="relative"
            w="52px"
            h="28px"
            borderRadius="999px"
            bg={cursorEnabled ? "rgba(226,183,20,0.25)" : COLORS.inputBg || "#0c0c0c"}
            border={`1px solid ${cursorEnabled ? COLORS.accent : COLORS.border}`}
            cursor={cursorLoading ? "wait" : "pointer"}
            transition="all 0.25s ease"
            opacity={cursorLoading ? 0.6 : 1}
            _hover={{ borderColor: cursorEnabled ? COLORS.accent : COLORS.borderStrong }}
            aria-label="Toggle cursor effect"
            flexShrink={0}
          >
            <Box
              position="absolute"
              top="3px"
              left={cursorEnabled ? "26px" : "3px"}
              w="20px"
              h="20px"
              borderRadius="50%"
              bg={cursorEnabled ? COLORS.accent : COLORS.muted}
              transition="left 0.25s ease, background 0.25s ease"
              boxShadow="0 2px 6px rgba(0,0,0,0.4)"
            />
          </Box>
        </Flex>
      </Box>
    </AdminLayout>
  );
}
