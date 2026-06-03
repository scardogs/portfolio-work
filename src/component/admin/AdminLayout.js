import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Icon,
  IconButton,
  Tooltip,
  useToast,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaTachometerAlt,
  FaUser,
  FaFolderOpen,
  FaLaptopCode,
  FaEnvelope,
  FaInbox,
  FaBriefcase,
  FaCalendarAlt,
  FaImages,
  FaBookOpen,
  FaSignOutAlt,
  FaEye,
  FaBars,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

const COLORS = {
  bg: "#0a0a0a",
  panel: "#0f0f0f",
  card: "#141414",
  cardHover: "#1a1a1a",
  border: "#2a2a2a",
  borderStrong: "#3a3a3a",
  text: "#e0e0e0",
  muted: "#888888",
  dim: "#555555",
  accent: "#e2b714",
};

const NAV_ITEMS = [
  { label: "Dashboard", icon: FaTachometerAlt, path: "/admin/dashboard" },
  { label: "About", icon: FaUser, path: "/admin/manage/about" },
  { label: "Projects", icon: FaFolderOpen, path: "/admin/manage/projects" },
  { label: "Tech Stack", icon: FaLaptopCode, path: "/admin/manage/skills" },
  { label: "Work Experience", icon: FaBriefcase, path: "/admin/manage/work-experience" },
  { label: "Milestones", icon: FaCalendarAlt, path: "/admin/manage/years" },
  { label: "Content Gallery", icon: FaImages, path: "/admin/manage/content-generation" },
  { label: "Blog & Notes", icon: FaBookOpen, path: "/admin/manage/blog" },
  { label: "Contact Info", icon: FaEnvelope, path: "/admin/manage/contact" },
  { label: "Messages", icon: FaInbox, path: "/admin/manage/messages" },
];

function NavLink({ item, active, collapsed, onClick }) {
  const inner = (
    <Flex
      align="center"
      gap={3}
      px={collapsed ? 0 : 4}
      py={3}
      mx={collapsed ? 2 : 3}
      borderRadius="8px"
      cursor="pointer"
      role="group"
      onClick={onClick}
      bg={active ? "rgba(226,183,20,0.08)" : "transparent"}
      borderLeft={active ? `2px solid ${COLORS.accent}` : "2px solid transparent"}
      color={active ? COLORS.text : COLORS.muted}
      _hover={{ bg: "rgba(255,255,255,0.04)", color: COLORS.text }}
      transition="all 0.2s ease"
      justify={collapsed ? "center" : "flex-start"}
    >
      <Icon
        as={item.icon}
        boxSize="16px"
        color={active ? COLORS.accent : "inherit"}
        _groupHover={{ color: COLORS.accent }}
        transition="color 0.2s"
      />
      {!collapsed && (
        <Text
          fontSize="13px"
          fontWeight="400"
          letterSpacing="0.5px"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {item.label}
        </Text>
      )}
    </Flex>
  );
  return collapsed ? (
    <Tooltip
      label={item.label}
      placement="right"
      bg={COLORS.card}
      color={COLORS.text}
      border={`1px solid ${COLORS.border}`}
      fontSize="12px"
    >
      {inner}
    </Tooltip>
  ) : (
    inner
  );
}

