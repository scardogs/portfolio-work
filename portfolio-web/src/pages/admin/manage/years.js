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

export default function ManageYears() {
    const [years, setYears] = useState([]);
    const [formData, setFormData] = useState({
        year: "",
        label: "",
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

        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const response = await fetch("/api/years");
            const data = await response.json();

            if (data.success) {
                setYears(data.data);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch years",
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
            ? `/api/years/${editingId}`
            : "/api/years/create";
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
                    year: parseInt(formData.year),
                    order: parseInt(formData.order)
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: editingId ? "Updated" : "Created",
                    description: `Year ${editingId ? "updated" : "created"
                        } successfully`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                fetchYears();
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

    const handleEdit = (year) => {
        setFormData({
            year: year.year,
            label: year.label,
            order: year.order,
        });
        setEditingId(year._id);
        onOpen();
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this year?")) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`/api/years/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Deleted",
                    description: "Year deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                fetchYears();
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
            year: "",
            label: "",
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
                            Manage Years
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
                        Add Year
                    </Button>
                </Flex>

                <Box bg="#141414" p={8} borderRadius="0" border="1px solid #333333">
                    {years.length === 0 ? (
                        <Text color="#888888" textAlign="center">
                            No years found. Click "Add Year" to create one.
                        </Text>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                            {years.map((y) => (
                                <Box
                                    key={y._id}
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
                                        fontSize="24px"
                                        color="#e0e0e0"
                                        mb={2}
                                        fontWeight="600"
                                    >
                                        {y.year}
                                    </Heading>
                                    <Text color="#888888" fontSize="14px" mb={4}>
                                        {y.label}
                                    </Text>
                                    <HStack spacing={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            borderColor="#333333"
                                            color="#e0e0e0"
                                            bg="#141414"
                                            onClick={() => handleEdit(y)}
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
                                            onClick={() => handleDelete(y._id)}
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
                            {editingId ? "Edit" : "Add"} Year
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
                                            Year
                                        </FormLabel>
                                        <Input
                                            name="year"
                                            type="number"
                                            value={formData.year}
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
                                            Label
                                        </FormLabel>
                                        <Input
                                            name="label"
                                            value={formData.label}
                                            onChange={handleChange}
                                            placeholder="e.g., Year of Graduation"
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
                                        {editingId ? "Update" : "Create"} Year
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
