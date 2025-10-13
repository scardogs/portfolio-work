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
} from "@chakra-ui/react";
import { useRouter } from "next/router";

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
  }, [router]);

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
      bg="#191919"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      py={8}
    >
      <Container maxW="container.xl">
        <Flex
          justify="space-between"
          align="center"
          mb={8}
          bg="#272727"
          p={6}
          borderRadius="2xl"
          border="2px solid #232323"
        >
          <Box>
            <Heading
              as="h1"
              size="xl"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              letterSpacing="2px"
            >
              Admin Dashboard
            </Heading>
            <Text color="#f7d794" mt={2}>
              Welcome back, {user.username}!
            </Text>
          </Box>
          <Button
            colorScheme="red"
            onClick={handleLogout}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            fontWeight="bold"
          >
            Logout
          </Button>
        </Flex>

        <Box
          bg="#272727"
          p={8}
          borderRadius="2xl"
          border="2px solid #232323"
          boxShadow="0 8px 20px 0 rgba(226,183,20,0.15)"
        >
          <Heading
            as="h2"
            size="lg"
            color="#e2b714"
            mb={6}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            letterSpacing="1px"
          >
            Manage Portfolio Content
          </Heading>

          <Divider borderColor="#e2b714" mb={6} />

          <VStack spacing={4} align="stretch">
            <Button
              size="lg"
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              onClick={() => router.push("/admin/manage/about")}
            >
              Manage About Section
            </Button>

            <Button
              size="lg"
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              onClick={() => router.push("/admin/manage/projects")}
            >
              Manage Projects
            </Button>

            <Button
              size="lg"
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              onClick={() => router.push("/admin/manage/skills")}
            >
              Manage Skills
            </Button>

            <Button
              size="lg"
              colorScheme="yellow"
              variant="outline"
              borderColor="#e2b714"
              color="#e2b714"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                bg: "#191919",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.2)",
              }}
              onClick={() => router.push("/admin/manage/contact")}
            >
              Manage Contact Information
            </Button>
          </VStack>

          <Box mt={8} p={6} bg="#232323" borderRadius="xl">
            <Heading
              as="h3"
              size="md"
              color="#e2b714"
              mb={4}
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            >
              Quick Actions
            </Heading>
            <HStack spacing={4}>
              <Button
                size="md"
                colorScheme="yellow"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                onClick={() => router.push("/")}
              >
                View Portfolio
              </Button>
              <Button
                size="md"
                variant="outline"
                borderColor="#e2b714"
                color="#e2b714"
                fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                onClick={() => window.location.reload()}
              >
                Refresh Dashboard
              </Button>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
