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
    location: "",
    githubLink: "",
    linkedinLink: "",
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
          location: data.data.location || "",
          githubLink: data.data.githubLink || "",
          linkedinLink: data.data.linkedinLink || "",
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
        bg="#0a0a0a"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Heading fontWeight="300">Loading...</Heading>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="#0a0a0a"
      color="#e0e0e0"
      fontFamily="system-ui, -apple-system, sans-serif"
      py={8}
    >
      <Container maxW="container.md">
        <Flex align="center" mb={6}>
          <IconButton
            icon={<ArrowBackIcon />}
            colorScheme="gray"
            variant="outline"
            mr={4}
            onClick={() => router.push("/admin/dashboard")}
            aria-label="Back to dashboard"
            borderColor="#333333"
            color="#888888"
            _hover={{ color: "#e0e0e0", borderColor: "#555555" }}
          />
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
            Manage Contact Information
          </Heading>
        </Flex>

        <Box bg="#141414" p={8} borderRadius="0" border="1px solid #333333">
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Facebook URL
                </FormLabel>
                <Input
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://www.facebook.com/username"
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
                  Facebook Username
                </FormLabel>
                <Input
                  name="facebookUsername"
                  value={formData.facebookUsername}
                  onChange={handleChange}
                  placeholder="@username"
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  Mobile Number
                </FormLabel>
                <Input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
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
                  Location
                </FormLabel>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Cebu City, PH"
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  GitHub Link
                </FormLabel>
                <Input
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  LinkedIn Link
                </FormLabel>
                <Input
                  name="linkedinLink"
                  value={formData.linkedinLink}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
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
                Update Contact Information
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
