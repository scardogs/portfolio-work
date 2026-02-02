import React, { useState, useEffect } from "react";
import {
    Box,
    Heading,
    VStack,
    useToast,
    Container,
    Flex,
    IconButton,
    HStack,
    Text,
    Divider,
    Button,
    Badge,
    SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowBackIcon, DeleteIcon, EmailIcon } from "@chakra-ui/icons";

export default function ManageMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetchMessages();
    }, [router]);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/messages", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data.success) {
                setMessages(data.data);
            } else {
                throw new Error(data.message || "Failed to fetch messages");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this message?")) {
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/messages/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Deleted",
                    description: "Message deleted successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                fetchMessages();
            } else {
                throw new Error(data.message || "Failed to delete message");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) {
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
                <Flex align="center" justify="space-between" mb={8}>
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
                            Messages
                        </Heading>
                    </Flex>
                    <Text color="#888888" fontSize="14px">
                        {messages.length} Message{messages.length !== 1 ? "s" : ""}
                    </Text>
                </Flex>

                <VStack spacing={6} align="stretch">
                    {messages.length === 0 ? (
                        <Box
                            bg="#141414"
                            p={12}
                            textAlign="center"
                            border="1px solid #333333"
                        >
                            <EmailIcon w={10} h={10} color="#333333" mb={4} />
                            <Text color="#888888">No messages yet.</Text>
                        </Box>
                    ) : (
                        messages.map((msg) => (
                            <Box
                                key={msg._id}
                                bg="#141414"
                                p={6}
                                border="1px solid #333333"
                                position="relative"
                                _hover={{ borderColor: "#555555" }}
                                transition="all 0.3s"
                            >
                                <Flex
                                    justify="space-between"
                                    align="start"
                                    direction={{ base: "column", md: "row" }}
                                    gap={4}
                                >
                                    <Box flex="1">
                                        <HStack spacing={4} mb={2}>
                                            <Heading size="md" color="#e0e0e0" fontWeight="600">
                                                {msg.subject}
                                            </Heading>
                                            <Badge
                                                bg="#1a1a1a"
                                                color="#888888"
                                                border="1px solid #333333"
                                                fontSize="10px"
                                                px={2}
                                            >
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </Badge>
                                        </HStack>
                                        <HStack spacing={4} mb={4} wrap="wrap">
                                            <Text color="#888888" fontSize="14px">
                                                From: <Text as="span" color="#e0e0e0">{msg.name}</Text>
                                            </Text>
                                            <Text color="#888888" fontSize="14px">
                                                Email: <Text as="span" color="#e0e0e0">{msg.email}</Text>
                                            </Text>
                                            {msg.company && (
                                                <Text color="#888888" fontSize="14px">
                                                    Company: <Text as="span" color="#e0e0e0">{msg.company}</Text>
                                                </Text>
                                            )}
                                        </HStack>
                                        <Divider borderColor="#333333" mb={4} />
                                        <Text
                                            color="#e0e0e0"
                                            fontSize="15px"
                                            lineHeight="1.6"
                                            whiteSpace="pre-wrap"
                                        >
                                            {msg.message}
                                        </Text>
                                    </Box>
                                    <HStack>
                                        <Button
                                            as="a"
                                            href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                            size="sm"
                                            bg="#1a1a1a"
                                            color="#e0e0e0"
                                            border="1px solid #333333"
                                            _hover={{ bg: "#2a2a2a", borderColor: "#555555" }}
                                            leftIcon={<EmailIcon />}
                                            fontWeight="300"
                                            borderRadius="0"
                                        >
                                            Reply
                                        </Button>
                                        <IconButton
                                            icon={<DeleteIcon />}
                                            aria-label="Delete message"
                                            size="sm"
                                            variant="outline"
                                            colorScheme="red"
                                            borderColor="#333333"
                                            color="#ff4444"
                                            onClick={() => handleDelete(msg._id)}
                                            _hover={{ bg: "red.900", borderColor: "red.500" }}
                                            borderRadius="0"
                                        />
                                    </HStack>
                                </Flex>
                            </Box>
                        ))
                    )}
                </VStack>
            </Container>
        </Box>
    );
}