function SidebarContent({ collapsed, setCollapsed, router, user, onLogout, onNavigate, isMobile }) {
  return (
    <Flex direction="column" h="100%" bg={COLORS.panel}>
      {/* Brand */}
      <Flex
        align="center"
        justify={collapsed ? "center" : "space-between"}
        px={collapsed ? 0 : 5}
        py={5}
        borderBottom={`1px solid ${COLORS.border}`}
        minH="72px"
      >
        {!collapsed && (
          <VStack align="start" spacing={0}>
            <Text
              fontSize="11px"
              color={COLORS.muted}
              letterSpacing="3px"
              textTransform="uppercase"
            >
              Portfolio
            </Text>
            <Text
              fontSize="16px"
              color={COLORS.text}
              fontWeight="600"
              letterSpacing="1px"
            >
              ADMIN
            </Text>
          </VStack>
        )}
        {collapsed && (
          <Box
            w="32px"
            h="32px"
            border={`1px solid ${COLORS.borderStrong}`}
            transform="rotate(45deg)"
            position="relative"
          >
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="10px"
              h="10px"
              bg={COLORS.accent}
            />
          </Box>
        )}
        {!isMobile && !collapsed && (
          <IconButton
            aria-label="Collapse sidebar"
            icon={<FaAngleLeft />}
            size="xs"
            variant="ghost"
            color={COLORS.muted}
            _hover={{ color: COLORS.text, bg: COLORS.card }}
            onClick={() => setCollapsed(true)}
          />
        )}
      </Flex>

      {/* Nav items */}
      <VStack
        spacing={1}
        align="stretch"
        flex="1"
        py={4}
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: COLORS.border, borderRadius: "4px" },
        }}
      >
        {!collapsed && (
          <Text
            fontSize="10px"
            color={COLORS.dim}
            letterSpacing="2px"
            textTransform="uppercase"
            px={6}
            mb={2}
          >
            Manage
          </Text>
        )}
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            active={router.pathname === item.path}
            collapsed={collapsed}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </VStack>

      {/* Footer / user actions */}
      <Box borderTop={`1px solid ${COLORS.border}`} py={3}>
        {!collapsed && user && (
          <Flex
            align="center"
            gap={3}
            px={5}
            py={2}
            mx={3}
            mb={2}
            bg={COLORS.card}
            borderRadius="8px"
            border={`1px solid ${COLORS.border}`}
          >
            <Flex
              align="center"
              justify="center"
              w="32px"
              h="32px"
              bg="rgba(226,183,20,0.1)"
              border={`1px solid ${COLORS.accent}`}
              borderRadius="50%"
              color={COLORS.accent}
              fontSize="12px"
              fontWeight="600"
              flexShrink={0}
            >
              {(user.username || "A").charAt(0).toUpperCase()}
            </Flex>
            <VStack align="start" spacing={0} overflow="hidden">
              <Text
                fontSize="12px"
                color={COLORS.text}
                fontWeight="500"
                noOfLines={1}
              >
                {user.username || "Admin"}
              </Text>
              <Text fontSize="10px" color={COLORS.muted} letterSpacing="1px">
                Online
              </Text>
            </VStack>
          </Flex>
        )}

        <NavLink
          item={{ label: "View Site", icon: FaEye, path: "/" }}
          active={false}
          collapsed={collapsed}
          onClick={() => router.push("/")}
        />
        <NavLink
          item={{ label: "Logout", icon: FaSignOutAlt, path: "__logout" }}
          active={false}
          collapsed={collapsed}
          onClick={onLogout}
        />

        {!isMobile && collapsed && (
          <Flex justify="center" mt={2}>
            <IconButton
              aria-label="Expand sidebar"
              icon={<FaAngleRight />}
              size="xs"
              variant="ghost"
              color={COLORS.muted}
              _hover={{ color: COLORS.text, bg: COLORS.card }}
              onClick={() => setCollapsed(false)}
            />
          </Flex>
        )}
      </Box>
    </Flex>
  );
}

export default function AdminLayout({ title, subtitle, actions, children }) {
  const router = useRouter();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !router.isReady) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!token || !userData) {
      router.replace("/admin/login");
      return;
    }
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/admin/login");
    }
  }, [mounted, router.isReady]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
      status: "info",
      duration: 2000,
    });
    router.replace("/admin/login");
  };

  const handleNavigate = (path) => {
    if (isMobile) onClose();
    router.push(path);
  };

  if (!mounted || !user) {
    return (
      <Box
        minH="100vh"
        bg={COLORS.bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        suppressHydrationWarning
      >
        <VStack spacing={4} suppressHydrationWarning>
          <Box
            w="48px"
            h="48px"
            border={`2px solid ${COLORS.border}`}
            borderTopColor={COLORS.accent}
            borderRadius="50%"
            sx={{
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Text
            color={COLORS.muted}
            fontSize="11px"
            fontWeight="400"
            letterSpacing="3px"
            textTransform="uppercase"
          >
            Loading
          </Text>
        </VStack>
      </Box>
    );
  }

  const sidebarWidth = collapsed ? "72px" : "240px";

  return (
    <Flex minH="100vh" bg={COLORS.bg} color={COLORS.text} fontFamily="system-ui, -apple-system, sans-serif">
      {/* Desktop sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w={sidebarWidth}
        borderRight={`1px solid ${COLORS.border}`}
        transition="width 0.25s ease"
        zIndex={20}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          router={router}
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          isMobile={false}
        />
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay bg="blackAlpha.700" />
        <DrawerContent bg={COLORS.panel} maxW="260px">
          <DrawerCloseButton color={COLORS.muted} _hover={{ color: COLORS.text }} />
          <DrawerBody p={0}>
            <SidebarContent
              collapsed={false}
              setCollapsed={() => {}}
              router={router}
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              isMobile={true}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box
        flex="1"
        ml={{ base: 0, md: sidebarWidth }}
        transition="margin-left 0.25s ease"
        minH="100vh"
      >
        {/* Top bar */}
        <Flex
          position="sticky"
          top={0}
          zIndex={10}
          align="center"
          justify="space-between"
          px={[4, 6, 8]}
          py={4}
          bg="rgba(10,10,10,0.85)"
          backdropFilter="blur(12px)"
          borderBottom={`1px solid ${COLORS.border}`}
        >
          <HStack spacing={3}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaBars />}
              aria-label="Open menu"
              variant="ghost"
              color={COLORS.muted}
              _hover={{ color: COLORS.text, bg: COLORS.card }}
              onClick={onOpen}
            />
            <Box>
              {subtitle && (
                <Text
                  fontSize="10px"
                  color={COLORS.muted}
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  {subtitle}
                </Text>
              )}
              <Text
                fontSize={["18px", "20px", "22px"]}
                color={COLORS.text}
                fontWeight="600"
                letterSpacing="-0.5px"
                lineHeight="1.2"
              >
                {title}
              </Text>
            </Box>
          </HStack>
          {actions && <HStack spacing={2}>{actions}</HStack>}
        </Flex>

        {/* Page content */}
        <Box px={[4, 6, 8]} py={[6, 8]}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}

export { COLORS };
