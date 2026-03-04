import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const ContactForm = ({ onSubmit, toast }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focusedField, setFocusedField] = useState(null);

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

  const fields = [
    { name: "name", label: "NAME", type: "text" },
    { name: "company", label: "COMPANY (OPTIONAL)", type: "text" },
    { name: "email", label: "EMAIL", type: "email" },
    { name: "subject", label: "SUBJECT", type: "text" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {fields.map((field, index) => (
          <MotionBox
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            position="relative"
          >
            <Text
              fontSize={[11, 12]}
              color={focusedField === field.name ? "#e0e0e0" : "#888888"}
              mb={2}
              fontWeight="400"
              transition="color 0.3s ease"
              transform={focusedField === field.name ? "translateY(-2px)" : "translateY(0)"}
              display="inline-block"
            >
              {field.label}
            </Text>
            <Input
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
              border="1px solid #333333"
              borderRadius="0"
              bg="#141414"
              color="#e0e0e0"
              fontWeight="300"
              transition="all 0.3s ease"
              _focus={{
                borderColor: "#888888",
                boxShadow: "0 0 15px rgba(136, 136, 136, 0.15)",
                transform: "translateY(-2px)",
              }}
              _hover={{
                borderColor: "#555555",
              }}
            />
          </MotionBox>
        ))}

        <MotionBox
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: fields.length * 0.1 }}
          position="relative"
        >
          <Text
            fontSize={[11, 12]}
            color={focusedField === "message" ? "#e0e0e0" : "#888888"}
            mb={2}
            fontWeight="400"
            transition="color 0.3s ease"
            transform={focusedField === "message" ? "translateY(-2px)" : "translateY(0)"}
            display="inline-block"
          >
            MESSAGE
          </Text>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            border="1px solid #333333"
            borderRadius="0"
            bg="#141414"
            color="#e0e0e0"
            fontWeight="300"
            rows={5}
            transition="all 0.3s ease"
            _focus={{
              borderColor: "#888888",
              boxShadow: "0 0 15px rgba(136, 136, 136, 0.15)",
              transform: "translateY(-2px)",
            }}
            _hover={{
              borderColor: "#555555",
            }}
          />
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: (fields.length + 1) * 0.1 }}
        >
          <Button
            type="submit"
            bg="#1a1a1a"
            color="#e0e0e0"
            border="1px solid #333333"
            borderRadius="0"
            fontWeight="300"
            letterSpacing="1px"
            textTransform="uppercase"
            px={6}
            py={6}
            w={["100%", "auto"]}
            leftIcon={<span>✉️</span>}
            position="relative"
            overflow="hidden"
            transition="all 0.3s ease"
            _hover={{
              bg: "#2a2a2a",
              borderColor: "#555555",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "5px",
                height: "5px",
                background: "rgba(255, 255, 255, 0.5)",
                opacity: 0,
                borderRadius: "100%",
                transform: "scale(1) translate(-50%, -50%)",
                transformOrigin: "50% 50%",
              },
              "&:active::after": {
                animation: "ripple 0.6s ease-out",
              },
              "@keyframes ripple": {
                "0%": {
                  transform: "scale(0) translate(-50%, -50%)",
                  opacity: 0.5,
                },
                "100%": {
                  transform: "scale(50) translate(-50%, -50%)",
                  opacity: 0,
                },
              },
            }}
          >
            Send Message
          </Button>
        </MotionBox>
      </VStack>
    </form>
  );
};

export default ContactForm;
