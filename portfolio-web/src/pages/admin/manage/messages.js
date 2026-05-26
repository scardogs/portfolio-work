import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  Heading,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaEnvelope, FaTrash, FaReply, FaInbox } from "react-icons/fa";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  IconAction,
  ConfirmDialog,
  EmptyState,
  Loading,
  COLORS,
  GhostButton,
} from "../../../component/admin/AdminUI";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setMessages(data.data);
      else throw new Error(data.message || "Failed to fetch messages");
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/messages/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success", duration: 3000 });
        fetchMessages();
      } else throw new Error(data.message || "Failed");
    } catch (error) {
      toast({ title: "Error", description: error.message, status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Messages" subtitle={`${messages.length} received`}>
      {loading ? (
        <Loading label="Loading messages" />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={FaInbox}
          title="Inbox is empty"
          description="Messages from your contact form will appear here."
        />
      ) : (
        <VStack spacing={4} align="stretch" maxW="900px">
          {messages.map((msg) => (
            <Box
              key={msg._id}
              bg={COLORS.card}
              border={`1px solid ${COLORS.border}`}
              borderRadius="12px"
              p={6}
              transition="all 0.3s ease"
              _hover={{ borderColor: COLORS.borderStrong }}
            >
              <Flex justify="space-between" align="start" gap={4} mb={4} direction={{ base: "column", md: "row" }}>
                <Box flex="1" w="100%">
                  <HStack spacing={3} mb={3} flexWrap="wrap">
                    <Heading fontSize="16px" color={COLORS.text} fontWeight="600">
                      {msg.subject}
                    </Heading>
                    <Box
                      px={2}
                      py={1}
                      bg={COLORS.inputBg}
                      border={`1px solid ${COLORS.border}`}
                      borderRadius="4px"
                    >
                      <Text fontSize="10px" color={COLORS.muted} letterSpacing="1px">
                        {new Date(msg.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack spacing={5} flexWrap="wrap">
                    <HStack spacing={2}>
                      <Text fontSize="10px" color={COLORS.dim} letterSpacing="2px" textTransform="uppercase">
                        From
                      </Text>
                      <Text fontSize="13px" color={COLORS.text} fontWeight="500">
                        {msg.name}
                      </Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Text fontSize="10px" color={COLORS.dim} letterSpacing="2px" textTransform="uppercase">
                        Email
                      </Text>
                      <Text fontSize="13px" color={COLORS.accent} fontWeight="500">
                        {msg.email}
                      </Text>
                    </HStack>
                    {msg.company && (
                      <HStack spacing={2}>
                        <Text fontSize="10px" color={COLORS.dim} letterSpacing="2px" textTransform="uppercase">
                          Company
                        </Text>
                        <Text fontSize="13px" color={COLORS.text} fontWeight="500">
                          {msg.company}
                        </Text>
                      </HStack>
                    )}
                  </HStack>
                </Box>
                <HStack spacing={2} flexShrink={0}>
                  <Button
                    as="a"
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                    size="sm"
                    bg="transparent"
                    color={COLORS.accent}
                    border={`1px solid rgba(226,183,20,0.35)`}
                    borderRadius="8px"
                    h="36px"
                    px={4}
                    fontWeight="500"
                    letterSpacing="1px"
                    textTransform="uppercase"
                    fontSize="11px"
                    leftIcon={<FaReply size={11} />}
                    _hover={{ bg: "rgba(226,183,20,0.08)", borderColor: COLORS.accent }}
                    transition="all 0.2s"
                  >
                    Reply
                  </Button>
                  <IconAction
                    tone="danger"
                    icon={<FaTrash size={11} />}
                    aria-label="Delete"
                    onClick={() => setDeleteId(msg._id)}
                  />
                </HStack>
              </Flex>
              <Divider borderColor={COLORS.border} mb={4} />
              <Text
                color={COLORS.text}
                fontSize="14px"
                lineHeight="1.7"
                whiteSpace="pre-wrap"
                fontWeight="300"
              >
                {msg.message}
              </Text>
            </Box>
          ))}
        </VStack>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="This will permanently delete this message. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
