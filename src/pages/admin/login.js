import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
  Link,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from "@chakra-ui/icons";

export default function AdminLogin() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [authStatus, setAuthStatus] = useState("Idle");

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication once router is ready and only when mounted
  useEffect(() => {
    if (!mounted || !router.isReady) return;

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      console.log("Already authenticated, redirecting to dashboard...");
      router.replace("/admin/dashboard");
    }
  }, [mounted, router.isReady]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthStatus("Attempting login...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthStatus("Login success! Saving session...");
        
        // Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.username}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setAuthStatus("Redirecting to dashboard...");

        // Small delay to ensure localStorage is flushed and UI updates
        setTimeout(() => {
          router.push("/admin/dashboard").catch(() => {
            window.location.href = "/admin/dashboard";
          });
        }, 500);
      } else {
        setAuthStatus("Login failed: " + (data.message || "Invalid credentials"));
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthStatus("Error during login.");
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center">
        <Text color="#444444">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#0a0a0a"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      <Button
        position="fixed"
        top={4}
        left={4}
        leftIcon={<ArrowBackIcon />}
        variant="ghost"
        onClick={() => router.push("/")}
        color="#888888"
        _hover={{ color: "#e0e0e0" }}
      >
        Back to Portfolio
      </Button>

      <Box maxW="400px" w="full" bg="#141414" p={8} border="1px solid #333333">
        <Heading as="h1" size="lg" color="#e0e0e0" mb={6} textAlign="center" fontWeight="300" letterSpacing="4px" textTransform="uppercase" fontSize="14px">
          Admin Login
        </Heading>

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="#888888" fontSize="11px" fontWeight="400" letterSpacing="2px" textTransform="uppercase">Username</FormLabel>
              <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} bg="#1a1a1a" border="1px solid #333333" color="#e0e0e0" borderRadius="0" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="#888888" fontSize="11px" fontWeight="400" letterSpacing="2px" textTransform="uppercase">Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} bg="#1a1a1a" border="1px solid #333333" color="#e0e0e0" borderRadius="0" />
                <InputRightElement>
                  <IconButton aria-label="Toggle Password" icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={() => setShowPassword(!showPassword)} variant="ghost" color="#888888" size="sm" />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Box w="full">
              <Checkbox isChecked={remember} onChange={(e) => setRemember(e.target.checked)} colorScheme="gray">
                <Text color="#888888" fontSize="13px" fontWeight="300">Remember this device</Text>
              </Checkbox>
            </Box>

            <Button type="submit" w="full" mt={4} isLoading={loading} bg="#1a1a1a" color="#e0e0e0" border="1px solid #333333" borderRadius="0" textTransform="uppercase" letterSpacing="2px" fontWeight="300">
              Login
            </Button>
          </VStack>
        </form>

        <Box mt={6} pt={4} borderTop="1px solid #333333" textAlign="center">
          <Text color="#888888" fontSize="12px" mb={2}>{authStatus}</Text>
          <HStack justify="center" spacing={4}>
            <Link color="#e2b714" fontSize="12px" onClick={() => router.replace("/admin/dashboard")}>Dashboard Link</Link>
            <Button size="xs" colorScheme="red" variant="link" onClick={() => { localStorage.clear(); window.location.reload(); }}>Clear session</Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
