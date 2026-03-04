import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  useToast,
  Text,
  Container,
  Flex,
  Icon,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaUser,
  FaFolderOpen,
  FaLaptopCode,
  FaEnvelope,
  FaSignOutAlt,
  FaEye,
  FaBriefcase,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const toast = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !router.isReady) return;

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      console.log("Unauthorized access, redirecting to login...");
      router.replace("/admin/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      checkSubscription();
    } catch (e) {
      console.error("Dashboard JSON parse error:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.replace("/admin/login");
    }
  }, [mounted, router.isReady]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (e) {
        console.log("Service worker check failed:", e);
      }
    }
  };

  const subscribeUser = async () => {
    setSubLoading(true);
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Push notifications not supported on this browser");
      }

      const registration = await navigator.serviceWorker.ready;
      const pKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BMfwOcQ_e7U9hbi2XWE-BKgzCNIu8c3BS00m1V49-MW_X";

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pKey),
      });

      const token = localStorage.getItem("token");
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubscribed(true);
        toast({
          title: "Enabled",
          description: "Push notifications enabled",
          status: "success",
          duration: 3000,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to enable notifications",
        status: "error",
        duration: 3000,
      });
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
        toast({
          title: "Disabled",
          description: "Push notifications disabled",
          status: "info",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSubLoading(false);
    }
  };

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

  if (!mounted || !user) {
    return (
      <Box 
        minH="100vh" 
        bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        suppressHydrationWarning
      >
        <VStack spacing={4} suppressHydrationWarning>
          <Box
            w="60px"
            h="60px"
            border="3px solid rgba(226, 183, 20, 0.2)"
            borderTopColor="#e2b714"
            borderRadius="50%"
            animation="spin 1s linear infinite"
            sx={{
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Text 
            color="#e0e0e0" 
            fontWeight="400" 
            fontSize="lg"
            letterSpacing="2px"
          >
            Loading Dashboard...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)" 
      color="#e0e0e0" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      py={8}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(226, 183, 20, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(226, 183, 20, 0.05) 0%, transparent 50%)",
        pointerEvents: "none",
      }}
    >
      <Container maxW="container.xl" position="relative" zIndex={1}>
        {/* Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={10}
          bg="rgba(20, 20, 20, 0.6)"
          backdropFilter="blur(20px)"
          p={8}
          borderRadius="20px"
          border="1px solid rgba(226, 183, 20, 0.2)"
          gap={4}
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.3)"
          transition="all 0.3s"
          _hover={{
            borderColor: "rgba(226, 183, 20, 0.4)",
            boxShadow: "0 12px 48px rgba(226, 183, 20, 0.1)",
          }}
        >
          <Box>
            <Heading 
              as="h1" 
              size="xl" 
              bgGradient="linear(to-r, #e2b714, #f4d03f)" 
              bgClip="text" 
              fontWeight="600" 
              letterSpacing="3px" 
              textTransform="uppercase" 
              fontSize="28px"
              mb={2}
            >
              Admin Dashboard
            </Heading>
            <Text color="#a0a0a0" fontWeight="400" fontSize="md">
              Welcome back, <Text as="span" color="#e2b714" fontWeight="500">{user.username}</Text>!
            </Text>
          </Box>
          <HStack spacing={3} w={{ base: "full", md: "auto" }}>
            <Button
              onClick={() => router.push("/")}
              bg="rgba(26, 26, 26, 0.8)"
              color="#e0e0e0"
              border="1px solid rgba(226, 183, 20, 0.3)"
              borderRadius="12px"
              leftIcon={<Icon as={FaEye} />}
              _hover={{ 
                bg: "rgba(226, 183, 20, 0.1)", 
                borderColor: "#e2b714",
                transform: "translateY(-2px)",
              }}
              transition="all 0.3s"
              px={6}
            >
              View Site
            </Button>
            <Button
              onClick={handleLogout}
              bg="rgba(26, 26, 26, 0.8)"
              color="#e0e0e0"
              border="1px solid rgba(255, 82, 82, 0.3)"
              borderRadius="12px"
              leftIcon={<Icon as={FaSignOutAlt} />}
              _hover={{ 
                bg: "rgba(255, 82, 82, 0.1)", 
                borderColor: "#ff5252",
                transform: "translateY(-2px)",
              }}
              transition="all 0.3s"
              px={6}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

        {/* Content Cards Grid */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {renderDashboardCard("About Section", "Manage personal info and social links", FaUser, "/admin/manage/about", router)}
          {renderDashboardCard("Projects", "Add, edit, or delete portfolio work", FaFolderOpen, "/admin/manage/projects", router)}
          {renderDashboardCard("Tech Stack", "Update skills and technologies", FaLaptopCode, "/admin/manage/skills", router)}
          {renderDashboardCard("Contact Info", "Manage contact details", FaEnvelope, "/admin/manage/contact", router)}
          {renderDashboardCard("User Messages", "View messages from contact form", FaEnvelope, "/admin/manage/messages", router)}
          {renderDashboardCard("Work Experience", "Manage professional history", FaBriefcase, "/admin/manage/work-experience", router)}
          {renderDashboardCard("Milestones", "Manage key years and milestones", FaCalendarAlt, "/admin/manage/years", router)}
          {renderDashboardCard("Content Gen", "Manage content generation section", FaLaptopCode, "/admin/manage/content-generation", router)}

          <Box 
            bg="rgba(20, 20, 20, 0.6)" 
            backdropFilter="blur(20px)"
            p={6} 
            borderRadius="16px"
            border="1px solid rgba(226, 183, 20, 0.2)"
            boxShadow="0 4px 24px rgba(0, 0, 0, 0.2)"
            transition="all 0.3s"
            _hover={{
              borderColor: "rgba(226, 183, 20, 0.5)",
              transform: "translateY(-4px)",
              boxShadow: "0 8px 32px rgba(226, 183, 20, 0.15)",
            }}
          >
            <Icon as={FaBell} fontSize="32px" color="#e2b714" mb={4} />
            <Heading as="h3" fontSize="16px" color="#e0e0e0" fontWeight="500" mb={2} letterSpacing="1px">
              PUSH NOTIFICATIONS
            </Heading>
            <Text color="#a0a0a0" fontSize="13px" mb={4} lineHeight="1.6">
              Receive alerts directly to this device
            </Text>
            <Button
              size="sm"
              w="full"
              bg={isSubscribed ? "rgba(255, 82, 82, 0.1)" : "rgba(226, 183, 20, 0.1)"}
              color={isSubscribed ? "#ff5252" : "#e2b714"}
              border={`1px solid ${isSubscribed ? "rgba(255, 82, 82, 0.3)" : "rgba(226, 183, 20, 0.3)"}`}
              borderRadius="8px"
              onClick={isSubscribed ? unsubscribeUser : subscribeUser}
              isLoading={subLoading}
              _hover={{
                bg: isSubscribed ? "rgba(255, 82, 82, 0.2)" : "rgba(226, 183, 20, 0.2)",
                borderColor: isSubscribed ? "#ff5252" : "#e2b714",
              }}
              transition="all 0.3s"
              fontWeight="500"
            >
              {isSubscribed ? "DISABLE" : "ENABLE"}
            </Button>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

function renderDashboardCard(title, description, icon, path, router) {
  return (
    <Box
      bg="rgba(20, 20, 20, 0.6)"
      backdropFilter="blur(20px)"
      p={6}
      borderRadius="16px"
      border="1px solid rgba(226, 183, 20, 0.2)"
      cursor="pointer"
      onClick={() => router.push(path)}
      boxShadow="0 4px 24px rgba(0, 0, 0, 0.2)"
      transition="all 0.3s"
      position="relative"
      overflow="hidden"
      _hover={{ 
        borderColor: "rgba(226, 183, 20, 0.5)", 
        transform: "translateY(-4px)",
        boxShadow: "0 8px 32px rgba(226, 183, 20, 0.15)",
      }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: "linear-gradient(135deg, rgba(226, 183, 20, 0.05) 0%, transparent 100%)",
        opacity: 0,
        transition: "opacity 0.3s",
      }}
      sx={{
        "&:hover::before": {
          opacity: 1,
        }
      }}
    >
      <Icon as={icon} fontSize="32px" color="#e2b714" mb={4} position="relative" zIndex={1} />
      <Heading 
        as="h3" 
        fontSize="16px" 
        color="#e0e0e0" 
        fontWeight="500" 
        textTransform="uppercase" 
        mb={2}
        letterSpacing="1px"
        position="relative" 
        zIndex={1}
      >
        {title}
      </Heading>
      <Text color="#a0a0a0" fontSize="13px" lineHeight="1.6" position="relative" zIndex={1}>
        {description}
      </Text>
    </Box>
  );
}
