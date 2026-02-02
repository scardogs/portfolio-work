import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    Text,
} from "@chakra-ui/react";

const ContactForm = ({ onSubmit, toast }) => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const success = await onSubmit(formData);
        if (success) {
            setFormData({ name: "", company: "", email: "", subject: "", message: "" });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
                <Box>
                    <Text fontSize={[11, 12]} color="#888888" mb={1} fontWeight="400">
                        NAME
                    </Text>
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        border="1px solid #333333"
                        borderRadius="0"
                        bg="#141414"
                        color="#e0e0e0"
                        _focus={{ borderColor: "#888888" }}
                        fontWeight="300"
                    />
                </Box>
                <Box>
                    <Text fontSize={[11, 12]} color="#888888" mb={1} fontWeight="400">
                        COMPANY (OPTIONAL)
                    </Text>
                    <Input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        border="1px solid #333333"
                        borderRadius="0"
                        bg="#141414"
                        color="#e0e0e0"
                        _focus={{ borderColor: "#888888" }}
                        fontWeight="300"
                    />
                </Box>
                <Box>
                    <Text fontSize={[11, 12]} color="#888888" mb={1} fontWeight="400">
                        EMAIL
                    </Text>
                    <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        border="1px solid #333333"
                        borderRadius="0"
                        bg="#141414"
                        color="#e0e0e0"
                        _focus={{ borderColor: "#888888" }}
                        fontWeight="300"
                    />
                </Box>
                <Box>
                    <Text fontSize={[11, 12]} color="#888888" mb={1} fontWeight="400">
                        SUBJECT
                    </Text>
                    <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        border="1px solid #333333"
                        borderRadius="0"
                        bg="#141414"
                        color="#e0e0e0"
                        _focus={{ borderColor: "#888888" }}
                        fontWeight="300"
                    />
                </Box>
                <Box>
                    <Text fontSize={[11, 12]} color="#888888" mb={1} fontWeight="400">
                        MESSAGE
                    </Text>
                    <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        border="1px solid #333333"
                        borderRadius="0"
                        bg="#141414"
                        color="#e0e0e0"
                        _focus={{ borderColor: "#888888" }}
                        fontWeight="300"
                        rows={5}
                    />
                </Box>
                <Button
                    type="submit"
                    bg="#1a1a1a"
                    color="#e0e0e0"
                    border="1px solid #333333"
                    borderRadius="0"
                    fontWeight="300"
                    letterSpacing="1px"
                    textTransform="uppercase"
                    _hover={{ bg: "#2a2a2a", borderColor: "#555555" }}
                    px={6}
                    py={6}
                    leftIcon={<span>✉️</span>}
                >
                    Send Message
                </Button>
            </VStack>
        </form>
    );
};

export default ContactForm;
