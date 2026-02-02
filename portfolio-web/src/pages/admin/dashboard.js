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
  Divider,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import {
  FaUser,
  FaFolderOpen,
  FaLaptopCode,
  FaEnvelope,
  FaSignOutAlt,
  FaEye,
  FaHome,
  FaBriefcase,
  FaCalendarAlt,
  FaBell,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
    checkSubscription();
  }, [router]);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

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
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const subscribeUser = async () => {
    setSubLoading(true);
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported on this browser');
      }

      const registration = await navigator.serviceWorker.ready;
      const pKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BMfwOcQ_e7U9hbi2XWE-BKgzCNIu8c3BS00m1V49-MW_X"; // Fallback to avoid error if env not loaded yet

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pKey)
      });

      const token = localStorage.getItem("token");
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      });

      const data = await response.json();
      if (data.success) {
        setIsSubscribed(true);
        toast({
          title: "Enabled",
          description: "Push notifications enabled for this device",
          status: "success",
          duration: 3000
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to enable notifications",
        status: "error",
        duration: 3000
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
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        status: "error",
        duration: 3000
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
      isClosable: true,
    });

    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <Box
      minH="100vh"
      bg="#0a0a0a"
      color="#e0e0e0"
      fontFamily="system-ui, -apple-system, sans-serif"
      py={8}
    >
      <Container maxW="container.xl">
        {/* Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={8}
          bg="#141414"
          p={6}
          borderRadius="0"
          border="1px solid #333333"
          gap={4}
        >
          <Box>
            <Heading
              as="h1"
              size="xl"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="4px"
              textTransform="uppercase"
              fontSize="24px"
            >
              Admin Dashboard
            </Heading>
            <Text color="#888888" mt={2} fontWeight="300">
              Welcome back, {user.username}!
            </Text>
          </Box>
          <HStack spacing={3} w={{ base: "full", md: "auto" }} justify={{ base: "space-between", md: "flex-end" }}>
            <Button
              onClick={() => router.push("/")}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              bg="#1a1a1a"
              color="#e0e0e0"
              border="1px solid #333333"
              borderRadius="0"
              textTransform="uppercase"
              letterSpacing="2px"
              leftIcon={<Icon as={FaEye} />}
              flex={{ base: 1, md: "none" }}
              _hover={{
                bg: "#2a2a2a",
                borderColor: "#555555",
              }}
            >
              View
            </Button>
            <Button
              onClick={handleLogout}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              bg="#1a1a1a"
              color="#e0e0e0"
              border="1px solid #333333"
              borderRadius="0"
              textTransform="uppercase"
              letterSpacing="2px"
              leftIcon={<Icon as={FaSignOutAlt} />}
              flex={{ base: 1, md: "none" }}
              _hover={{
                bg: "#2a2a2a",
                borderColor: "#555555",
              }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>

        {/* Content Cards Grid */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={6}
          mb={6}
        >
          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/about")}
          >
            <Icon as={FaUser} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              About Section
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Manage your personal information, job title, and social links
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/projects")}
          >
            <Icon as={FaFolderOpen} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Projects
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Add, edit, or delete your featured projects and portfolio work
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/skills")}
          >
            <Icon as={FaLaptopCode} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Tech Stack
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Update your skills and technologies used in your projects
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/contact")}
          >
            <Icon as={FaEnvelope} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Contact Information
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Manage your email, phone, and social media contact details
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/messages")}
          >
            <Icon as={FaEnvelope} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              User Messages
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              View and respond to messages sent through the contact form
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/work-experience")}
          >
            <Icon as={FaBriefcase} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Work Experience
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Add and manage your professional work history and achievements
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => router.push("/admin/manage/years")}
          >
            <Icon as={FaCalendarAlt} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Years / Milestones
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300">
              Manage key years and milestones reflected in your timeline
            </Text>
          </Box>

          <Box
            bg="#141414"
            p={6}
            borderRadius="0"
            border="1px solid #333333"
            _hover={{
              borderColor: "#555555",
              transform: "translateY(-2px)",
            }}
            transition="all 0.3s"
          >
            <Icon as={FaBell} fontSize="32px" color="#888888" mb={4} />
            <Heading
              as="h3"
              fontSize="16px"
              color="#e0e0e0"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              mb={2}
            >
              Push Notifications
            </Heading>
            <Text color="#888888" fontSize="13px" fontWeight="300" mb={4}>
              Receive alerts directly to this device when a user contact you
            </Text>
            <Button
              size="sm"
              w="full"
              variant="outline"
              borderColor="#333333"
              color="#e0e0e0"
              borderRadius="0"
              fontWeight="300"
              letterSpacing="1px"
              onClick={isSubscribed ? unsubscribeUser : subscribeUser}
              isLoading={subLoading}
              _hover={{ bg: "#1a1a1a", borderColor: "#555555" }}
            >
              {isSubscribed ? "DISABLE NOTIFICATIONS" : "ENABLE NOTIFICATIONS"}
            </Button>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
