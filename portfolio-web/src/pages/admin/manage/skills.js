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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon, EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import ImageUploader from "../../../component/admin/ImageUploader";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
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

    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      const data = await response.json();

      if (data.success) {
        setSkills(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skills",
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
    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
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
            ? "Skill updated successfully"
            : "Skill created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchSkills();
        handleCloseModal();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save skill",
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

  const handleEdit = (skill) => {
    setFormData({
      name: skill.name,
      icon: skill.icon,
      order: skill.order || 0,
    });
    setEditingId(skill._id);
    onOpen();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Skill deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchSkills();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCloseModal = () => {
    setFormData({
      name: "",
      icon: "",
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
      <Container maxW="container.xl">
        <Flex align="center" justify="space-between" mb={6}>
          <Flex align="center">
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
              Manage Skills
            </Heading>
          </Flex>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="yellow"
            onClick={onOpen}
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            Add Skill
          </Button>
        </Flex>

        <Box
          bg="#272727"
          p={8}
          borderRadius="2xl"
          border="2px solid #232323"
          boxShadow="0 8px 20px 0 rgba(226,183,20,0.15)"
          overflowX="auto"
        >
          {skills.length === 0 ? (
            <Text color="#f7d794" textAlign="center">
              No skills found. Click "Add Skill" to create one.
            </Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="#e2b714">Name</Th>
                  <Th color="#e2b714">Icon Path</Th>
                  <Th color="#e2b714">Order</Th>
                  <Th color="#e2b714">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {skills.map((skill) => (
                  <Tr key={skill._id}>
                    <Td color="#fff">{skill.name}</Td>
                    <Td color="#f7d794" fontSize="sm">
                      {skill.icon}
                    </Td>
                    <Td color="#fff">{skill.order}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<EditIcon />}
                          colorScheme="yellow"
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(skill)}
                          aria-label="Edit skill"
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(skill._id)}
                          aria-label="Delete skill"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent bg="#272727" border="2px solid #e2b714">
          <ModalHeader
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            {editingId ? "Edit Skill" : "Add Skill"}
          </ModalHeader>
          <ModalCloseButton color="#e2b714" />
          <ModalBody pb={6}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="#f7d794">Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    bg="#232323"
                    border="1px solid #e2b714"
                    color="#fff"
                  />
                </FormControl>

                <FormControl isRequired>
                  <ImageUploader
                    label="Skill Icon"
                    currentImage={formData.icon}
                    onImageSelect={(url) =>
                      setFormData({ ...formData, icon: url })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="#f7d794">Order</FormLabel>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleChange}
                    bg="#232323"
                    border="1px solid #e2b714"
                    color="#fff"
                  />
                </FormControl>

                <HStack spacing={4} w="full" pt={4}>
                  <Button
                    type="submit"
                    colorScheme="yellow"
                    flex={1}
                    isLoading={loading}
                    fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  >
                    {editingId ? "Update" : "Create"}
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="#e2b714"
                    color="#e2b714"
                    flex={1}
                    onClick={handleCloseModal}
                    fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
