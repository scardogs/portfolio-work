import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  useToast,
  useDisclosure,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaImages, FaPlay } from "react-icons/fa";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Field,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  IconAction,
  Modal,
  ConfirmDialog,
  EmptyState,
  Loading,
  COLORS,
  GridCard,
} from "../../../component/admin/AdminUI";
import MediaUploader from "../../../component/admin/MediaUploader";

const EMPTY = {
  title: "",
  description: "",
  mediaUrl: "",
  mediaType: "image",
  order: 0,
};

export default function ManageContentGeneration() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content-generation?limit=60&page=1");
      const data = await response.json();
      if (data.success) setItems(data.data || []);
    } catch (error) {
      toast({ title: "Error fetching items", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...EMPTY, order: items.length });
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
      const url = editingItem ? `/api/content-generation?id=${editingItem._id}` : "/api/content-generation";
      const method = editingItem ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: editingItem ? "Updated" : "Created", status: "success", duration: 3000 });
        onClose();
        fetchItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Operation failed", description: error.message, status: "error", duration: 3000 });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/content-generation?id=${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success" });
        fetchItems();
      } else throw new Error(data.message);
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, status: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const actions = (
    <PrimaryButton onClick={handleOpenAdd} h="38px" px={5} fontSize="11px" leftIcon={<FaPlus size={11} />}>
      Add Item
    </PrimaryButton>
  );

  return (
    <AdminLayout
      title="Content Gallery"
      subtitle={`${items.length} item${items.length !== 1 ? "s" : ""}`}
      actions={actions}
    >
      {loading ? (
        <Loading label="Loading gallery" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FaImages}
          title="Gallery is empty"
          description="Upload your first image or video to populate the AI content gallery."
          action={<PrimaryButton onClick={handleOpenAdd} leftIcon={<FaPlus size={11} />}>Add Item</PrimaryButton>}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
          {items.map((item, i) => (
            <GridCard key={item._id} index={i}>
              <Box position="relative" bg={COLORS.inputBg} aspectRatio={1} overflow="hidden">
                {item.mediaType === "video" ? (
                  <>
                    <Box
                      as="video"
                      src={item.mediaUrl}
                      muted
                      playsInline
                      preload="metadata"
                      w="100%"
                      h="100%"
                      objectFit="cover"
                    />
                    <Flex
                      position="absolute"
                      inset={0}
                      align="center"
                      justify="center"
                      bg="rgba(0,0,0,0.35)"
                      color="white"
                      fontSize="20px"
                    >
                      <FaPlay />
                    </Flex>
                  </>
                ) : (
                  <Image src={item.mediaUrl} alt={item.title} w="100%" h="100%" objectFit="cover" />
                )}
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  px={2}
                  py={1}
                  bg="rgba(10,10,10,0.85)"
                  border={`1px solid ${COLORS.border}`}
                  borderRadius="6px"
                  fontSize="9px"
                  color={item.mediaType === "video" ? COLORS.accent : COLORS.muted}
                  letterSpacing="1px"
                  fontWeight="600"
                  textTransform="uppercase"
                >
                  {item.mediaType}
                </Box>
              </Box>
              <Box p={4}>
                <Heading fontSize="13px" color={COLORS.text} fontWeight="600" mb={1} noOfLines={1}>
                  {item.title || "Untitled"}
                </Heading>
                <Text fontSize="11px" color={COLORS.muted} noOfLines={2} mb={3} minH="28px">
                  {item.description || "No description"}
                </Text>
                <HStack spacing={2}>
                  <IconAction icon={<FaPen size={10} />} aria-label="Edit" onClick={() => handleOpenEdit(item)} />
                  <IconAction tone="danger" icon={<FaTrash size={10} />} aria-label="Delete" onClick={() => setDeleteId(item._id)} />
                </HStack>
              </Box>
            </GridCard>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
        size="xl"
        footer={
          <>
            <GhostButton onClick={onClose} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="gallery-form" isLoading={submitting} h="40px">
              {editingItem ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="gallery-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Title">
              <TextInput name="title" value={formData.title} onChange={handleChange} placeholder="Optional title" />
            </Field>
            <Field label="Description">
              <TextArea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Optional description" />
            </Field>
            <Field label="Display Order" required>
              <TextInput name="order" type="number" value={formData.order} onChange={handleChange} />
            </Field>
            <Field label="Media">
              <MediaUploader
                currentUrl={formData.mediaUrl}
                currentType={formData.mediaType}
                onMediaSelect={handleMediaSelect}
                label=""
              />
            </Field>
          </VStack>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="This will permanently remove the gallery item."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
