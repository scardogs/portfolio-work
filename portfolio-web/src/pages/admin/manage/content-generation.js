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
  SimpleGrid,
  Text,
  Image,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon, DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";
import MediaUploader from "../../../component/admin/MediaUploader";

export default function ManageContentGeneration() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mediaUrl: "",
    mediaType: "image",
    order: 0,
  });

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content-generation");
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
      }
    } catch (error) {
      toast({
        title: "Error fetching items",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      mediaUrl: "",
      mediaType: "image",
      order: items.length,
    });
    onOpen();
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      order: item.order || 0,
    });
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (url, type) => {
    setFormData((prev) => ({ ...prev, mediaUrl: url, mediaType: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mediaUrl) {
      toast({ title: "Please upload media", status: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingItem 
        ? `/api/content-generation?id=${editingItem._id}` 
        : "/api/content-generation";
      const method = editingItem ? "PUT" : "POST";

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
          title: editingItem ? "Item updated" : "Item created",
          status: "success",
          duration: 3000,
        });
        onClose();
        fetchItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Operation failed",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/content-generation?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: "Item deleted", status: "success" });
        fetchItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, status: "error" });
    }
  };

  return (
    <Box minH="100vh" bg="#0a0a0a" color="#e0e0e0" py={12}>
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Flex justify="space-between" align="center">
            <Flex align="center">
              <IconButton
                icon={<ArrowBackIcon />}
                onClick={() => router.push("/admin/dashboard")}
                variant="outline"
                colorScheme="yellow"
                mr={4}
                aria-label="Back to dashboard"
              />
              <Heading color="#e2b714" fontWeight="300" letterSpacing="2px" size="lg">
                CONTENT GALLERY
              </Heading>
            </Flex>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="yellow"
              onClick={handleOpenAdd}
              borderRadius="0"
            >
              ADD NEW
            </Button>
          </Flex>

          <Divider borderColor="#333" />

          {loading ? (
            <Flex justify="center" align="center" py={20}>
              <Spinner size="xl" color="#e2b714" />
            </Flex>
          ) : items.length === 0 ? (
            <Box textAlign="center" py={20} bg="#141414" border="1px dashed #333">
              <Text color="#888">No media items found. Add your first one!</Text>
            </Box>
          ) : (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)"
              }}
              gap="1.5rem"
              sx={{
                "& > *": {
                  height: "fit-content"
                }
              }}
            >
              {items.map((item) => (
                <Box
                  key={item._id}
                  bg="#141414"
                  border="1px solid #333"
                  borderRadius="12px"
                  overflow="hidden"
                  position="relative"
                  transition="all 0.3s"
                  _hover={{ borderColor: "#e2b714", transform: "translateY(-4px)" }}
                >
                  <Box position="relative">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    ) : (
                      <Image
                        src={item.mediaUrl}
                        alt={item.title}
                        w="100%"
                        h="auto"
                        display="block"
                        objectFit="cover"
                      />
                    )}
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme={item.mediaType === "video" ? "purple" : "blue"}
                      borderRadius="6px"
                    >
                      {item.mediaType.toUpperCase()}
                    </Badge>
                  </Box>
                  <Box p={4}>
                    <Heading size="xs" color="#e2b714" mb={1} noOfLines={1}>
                      {item.title || "Untitled"}
                    </Heading>
                    <Text fontSize="xs" color="#888" noOfLines={2} mb={4} h="32px">
                      {item.description || "No description"}
                    </Text>
                    <HStack spacing={2} justify="flex-end">
                      <IconButton
                        size="sm"
                        icon={<EditIcon />}
                        onClick={() => handleOpenEdit(item)}
                        colorScheme="yellow"
                        variant="ghost"
                        aria-label="Edit"
                      />
                      <IconButton
                        size="sm"
                        icon={<DeleteIcon />}
                        onClick={() => handleDelete(item._id)}
                        colorScheme="red"
                        variant="ghost"
                        aria-label="Delete"
                      />
                    </HStack>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </VStack>
      </Container>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(4px)" />
        <ModalContent bg="#141414" color="#e0e0e0" borderRadius="0" border="1px solid #333">
          <form onSubmit={handleSubmit}>
            <ModalHeader color="#e2b714">
              {editingItem ? "EDIT GALLERY ITEM" : "ADD GALLERY ITEM"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                <FormControl>
                  <FormLabel color="#888" fontSize="xs">ITEM TITLE</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    bg="#0a0a0a"
                    borderColor="#333"
                    _focus={{ borderColor: "#e2b714" }}
                    placeholder="Optional title"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="#888" fontSize="xs">DESCRIPTION</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    bg="#0a0a0a"
                    borderColor="#333"
                    _focus={{ borderColor: "#e2b714" }}
                    placeholder="Optional description"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="#888" fontSize="xs">DISPLAY ORDER</FormLabel>
                  <Input
                    name="order"
                    type="number"
                    value={formData.order}
                    onChange={handleChange}
                    bg="#0a0a0a"
                    borderColor="#333"
                    _focus={{ borderColor: "#e2b714" }}
                  />
                </FormControl>

                <MediaUploader
                  currentUrl={formData.mediaUrl}
                  currentType={formData.mediaType}
                  onMediaSelect={handleMediaSelect}
                  label="GALLERY MEDIA"
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose} colorScheme="gray">
                CANCEL
              </Button>
              <Button
                type="submit"
                colorScheme="yellow"
                isLoading={submitting}
                borderRadius="0"
              >
                {editingItem ? "UPDATE ITEM" : "CREATE ITEM"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
}
