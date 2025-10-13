import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from "@chakra-ui/icons";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.username}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#191919"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      position="relative"
    >
      {/* Back Button */}
      <Button
        position="fixed"
        top={4}
        left={4}
        leftIcon={<ArrowBackIcon />}
        colorScheme="yellow"
        variant="ghost"
        onClick={() => router.push("/portfolio-tab")}
        fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
        fontWeight="bold"
        _hover={{
          bg: "#272727",
          transform: "translateX(-2px)",
        }}
      >
        Back to Portfolio
      </Button>

      <Box
        maxW="400px"
        w="full"
        bg="#272727"
        p={8}
        borderRadius="2xl"
        border="2px solid #232323"
        boxShadow="0 8px 20px 0 rgba(226,183,20,0.15)"
      >
        <Heading
          as="h1"
          size="lg"
          color="#e2b714"
          mb={6}
          textAlign="center"
          fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          letterSpacing="2px"
        >
          Admin Login
        </Heading>

        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="#f7d794">Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="#232323"
                border="1px solid #e2b714"
                color="#fff"
                _hover={{ borderColor: "#f7d794" }}
                _focus={{
                  borderColor: "#e2b714",
                  boxShadow: "0 0 0 1px #e2b714",
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="#f7d794">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="#232323"
                  border="1px solid #e2b714"
                  color="#fff"
                  _hover={{ borderColor: "#f7d794" }}
                  _focus={{
                    borderColor: "#e2b714",
                    boxShadow: "0 0 0 1px #e2b714",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    color="#e2b714"
                    _hover={{ bg: "#191919" }}
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="yellow"
              w="full"
              mt={4}
              isLoading={loading}
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="bold"
              letterSpacing="1px"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(226,183,20,0.3)",
              }}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
