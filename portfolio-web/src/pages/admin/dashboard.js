import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  useToast,
  Text,
  Flex,
  Icon,
  Grid,
  SimpleGrid,
  Spinner,
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
  FaBell,
  FaArrowRight,
  FaMagic,
} from "react-icons/fa";
import AdminLayout, { COLORS } from "../../component/admin/AdminLayout";

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

function QuickCard({ title, description, icon, path, router, badge }) {
  return (
    <Box
      bg={COLORS.card}
      border={`1px solid ${COLORS.border}`}
      borderRadius="12px"
      p={6}
      cursor="pointer"
      onClick={() => router.push(path)}
      transition="all 0.3s ease"
      position="relative"
      overflow="hidden"
      role="group"
      _hover={{
        borderColor: COLORS.accent,
        transform: "translateY(-3px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
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
  const [stats, setStats] = useState({ projects: null, skills: null, experience: null, content: null, messages: null });
  const [statsLoading, setStatsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(true);
  const [cursorLoading, setCursorLoading] = useState(false);

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
        const [pr, sk, we, cg, msg] = await Promise.all([
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
        ]);
        setStats({
          projects: Array.isArray(pr?.data) ? pr.data.length : 0,
          skills: Array.isArray(sk?.data) ? sk.data.length : 0,
          experience: Array.isArray(we?.data) ? we.data.length : 0,
          content: cg?.pagination?.total ?? (Array.isArray(cg?.data) ? cg.data.length : 0),
          messages: Array.isArray(msg?.data) ? msg.data.length : 0,
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
      }
    } catch (e) {}
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
        <QuickCard title="About Section" description="Personal info, education, and social links." icon={FaUser} path="/admin/manage/about" router={router} />
        <QuickCard title="Projects" description="Add, edit, or reorder portfolio work." icon={FaFolderOpen} path="/admin/manage/projects" router={router} badge={stats.projects ? `${stats.projects}` : null} />
        <QuickCard title="Tech Stack" description="Skills and technologies marquee." icon={FaLaptopCode} path="/admin/manage/skills" router={router} badge={stats.skills ? `${stats.skills}` : null} />
        <QuickCard title="Work Experience" description="Professional timeline entries." icon={FaBriefcase} path="/admin/manage/work-experience" router={router} badge={stats.experience ? `${stats.experience}` : null} />
        <QuickCard title="Milestones" description="Key years and achievements." icon={FaCalendarAlt} path="/admin/manage/years" router={router} />
        <QuickCard title="Content Gallery" description="AI content gallery items." icon={FaImages} path="/admin/manage/content-generation" router={router} badge={stats.content ? `${stats.content}` : null} />
        <QuickCard title="Contact Info" description="Email, phone, location, social." icon={FaEnvelope} path="/admin/manage/contact" router={router} />
        <QuickCard title="Messages" description="Read inbound contact-form messages." icon={FaInbox} path="/admin/manage/messages" router={router} badge={stats.messages ? `${stats.messages}` : null} />
      </Grid>

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
