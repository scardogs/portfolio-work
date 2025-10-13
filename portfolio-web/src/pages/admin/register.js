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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

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
      bg="#191919"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
    >
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
          Admin Register
        </Heading>

        <form onSubmit={handleRegister}>
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
              <FormLabel color="#f7d794">Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              Register
            </Button>

            <Text color="#f7d794" fontSize="sm" mt={4} textAlign="center">
              Already have an account?{" "}
              <Text
                as="span"
                color="#e2b714"
                cursor="pointer"
                textDecoration="underline"
                onClick={() => router.push("/admin/login")}
                _hover={{ color: "#f7d794" }}
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
