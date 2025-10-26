import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  VStack,
  useToast,
  Container,
  Flex,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ImageUploader from "../../../component/admin/ImageUploader";

export default function ManageAbout() {
  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
    description: "",
    languages: "",
    education: "",
    jobTitle: "",
    tagline: "",
    quote: "",
    currentJobTitle: "",
    currentCompany: "",
    githubLink: "",
    linkedinLink: "",
    portfolioLink: "",
    emailLink: "",
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

    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/about");
      const data = await response.json();

      if (data.success && data.data) {
        setFormData({
          name: data.data.name || "",
          profileImage: data.data.profileImage || "",
          description: data.data.description || "",
          languages: data.data.languages?.join("\n") || "",
          education: data.data.education || "",
          jobTitle: data.data.jobTitle || "",
          tagline: data.data.tagline || "",
          quote: data.data.quote || "",
          currentJobTitle: data.data.currentJobTitle || "",
          currentCompany: data.data.currentCompany || "",
          githubLink: data.data.githubLink || "",
          linkedinLink: data.data.linkedinLink || "",
          portfolioLink: data.data.portfolioLink || "",
          emailLink: data.data.emailLink || "",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch about data",
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
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          profileImage: formData.profileImage,
          description: formData.description,
          languages: formData.languages
            .split("\n")
            .filter((lang) => lang.trim()),
          education: formData.education,
          jobTitle: formData.jobTitle,
          tagline: formData.tagline,
          quote: formData.quote,
          currentJobTitle: formData.currentJobTitle,
          currentCompany: formData.currentCompany,
          githubLink: formData.githubLink,
          linkedinLink: formData.linkedinLink,
          portfolioLink: formData.portfolioLink,
          emailLink: formData.emailLink,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("About data updated:", data.data);
        toast({
          title: "Success",
          description: "About section updated successfully",
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
        <Heading color="#e0e0e0" fontWeight="300">
          Loading...
        </Heading>
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
            Manage About Section
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
                  Name
                </FormLabel>
                <Input
                  name="name"
                  value={formData.name}
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

              <FormControl>
                <ImageUploader
                  label="Profile Image"
                  currentImage={formData.profileImage}
                  onImageSelect={(url) =>
                    setFormData({ ...formData, profileImage: url })
                  }
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
                  Description
                </FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
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
                  Languages (one per line)
                </FormLabel>
                <Textarea
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="English (Intermediate)&#10;Tagalog (Fluent)"
                  rows={4}
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
                  Education
                </FormLabel>
                <Input
                  name="education"
                  value={formData.education}
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Job Title (e.g., Software Engineer) - THIS IS THE MAIN TITLE
                  IN HERO SECTION
                </FormLabel>
                <Input
                  name="jobTitle"
                  value={formData.jobTitle}
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Tagline (e.g., Building thoughtful digital experiences)
                </FormLabel>
                <Input
                  name="tagline"
                  value={formData.tagline}
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Quote (for About Section)
                </FormLabel>
                <Textarea
                  name="quote"
                  value={formData.quote}
                  onChange={handleChange}
                  rows={3}
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

              <Divider borderColor="#333333" borderWidth="1px" my={6} />

              <Heading
                as="h3"
                fontSize="14px"
                fontWeight="300"
                color="#e0e0e0"
                mb={4}
                letterSpacing="4px"
                textTransform="uppercase"
              >
                Current Employment
              </Heading>

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Current Job Title (e.g., Software Developer) - FOR EXPERIENCE
                  BOX
                </FormLabel>
                <Input
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Current Company
                </FormLabel>
                <Input
                  name="currentCompany"
                  value={formData.currentCompany}
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

              <Divider borderColor="#333333" borderWidth="1px" my={6} />

              <Heading
                as="h3"
                fontSize="14px"
                fontWeight="300"
                color="#e0e0e0"
                mb={4}
                letterSpacing="4px"
                textTransform="uppercase"
              >
                Social Links
              </Heading>

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

              <FormControl>
                <FormLabel
                  color="#888888"
                  fontSize="11px"
                  fontWeight="400"
                  letterSpacing="2px"
                  textTransform="uppercase"
                >
                  Portfolio Website Link (optional)
                </FormLabel>
                <Input
                  name="portfolioLink"
                  value={formData.portfolioLink}
                  onChange={handleChange}
                  placeholder="https://portfolio.com"
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

              <Divider borderColor="#333333" borderWidth="1px" my={6} />

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
                h="50px"
                fontSize="14px"
                _hover={{
                  bg: "#2a2a2a",
                  borderColor: "#555555",
                  transform: "translateY(-1px)",
                }}
                _loading={{
                  bg: "#1a1a1a",
                }}
              >
                Update About Section
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
