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

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast({
          title: "Registration Successful",
          description: `Welcome, ${data.user.username}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
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
      bg="#0a0a0a"
      fontFamily="system-ui, -apple-system, sans-serif"
      position="relative"
    >
      {/* Back Button */}
      <Button
        position="fixed"
        top={4}
        left={4}
        leftIcon={<ArrowBackIcon />}
        colorScheme="gray"
        variant="ghost"
        onClick={() => router.push("/")}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="300"
        color="#888888"
        _hover={{
          color: "#e0e0e0",
          transform: "translateX(-2px)",
        }}
      >
        Back to Portfolio
      </Button>

      <Box
        maxW="400px"
        w="full"
        bg="#141414"
        p={8}
        borderRadius="0"
        border="1px solid #333333"
      >
        <Heading
          as="h1"
          size="lg"
          color="#e0e0e0"
          mb={6}
          textAlign="center"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="300"
          letterSpacing="4px"
          textTransform="uppercase"
          fontSize="14px"
        >
          Admin Register
        </Heading>

        <form onSubmit={handleRegister}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel
                color="#888888"
                fontSize="11px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
              >
                Username
              </FormLabel>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="#1a1a1a"
                border="1px solid #333333"
                color="#e0e0e0"
                borderRadius="0"
                _hover={{ borderColor: "#555555" }}
                _focus={{
                  borderColor: "#888888",
                  boxShadow: "0 0 0 1px #888888",
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                color="#888888"
                fontSize="11px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
              >
                Email
              </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                bg="#1a1a1a"
                border="1px solid #333333"
                color="#e0e0e0"
                borderRadius="0"
                _hover={{ borderColor: "#555555" }}
                _focus={{
                  borderColor: "#888888",
                  boxShadow: "0 0 0 1px #888888",
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                color="#888888"
                fontSize="11px"
                fontWeight="400"
                letterSpacing="2px"
                textTransform="uppercase"
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="#1a1a1a"
                  border="1px solid #333333"
                  color="#e0e0e0"
                  borderRadius="0"
                  _hover={{ borderColor: "#555555" }}
                  _focus={{
                    borderColor: "#888888",
                    boxShadow: "0 0 0 1px #888888",
                  }}
                  minLength={6}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    color="#888888"
                    _hover={{ color: "#e0e0e0", bg: "#1a1a1a" }}
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              w="full"
              mt={4}
              isLoading={loading}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              bg="#1a1a1a"
              color="#e0e0e0"
              border="1px solid #333333"
              borderRadius="0"
              _hover={{
                bg: "#2a2a2a",
                borderColor: "#555555",
                transform: "translateY(-1px)",
              }}
              _loading={{
                bg: "#1a1a1a",
              }}
            >
              Register
            </Button>

            <Text
              color="#888888"
              fontSize="sm"
              mt={4}
              textAlign="center"
              fontWeight="300"
            >
              Already have an account?{" "}
              <Text
                as="span"
                color="#e0e0e0"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => router.push("/admin/login")}
                _hover={{ color: "#888888" }}
              >
                Login here
              </Text>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
