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
  Container,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function ManageContact() {
  const [formData, setFormData] = useState({
    facebook: "",
    facebookUsername: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact");
      const data = await response.json();

      if (data.success && data.data) {
        setFormData({
          facebook: data.data.facebook || "",
          facebookUsername: data.data.facebookUsername || "",
          email: data.data.email || "",
          mobile: data.data.mobile || "",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Contact information updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return (
      <Box
        minH="100vh"
        bg="#191919"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Heading color="#e2b714">Loading...</Heading>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="#191919"
      fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
      py={8}
    >
      <Container maxW="container.md">
        <Flex align="center" mb={6}>
          <IconButton
            icon={<ArrowBackIcon />}
            colorScheme="yellow"
            variant="outline"
            mr={4}
            onClick={() => router.push("/admin/dashboard")}
            aria-label="Back to dashboard"
          />
          <Heading
            as="h1"
            size="xl"
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            letterSpacing="2px"
          >
            Manage Contact Information
          </Heading>
        </Flex>

        <Box
          bg="#272727"
          p={8}
          borderRadius="2xl"
          border="2px solid #232323"
          boxShadow="0 8px 20px 0 rgba(226,183,20,0.15)"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="#f7d794">Facebook URL</FormLabel>
                <Input
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://www.facebook.com/username"
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
                <FormLabel color="#f7d794">Facebook Username</FormLabel>
                <Input
                  name="facebookUsername"
                  value={formData.facebookUsername}
                  onChange={handleChange}
                  placeholder="@username"
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                <FormLabel color="#f7d794">Mobile Number</FormLabel>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
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
                Update Contact Information
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
