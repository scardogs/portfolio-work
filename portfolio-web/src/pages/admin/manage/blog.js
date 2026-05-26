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
  Badge,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaBookOpen, FaExternalLinkAlt } from "react-icons/fa";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Field,
  TextInput,
  TextArea,
  SelectInput,
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
import ImageUploader from "../../../component/admin/ImageUploader";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  coverImage: "",
  content: "",
  tags: "",
  status: "draft",
};

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ManageBlog() {
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
      const response = await fetch("/api/blog?admin=1&limit=50");
      const data = await response.json();
      if (data.success) setItems(data.data || []);
    } catch (error) {
      toast({ title: "Error fetching posts", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(EMPTY);
    onOpen();
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      coverImage: item.coverImage || "",
      content: item.content || "",
      tags: (item.tags || []).join(", "),
      status: item.status || "draft",
    });
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !editingItem && !prev.slug) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleImageSelect = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: "Title and content are required", status: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingItem ? `/api/blog?id=${editingItem._id}` : "/api/blog";
      const method = editingItem ? "PUT" : "POST";
      const payload = {
        ...formData,
        slug: formData.slug || slugify(formData.title),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
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
      const response = await fetch(`/api/blog?id=${deleteId}`, {
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
      New Post
    </PrimaryButton>
  );

  return (
    <AdminLayout
      title="Blog & Notes"
      subtitle={`${items.length} post${items.length !== 1 ? "s" : ""}`}
      actions={actions}
    >
      {loading ? (
        <Loading label="Loading posts" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={FaBookOpen}
          title="No posts yet"
          description="Write your first note. Markdown supported: headings, lists, code, links, images."
          action={
            <PrimaryButton onClick={handleOpenAdd} leftIcon={<FaPlus size={11} />}>
              New Post
            </PrimaryButton>
          }
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {items.map((item, i) => (
            <GridCard key={item._id} index={i}>
              {item.coverImage && (
                <Box position="relative" bg={COLORS.inputBg} aspectRatio={16 / 9} overflow="hidden">
                  <Image src={item.coverImage} alt={item.title} w="100%" h="100%" objectFit="cover" />
                </Box>
              )}
              <Box p={4}>
                <HStack mb={2} spacing={2}>
                  <Badge
                    bg={item.status === "published" ? "rgba(226,183,20,0.15)" : COLORS.inputBg}
                    color={item.status === "published" ? COLORS.accent : COLORS.muted}
                    border={`1px solid ${COLORS.border}`}
                    fontSize="9px"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    px={2}
                    py={0.5}
                  >
                    {item.status}
                  </Badge>
                  {item.readingTime ? (
                    <Text fontSize="10px" color={COLORS.muted} letterSpacing="1px">
                      {item.readingTime} min read
                    </Text>
                  ) : null}
                </HStack>
                <Heading fontSize="14px" color={COLORS.text} fontWeight="600" mb={1} noOfLines={2}>
                  {item.title}
                </Heading>
                <Text fontSize="11px" color={COLORS.muted} noOfLines={2} mb={3} minH="28px">
                  {item.excerpt || "—"}
                </Text>
                <Text fontSize="10px" color={COLORS.dim} mb={3} fontFamily="mono">
                  /{item.slug}
                </Text>
                <HStack spacing={2}>
                  <IconAction icon={<FaPen size={10} />} aria-label="Edit" onClick={() => handleOpenEdit(item)} />
                  <IconAction
                    icon={<FaExternalLinkAlt size={10} />}
                    aria-label="View"
                    onClick={() => window.open(`/blog/${item.slug}`, "_blank")}
                  />
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
        title={editingItem ? "Edit Post" : "New Post"}
        size="3xl"
        footer={
          <>
            <GhostButton onClick={onClose} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="blog-form" isLoading={submitting} h="40px">
              {editingItem ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="blog-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Title" required>
              <TextInput name="title" value={formData.title} onChange={handleChange} placeholder="Post title" />
            </Field>
            <Field label="Slug" required helper="URL-safe identifier — auto-generated from title">
              <TextInput name="slug" value={formData.slug} onChange={handleChange} placeholder="my-first-post" />
            </Field>
            <Field label="Excerpt" helper="Short summary shown on the blog index (max 300 chars)">
              <TextArea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} maxLength={300} />
            </Field>
            <Field label="Cover Image">
              <ImageUploader currentImage={formData.coverImage} onImageSelect={handleImageSelect} label="" />
            </Field>
            <Field label="Content (Markdown)" required helper="Supports # headings, **bold**, *italic*, `code`, ```fenced```, lists, links, images, > quotes">
              <TextArea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={18}
                fontFamily="mono"
                fontSize="12px"
                placeholder={"# Heading\n\nWrite your post in markdown here..."}
              />
            </Field>
            <Field label="Tags" helper="Comma-separated, e.g. react, nextjs, performance">
              <TextInput name="tags" value={formData.tags} onChange={handleChange} placeholder="react, nextjs" />
            </Field>
            <Field label="Status" required>
              <SelectInput name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </SelectInput>
            </Field>
          </VStack>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="This will permanently remove the post."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
