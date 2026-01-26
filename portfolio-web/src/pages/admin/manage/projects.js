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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Text,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon, EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import ImageUploader from "../../../component/admin/ImageUploader";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    img: "",
    website: "",
    projectDate: "",
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

    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects",
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
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
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
          description: editingId
            ? "Project updated successfully"
            : "Project created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchProjects();
        handleCloseModal();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save project",
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

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      github: project.github,
      img: project.img,
      website: project.website || "",
      projectDate: project.projectDate || "",
      order: project.order || 0,
    });
    setEditingId(project._id);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchProjects();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCloseModal = () => {
    setFormData({
      title: "",
      description: "",
      github: "",
      img: "",
      website: "",
      projectDate: "",
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
        color="#e0e0e0"
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
              Manage Projects
            </Heading>
          </Flex>
          <Button
            leftIcon={<AddIcon />}
            bg="#1a1a1a"
            color="#e0e0e0"
            border="1px solid #333333"
            borderRadius="0"
            fontWeight="300"
            letterSpacing="2px"
            textTransform="uppercase"
            onClick={onOpen}
            _hover={{
              bg: "#2a2a2a",
              borderColor: "#555555",
            }}
          >
            Add Project
          </Button>
        </Flex>

        <Box bg="#141414" p={8} borderRadius="0" border="1px solid #333333">
          {projects.length === 0 ? (
            <Text color="#888888" textAlign="center">
              No projects found. Click "Add Project" to create one.
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {projects.map((project) => (
                <Box
                  key={project._id}
                  bg="#1a1a1a"
                  borderRadius="0"
                  border="1px solid #333333"
                  overflow="hidden"
                  _hover={{
                    borderColor: "#555555",
                    transform: "translateY(-4px)",
                  }}
                  transition="all 0.3s"
                >
                  <Box h="200px" bg="#0a0a0a" position="relative">
                    <img
                      src={project.img}
                      alt={project.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "20px",
                        filter: "grayscale(100%)",
                      }}
                    />
                  </Box>
                  <Box p={6}>
                    <Heading
                      fontSize="18px"
                      color="#e0e0e0"
                      mb={2}
                      fontWeight="600"
                      noOfLines={1}
                    >
                      {project.title}
                    </Heading>
                    <Text color="#888888" fontSize="13px" mb={4} noOfLines={3}>
                      {project.description}
                    </Text>
                    <HStack spacing={2} mb={4}>
                      <Text
                        fontSize="11px"
                        color="#666666"
                        fontWeight="400"
                        letterSpacing="1px"
                        textTransform="uppercase"
                      >
                        Order: {project.order}
                      </Text>
                      {project.projectDate && (
                        <>
                          <Text color="#333333">|</Text>
                          <Text
                            fontSize="11px"
                            color="#666666"
                            fontWeight="400"
                            letterSpacing="1px"
                            textTransform="uppercase"
                          >
                            {project.projectDate}
                          </Text>
                        </>
                      )}
                    </HStack>
                    <Divider borderColor="#333333" mb={4} />
                    <HStack spacing={2} justify="flex-end">
                      <IconButton
                        icon={<EditIcon />}
                        aria-label="Edit project"
                        size="sm"
                        variant="ghost"
                        color="#888888"
                        _hover={{ color: "#e0e0e0", bg: "#2a2a2a" }}
                        onClick={() => handleEdit(project)}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete project"
                        size="sm"
                        variant="ghost"
                        color="#ff4444"
                        _hover={{ color: "#ff6666", bg: "#2a2a2a" }}
                        onClick={() => handleDelete(project._id)}
                      />
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
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
            {editingId ? "Edit" : "Add"} Project
          </ModalHeader>
          <ModalCloseButton color="#888888" _hover={{ color: "#e0e0e0" }} />
          <ModalBody pb={6}>
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
                    Title
                  </FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
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

                <FormControl isRequired>
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
                    name="github"
                    value={formData.github}
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
                    label="Project Image"
                    currentImage={formData.img}
                    onImageSelect={(url) =>
                      setFormData({ ...formData, img: url })
                    }
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
                    Website Link (optional)
                  </FormLabel>
                  <Input
                    name="website"
                    value={formData.website}
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
                    Project Date (optional)
                  </FormLabel>
                  <Input
                    name="projectDate"
                    value={formData.projectDate}
                    onChange={handleChange}
                    placeholder="e.g., January 2024"
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
                    Order
                  </FormLabel>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
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

                <Button
                  type="submit"
                  w="full"
                  mt={4}
                  isLoading={loading}
                  bg="#1a1a1a"
                  color="#e0e0e0"
                  border="1px solid #333333"
                  borderRadius="0"
                  h="50px"
                  fontWeight="300"
                  letterSpacing="2px"
                  textTransform="uppercase"
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
                  {editingId ? "Update" : "Create"} Project
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
