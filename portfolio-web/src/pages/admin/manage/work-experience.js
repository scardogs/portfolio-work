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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function ManageWorkExperience() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: "Present",
    technologies: "",
    location: "",
    order: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/work-experience");
      const data = await response.json();

      if (data.success) {
        setExperiences(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch work experiences",
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
    const url = editingId
      ? `/api/work-experience/${editingId}`
      : "/api/work-experience/create";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingId ? "Updated" : "Created",
          description: `Work experience ${
            editingId ? "updated" : "created"
          } successfully`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchExperiences();
        handleClose();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save",
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

  const handleEdit = (experience) => {
    setFormData({
      ...experience,
      technologies: experience.technologies.join(", "),
    });
    setEditingId(experience._id);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this work experience?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/work-experience/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Deleted",
          description: "Work experience deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchExperiences();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete",
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
    }
  };

  const handleClose = () => {
    setFormData({
      company: "",
      position: "",
      description: "",
      startDate: "",
      endDate: "Present",
      technologies: "",
      location: "",
      order: 0,
    });
    setEditingId(null);
    onClose();
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
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" mb={6}>
          <Flex align="center">
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
              Manage Work Experience
            </Heading>
          </Flex>
          <Button
            onClick={onOpen}
            bg="#1a1a1a"
            color="#e0e0e0"
            border="1px solid #333333"
            borderRadius="0"
            fontWeight="300"
            letterSpacing="2px"
            textTransform="uppercase"
            _hover={{
              bg: "#2a2a2a",
              borderColor: "#555555",
            }}
          >
            Add Experience
          </Button>
        </Flex>

        <Box bg="#141414" p={8} borderRadius="0" border="1px solid #333333">
          {experiences.length === 0 ? (
            <Text color="#888888" textAlign="center">
              No work experiences found. Click "Add Experience" to create one.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {experiences.map((experience) => (
                <Box
                  key={experience._id}
                  bg="#1a1a1a"
                  p={6}
                  border="1px solid #333333"
                  borderRadius="0"
                  _hover={{
                    borderColor: "#555555",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s"
                >
                  <Heading
                    fontSize="18px"
                    color="#e0e0e0"
                    mb={2}
                    fontWeight="600"
                  >
                    {experience.position}
                  </Heading>
                  <Text color="#888888" fontSize="14px" mb={2}>
                    {experience.company}
                  </Text>
                  <Text color="#666666" fontSize="12px" mb={3}>
                    {experience.startDate} - {experience.endDate}
                  </Text>
                  <Text color="#e0e0e0" fontSize="13px" mb={3} noOfLines={3}>
                    {experience.description}
                  </Text>
                  {experience.technologies?.length > 0 && (
                    <HStack mb={3} flexWrap="wrap">
                      {experience.technologies.slice(0, 4).map((tech, idx) => (
                        <Box
                          key={idx}
                          px={2}
                          py={1}
                          bg="#141414"
                          border="1px solid #333333"
                          borderRadius="0"
                        >
                          <Text fontSize="10px" color="#888888">
                            {tech}
                          </Text>
                        </Box>
                      ))}
                    </HStack>
                  )}
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="#333333"
                      color="#e0e0e0"
                      bg="#141414"
                      onClick={() => handleEdit(experience)}
                      fontWeight="300"
                      letterSpacing="1px"
                      textTransform="uppercase"
                      borderRadius="0"
                      _hover={{
                        bg: "#2a2a2a",
                        borderColor: "#555555",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="#333333"
                      color="#ff4444"
                      bg="#141414"
                      onClick={() => handleDelete(experience._id)}
                      fontWeight="300"
                      letterSpacing="1px"
                      textTransform="uppercase"
                      borderRadius="0"
                      _hover={{
                        bg: "#2a2a2a",
                        borderColor: "#ff4444",
                      }}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Modal for Add/Edit */}
        <Modal isOpen={isOpen} onClose={handleClose} size="xl">
          <ModalOverlay bg="blackAlpha.800" />
          <ModalContent
            bg="#141414"
            color="#e0e0e0"
            border="1px solid #333333"
            borderRadius="0"
          >
            <ModalHeader
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="300"
              letterSpacing="2px"
              textTransform="uppercase"
              fontSize="14px"
            >
              {editingId ? "Edit" : "Add"} Work Experience
            </ModalHeader>
            <ModalCloseButton color="#888888" _hover={{ color: "#e0e0e0" }} />
            <ModalBody>
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
                      Position Title
                    </FormLabel>
                    <Input
                      name="position"
                      value={formData.position}
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
                      Company Name
                    </FormLabel>
                    <Input
                      name="company"
                      value={formData.company}
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
                      Location
                    </FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
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
                      Description
                    </FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
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

                  <FormControl isRequired>
                    <FormLabel
                      color="#888888"
                      fontSize="11px"
                      fontWeight="400"
                      letterSpacing="2px"
                      textTransform="uppercase"
                    >
                      Start Date
                    </FormLabel>
                    <Input
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      placeholder="e.g., Jan 2020"
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
                      End Date
                    </FormLabel>
                    <Input
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      placeholder="e.g., Present, Dec 2023"
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
                      Technologies (comma separated)
                    </FormLabel>
                    <Input
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
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
                    {editingId ? "Update" : "Create"} Experience
                  </Button>
                </VStack>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
