import React, { useState, useEffect, useMemo } from "react";
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
  Input,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaImages,
  FaPlay,
  FaTag,
  FaTags,
  FaCheck,
  FaTimes,
  FaVideo,
} from "react-icons/fa";
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
import BulkUploadModal from "../../../component/admin/BulkUploadModal";

const EMPTY = {
  title: "",
  description: "",
  mediaUrl: "",
  mediaType: "image",
  order: 0,
  tags: [],
};

export default function ManageContentGeneration() {
  const [items, setItems] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Add/Edit item modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Bulk upload modal
  const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
  // "Select Videos to Tag" modal
  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure();

  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(EMPTY);
  const [formTagInput, setFormTagInput] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Tag Manager & Filter state
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);
  const [activeMediaFilter, setActiveMediaFilter] = useState("all"); // "all" | "video" | "image"
  const [activeTagFilter, setActiveTagFilter] = useState("all"); // "all" | "untagged" | <tag>
  const [tagToDelete, setTagToDelete] = useState(null);
  const [deletingTag, setDeletingTag] = useState(false);

  // Quick single-item tag popover state
  const [quickTagItemId, setQuickTagItemId] = useState(null);
  const [quickTagInput, setQuickTagInput] = useState("");

  // Multi-select & Bulk Tagging state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkSelectedTags, setBulkSelectedTags] = useState([]);
  const [bulkCustomTag, setBulkCustomTag] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // "Select Videos for Tag" modal state
  const [assignTagName, setAssignTagName] = useState("");
  const [assignMediaFilter, setAssignMediaFilter] = useState("video"); // "video" | "image" | "all"
  const [assignSelectedIds, setAssignSelectedIds] = useState([]);
  const [assignSaving, setAssignSaving] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content-generation?limit=200&page=1");
      const data = await response.json();
      if (data.success) {
        setItems(data.data || []);
        if (Array.isArray(data.availableTags)) {
          setAvailableTags(data.availableTags);
        }
      }
    } catch (error) {
      toast({ title: "Error fetching items", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // Compute complete list of tags from both Settings/API and items
  const allTags = useMemo(() => {
    const map = new Map();
    for (const t of availableTags) {
      const clean = String(t || "").trim();
      if (clean && !map.has(clean.toLowerCase())) {
        map.set(clean.toLowerCase(), clean);
      }
    }
    for (const item of items) {
      if (Array.isArray(item.tags)) {
        for (const t of item.tags) {
          const clean = String(t || "").trim();
          if (clean && !map.has(clean.toLowerCase())) {
            map.set(clean.toLowerCase(), clean);
          }
        }
      }
    }
    return Array.from(map.values());
  }, [availableTags, items]);

  // Count how many items have each tag
  const tagCounts = useMemo(() => {
    const counts = {};
    for (const t of allTags) counts[t] = 0;
    for (const item of items) {
      if (Array.isArray(item.tags)) {
        for (const t of item.tags) {
          counts[t] = (counts[t] || 0) + 1;
        }
      }
    }
    return counts;
  }, [allTags, items]);

  // Filtered items for the admin grid
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeMediaFilter !== "all" && item.mediaType !== activeMediaFilter) {
        return false;
      }
      const itemTags = Array.isArray(item.tags) ? item.tags : [];
      if (activeTagFilter === "untagged") {
        return itemTags.length === 0;
      }
      if (activeTagFilter !== "all") {
        return itemTags.some(
          (t) => t.toLowerCase() === activeTagFilter.toLowerCase()
        );
      }
      return true;
    });
  }, [items, activeMediaFilter, activeTagFilter]);

  // ─── Create / Delete Global Tag ──────────────────────────────────────────
  const handleCreateTag = async (e) => {
    if (e) e.preventDefault();
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    setCreatingTag(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content-generation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "createTag", tag: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setAvailableTags(data.availableTags || []);
        setNewTagName("");
        toast({ title: `Tag "#${trimmed}" created`, status: "success", duration: 2500 });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Failed to create tag", description: error.message, status: "error" });
    } finally {
      setCreatingTag(false);
    }
  };

  const handleConfirmDeleteTag = async () => {
    if (!tagToDelete) return;
    setDeletingTag(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content-generation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "deleteTag", tag: tagToDelete }),
      });
      const data = await res.json();
      if (data.success) {
        setAvailableTags(data.availableTags || []);
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            tags: (item.tags || []).filter(
              (t) => t.toLowerCase() !== tagToDelete.toLowerCase()
            ),
          }))
        );
        if (activeTagFilter.toLowerCase() === tagToDelete.toLowerCase()) {
          setActiveTagFilter("all");
        }
        toast({ title: `Tag "#${tagToDelete}" deleted`, status: "success", duration: 2500 });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Failed to delete tag", description: error.message, status: "error" });
    } finally {
      setDeletingTag(false);
      setTagToDelete(null);
    }
  };

  // ─── Single Item Instant Tag / Untag ──────────────────────────────────────
  const handleToggleItemTag = async (item, tag) => {
    const cleanTag = String(tag || "").trim();
    if (!cleanTag) return;
    const currentTags = Array.isArray(item.tags) ? item.tags : [];
    const hasTag = currentTags.some(
      (t) => t.toLowerCase() === cleanTag.toLowerCase()
    );
    const nextTags = hasTag
      ? currentTags.filter((t) => t.toLowerCase() !== cleanTag.toLowerCase())
      : [...currentTags, cleanTag];

    // Optimistic update
    setItems((prev) =>
      prev.map((it) => (it._id === item._id ? { ...it, tags: nextTags } : it))
    );
    if (!hasTag && !availableTags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      setAvailableTags((prev) => [...prev, cleanTag]);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/content-generation?id=${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tags: nextTags }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch (error) {
      toast({ title: "Failed to update tag", description: error.message, status: "error" });
      fetchItems();
    }
  };

  // ─── Multi-Select & Bulk Tag / Bulk Untag ─────────────────────────────────
  const toggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = filteredItems.map((i) => i._id);
    const allSelected =
      filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleSelectAllVideos = () => {
    const videoIds = filteredItems
      .filter((i) => i.mediaType === "video")
      .map((i) => i._id);
    setSelectedIds(videoIds);
  };

  const toggleBulkTagChoice = (tag) => {
    setBulkSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddBulkCustomTag = () => {
    const trimmed = bulkCustomTag.trim();
    if (!trimmed) return;
    if (!bulkSelectedTags.includes(trimmed)) {
      setBulkSelectedTags((prev) => [...prev, trimmed]);
    }
    setBulkCustomTag("");
  };

  const handleExecuteBulkTag = async (mode) => {
    // mode: "bulkTag" | "bulkUntag"
    const pendingCustom = bulkCustomTag.trim();
    const tagsToApply = Array.from(
      new Set([
        ...bulkSelectedTags,
        ...(pendingCustom ? [pendingCustom] : []),
      ])
    );

    if (selectedIds.length === 0) {
      toast({ title: "Select at least one video or image first", status: "warning" });
      return;
    }
    if (tagsToApply.length === 0) {
      toast({
        title:
          mode === "bulkTag"
            ? "Choose or type at least one tag to apply"
            : "Choose at least one tag to remove",
        status: "warning",
      });
      return;
    }

    setBulkProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content-generation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: mode,
          itemIds: selectedIds,
          tags: tagsToApply,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title:
            mode === "bulkTag"
              ? `Tagged ${selectedIds.length} item${selectedIds.length !== 1 ? "s" : ""}`
              : `Untagged ${selectedIds.length} item${selectedIds.length !== 1 ? "s" : ""}`,
          status: "success",
          duration: 2500,
        });
        setBulkCustomTag("");
        setBulkSelectedTags([]);
        fetchItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Bulk tag operation failed", description: error.message, status: "error" });
    } finally {
      setBulkProcessing(false);
    }
  };

  // ─── "Select Videos to Tag" Modal (Assign Videos for a Specific Tag) ──────
  const handleOpenAssignModal = (initialTag = "") => {
    const chosenTag = initialTag || allTags[0] || "";
    setAssignTagName(chosenTag);
    setAssignMediaFilter("video");
    if (chosenTag) {
      const matchingIds = items
        .filter((it) =>
          (it.tags || []).some((t) => t.toLowerCase() === chosenTag.toLowerCase())
        )
        .map((it) => it._id);
      setAssignSelectedIds(matchingIds);
    } else {
      setAssignSelectedIds([]);
    }
    onAssignOpen();
  };

  const handleSwitchAssignTag = (tag) => {
    setAssignTagName(tag);
    const matchingIds = items
      .filter((it) =>
        (it.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase())
      )
      .map((it) => it._id);
    setAssignSelectedIds(matchingIds);
  };

  const toggleAssignItem = (id) => {
    setAssignSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSaveAssignModal = async () => {
    const cleanTag = assignTagName.trim();
    if (!cleanTag) {
      toast({ title: "Please select or enter a tag name", status: "warning" });
      return;
    }
    setAssignSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/content-generation", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "setItemsForTag",
          tag: cleanTag,
          itemIds: assignSelectedIds,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: `Updated videos/items for "#${cleanTag}" (${assignSelectedIds.length} tagged)`,
          status: "success",
          duration: 3000,
        });
        onAssignClose();
        fetchItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({ title: "Failed to save tag assignments", description: error.message, status: "error" });
    } finally {
      setAssignSaving(false);
    }
  };

  const assignModalItems = useMemo(() => {
    if (assignMediaFilter === "all") return items;
    return items.filter((i) => i.mediaType === assignMediaFilter);
  }, [items, assignMediaFilter]);

  // ─── Add / Edit Single Item Modal ─────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...EMPTY, order: items.length, tags: [] });
    setFormTagInput("");
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
      tags: Array.isArray(item.tags) ? [...item.tags] : [],
    });
    setFormTagInput("");
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (url, type) => {
    setFormData((prev) => ({ ...prev, mediaUrl: url, mediaType: type }));
  };

  const toggleFormTag = (tag) => {
    setFormData((prev) => {
      const exists = (prev.tags || []).includes(tag);
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tag)
          : [...(prev.tags || []), tag],
      };
    });
  };

  const handleAddFormTag = () => {
    const trimmed = formTagInput.trim();
    if (!trimmed) return;
    if (!(formData.tags || []).includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmed],
      }));
    }
    setFormTagInput("");
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
      const pendingTag = formTagInput.trim();
      const payload = {
        ...formData,
        tags: pendingTag
          ? Array.from(new Set([...(formData.tags || []), pendingTag]))
          : formData.tags || [],
      };
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: editingItem ? "Updated" : "Created",
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
        setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
        fetchItems();
      } else throw new Error(data.message);
    } catch (error) {
      toast({ title: "Delete failed", description: error.message, status: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleBulkComplete = (successCount) => {
    if (successCount > 0) {
      toast({
        title: `${successCount} item${successCount !== 1 ? "s" : ""} uploaded`,
        status: "success",
        duration: 3000,
      });
      fetchItems();
    }
  };

  const actions = (
    <HStack spacing={2} flexWrap="wrap">
      <GhostButton
        onClick={() => handleOpenAssignModal()}
        h="38px"
        px={4}
        fontSize="11px"
        leftIcon={<FaTags size={11} />}
      >
        Select Videos to Tag
      </GhostButton>
      <GhostButton
        onClick={onBulkOpen}
        h="38px"
        px={5}
        fontSize="11px"
        leftIcon={<FaImages size={11} />}
      >
        Bulk Upload
      </GhostButton>
      <PrimaryButton
        onClick={handleOpenAdd}
        h="38px"
        px={5}
        fontSize="11px"
        leftIcon={<FaPlus size={11} />}
      >
        Add Item
      </PrimaryButton>
    </HStack>
  );

  return (
    <AdminLayout
      title="Content Gallery"
      subtitle={`${items.length} item${items.length !== 1 ? "s" : ""} · ${allTags.length} tag${
        allTags.length !== 1 ? "s" : ""
      }`}
      actions={actions}
    >
      <VStack spacing={5} align="stretch">
        {/* ── Tag Management & Filter Panel ─────────────────────────────────── */}
        <Box
          bg={COLORS.card}
          border={`1px solid ${COLORS.border}`}
          borderRadius="14px"
          p={5}
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "stretch", md: "center" }}
            gap={4}
            mb={4}
          >
            <Box>
              <HStack spacing={2} mb={1}>
                <FaTags color={COLORS.accent} size={13} />
                <Heading fontSize="14px" color={COLORS.text} fontWeight="600">
                  Gallery Tags & Public Filters
                </Heading>
              </HStack>
              <Text fontSize="11px" color={COLORS.muted}>
                Create tags, click a tag to filter, or click &ldquo;Select Videos&rdquo; on any tag to pick which videos belong to it. Tags automatically appear as filters on the public AI Content Gallery.
              </Text>
            </Box>

            {/* Create New Tag Form */}
            <Box as="form" onSubmit={handleCreateTag} flexShrink={0}>
              <HStack spacing={2}>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="New tag name (e.g. UGC, 3D, Ads)..."
                  w={{ base: "100%", md: "240px" }}
                  h="36px"
                  bg={COLORS.inputBg}
                  border={`1px solid ${COLORS.border}`}
                  borderRadius="8px"
                  fontSize="12px"
                  color={COLORS.text}
                  _placeholder={{ color: COLORS.subtle }}
                  _focus={{ borderColor: COLORS.accent, boxShadow: "none" }}
                />
                <PrimaryButton
                  type="submit"
                  h="36px"
                  px={4}
                  fontSize="11px"
                  isLoading={creatingTag}
                  leftIcon={<FaPlus size={10} />}
                >
                  Create Tag
                </PrimaryButton>
              </HStack>
            </Box>
          </Flex>

          {/* Media Type + Tag Filter Pills */}
          <Flex
            justify="space-between"
            align="center"
            gap={3}
            pt={3}
            borderTop={`1px solid ${COLORS.border}`}
            flexWrap="wrap"
          >
            <HStack spacing={1.5} flexWrap="wrap">
              {[
                { key: "all", label: `All Media (${items.length})` },
                {
                  key: "video",
                  label: `Videos (${items.filter((i) => i.mediaType === "video").length})`,
                },
                {
                  key: "image",
                  label: `Images (${items.filter((i) => i.mediaType === "image").length})`,
                },
              ].map((m) => {
                const active = activeMediaFilter === m.key;
                return (
                  <Box
                    as="button"
                    type="button"
                    key={m.key}
                    onClick={() => setActiveMediaFilter(m.key)}
                    px={3}
                    py={1.5}
                    borderRadius="7px"
                    fontSize="11px"
                    fontWeight="600"
                    bg={active ? COLORS.text : COLORS.inputBg}
                    color={active ? "#0a0a0a" : COLORS.textSecondary}
                    border={`1px solid ${active ? COLORS.text : COLORS.border}`}
                    transition="all 0.15s"
                  >
                    {m.label}
                  </Box>
                );
              })}

              <Box w="1px" h="20px" bg={COLORS.border} mx={1} />

              <Box
                as="button"
                type="button"
                onClick={() => setActiveTagFilter("all")}
                px={3}
                py={1.5}
                borderRadius="7px"
                fontSize="11px"
                fontWeight="600"
                bg={activeTagFilter === "all" ? COLORS.accent : COLORS.inputBg}
                color={activeTagFilter === "all" ? "#0a0a0a" : COLORS.textSecondary}
                border={`1px solid ${
                  activeTagFilter === "all" ? COLORS.accent : COLORS.border
                }`}
                transition="all 0.15s"
              >
                All Tags
              </Box>

              <Box
                as="button"
                type="button"
                onClick={() => setActiveTagFilter("untagged")}
                px={3}
                py={1.5}
                borderRadius="7px"
                fontSize="11px"
                fontWeight="600"
                bg={activeTagFilter === "untagged" ? COLORS.accent : COLORS.inputBg}
                color={
                  activeTagFilter === "untagged" ? "#0a0a0a" : COLORS.textSecondary
                }
                border={`1px solid ${
                  activeTagFilter === "untagged" ? COLORS.accent : COLORS.border
                }`}
                transition="all 0.15s"
              >
                Untagged ({items.filter((i) => !i.tags || i.tags.length === 0).length})
              </Box>

              {allTags.map((tag) => {
                const active =
                  activeTagFilter.toLowerCase() === tag.toLowerCase();
                const count = tagCounts[tag] || 0;
                return (
                  <HStack
                    key={tag}
                    spacing={1}
                    pl={2.5}
                    pr={1.5}
                    py={1}
                    borderRadius="7px"
                    bg={active ? COLORS.accent : COLORS.inputBg}
                    border={`1px solid ${active ? COLORS.accent : COLORS.border}`}
                    transition="all 0.15s"
                  >
                    <Box
                      as="button"
                      type="button"
                      onClick={() =>
                        setActiveTagFilter(active ? "all" : tag)
                      }
                      fontSize="11px"
                      fontWeight="600"
                      color={active ? "#0a0a0a" : COLORS.text}
                    >
                      # {tag}{" "}
                      <Text
                        as="span"
                        fontSize="10px"
                        color={active ? "#0a0a0a" : COLORS.muted}
                      >
                        ({count})
                      </Text>
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      title={`Select which videos have #${tag}`}
                      onClick={() => handleOpenAssignModal(tag)}
                      px={1.5}
                      py={0.5}
                      borderRadius="4px"
                      fontSize="9px"
                      fontWeight="700"
                      bg={active ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.06)"}
                      color={active ? "#0a0a0a" : COLORS.accent}
                      _hover={{ opacity: 0.85 }}
                    >
                      Select Videos
                    </Box>
                    <Box
                      as="button"
                      type="button"
                      title={`Delete tag #${tag}`}
                      onClick={() => setTagToDelete(tag)}
                      p={0.5}
                      color={active ? "#0a0a0a" : COLORS.muted}
                      _hover={{ color: COLORS.danger }}
                    >
                      <FaTimes size={9} />
                    </Box>
                  </HStack>
                );
              })}
            </HStack>

            {/* Quick Multi-Select Controls */}
            <HStack spacing={2}>
              <GhostButton
                h="30px"
                px={3}
                fontSize="10px"
                onClick={handleSelectAllVideos}
                leftIcon={<FaVideo size={10} />}
              >
                Select All Videos
              </GhostButton>
              <GhostButton
                h="30px"
                px={3}
                fontSize="10px"
                onClick={handleSelectAllFiltered}
              >
                {filteredItems.length > 0 &&
                filteredItems.every((i) => selectedIds.includes(i._id))
                  ? "Deselect Visible"
                  : "Select All Visible"}
              </GhostButton>
              {selectedIds.length > 0 && (
                <GhostButton
                  h="30px"
                  px={3}
                  fontSize="10px"
                  onClick={() => setSelectedIds([])}
                >
                  Clear ({selectedIds.length})
                </GhostButton>
              )}
            </HStack>
          </Flex>
        </Box>

        {/* ── Bulk Tag / Bulk Untag Action Bar (Shown when items are selected) ── */}
        {selectedIds.length > 0 && (
          <Box
            bg="#14120a"
            border={`1px solid ${COLORS.accent}`}
            borderRadius="14px"
            p={4}
            boxShadow="0 10px 30px rgba(0,0,0,0.45)"
          >
            <Flex
              direction={{ base: "column", lg: "row" }}
              justify="space-between"
              align={{ base: "stretch", lg: "center" }}
              gap={4}
            >
              <HStack spacing={3}>
                <Flex
                  w="28px"
                  h="28px"
                  borderRadius="7px"
                  bg={COLORS.accent}
                  color="#0a0a0a"
                  align="center"
                  justify="center"
                  fontWeight="700"
                  fontSize="12px"
                >
                  {selectedIds.length}
                </Flex>
                <Box>
                  <Text fontSize="13px" fontWeight="600" color={COLORS.text}>
                    {selectedIds.length} video/item{selectedIds.length !== 1 ? "s" : ""} selected for bulk tagging
                  </Text>
                  <Text fontSize="11px" color={COLORS.muted}>
                    Select one or more tags below, then click Bulk Tag or Bulk Untag.
                  </Text>
                </Box>
              </HStack>

              <HStack spacing={2} flexWrap="wrap">
                <PrimaryButton
                  h="36px"
                  px={4}
                  fontSize="11px"
                  isLoading={bulkProcessing}
                  onClick={() => handleExecuteBulkTag("bulkTag")}
                  leftIcon={<FaTag size={10} />}
                >
                  Bulk Tag Selected
                </PrimaryButton>
                <GhostButton
                  h="36px"
                  px={4}
                  fontSize="11px"
                  isLoading={bulkProcessing}
                  onClick={() => handleExecuteBulkTag("bulkUntag")}
                  leftIcon={<FaTimes size={10} />}
                >
                  Bulk Untag Selected
                </GhostButton>
                <GhostButton
                  h="36px"
                  px={3}
                  fontSize="11px"
                  onClick={() => {
                    setSelectedIds([]);
                    setBulkSelectedTags([]);
                  }}
                >
                  Cancel
                </GhostButton>
              </HStack>
            </Flex>

            {/* Tag picker for Bulk Operation */}
            <Flex mt={3} pt={3} borderTop={`1px solid ${COLORS.border}`} gap={2} align="center" flexWrap="wrap">
              <Text fontSize="10px" color={COLORS.muted} textTransform="uppercase" letterSpacing="1px" mr={1}>
                Choose Tags:
              </Text>
              {Array.from(new Set([...allTags, ...bulkSelectedTags])).map((tag) => {
                const chosen = bulkSelectedTags.includes(tag);
                return (
                  <Box
                    as="button"
                    type="button"
                    key={tag}
                    onClick={() => toggleBulkTagChoice(tag)}
                    px={2.5}
                    py={1}
                    borderRadius="6px"
                    fontSize="11px"
                    fontWeight="600"
                    bg={chosen ? COLORS.accent : COLORS.inputBg}
                    color={chosen ? "#0a0a0a" : COLORS.text}
                    border={`1px solid ${chosen ? COLORS.accent : COLORS.border}`}
                    transition="all 0.15s"
                  >
                    {chosen ? "✓ " : "# "}
                    {tag}
                  </Box>
                );
              })}
              <HStack spacing={1.5} ml="auto">
                <Input
                  size="sm"
                  value={bulkCustomTag}
                  onChange={(e) => setBulkCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBulkCustomTag();
                    }
                  }}
                  placeholder="Or type new tag..."
                  w="170px"
                  h="30px"
                  bg={COLORS.inputBg}
                  border={`1px solid ${COLORS.border}`}
                  borderRadius="6px"
                  fontSize="11px"
                  color={COLORS.text}
                />
                <GhostButton h="30px" px={2.5} fontSize="10px" onClick={handleAddBulkCustomTag}>
                  + Add
                </GhostButton>
              </HStack>
            </Flex>
          </Box>
        )}

        {/* ── Gallery Grid ─────────────────────────────────────────────────── */}
        {loading ? (
          <Loading label="Loading gallery" />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={FaImages}
            title={items.length === 0 ? "Gallery is empty" : "No items match this filter"}
            description={
              items.length === 0
                ? "Upload your first image or video to populate the AI content gallery."
                : "Try switching back to All Tags or All Media."
            }
            action={
              items.length === 0 ? (
                <PrimaryButton onClick={handleOpenAdd} leftIcon={<FaPlus size={11} />}>
                  Add Item
                </PrimaryButton>
              ) : (
                <GhostButton
                  onClick={() => {
                    setActiveMediaFilter("all");
                    setActiveTagFilter("all");
                  }}
                >
                  Reset Filters
                </GhostButton>
              )
            }
          />
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
            {filteredItems.map((item, i) => {
              const isSelected = selectedIds.includes(item._id);
              const itemTags = Array.isArray(item.tags) ? item.tags : [];
              const isQuickTagOpen = quickTagItemId === item._id;

              return (
                <GridCard key={item._id} index={i}>
                  <Box
                    position="relative"
                    bg={COLORS.inputBg}
                    aspectRatio={1}
                    overflow="hidden"
                    borderBottom={
                      isSelected ? `2px solid ${COLORS.accent}` : "none"
                    }
                  >
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
                          pointerEvents="none"
                        >
                          <FaPlay />
                        </Flex>
                      </>
                    ) : (
                      <Image
                        src={item.mediaUrl}
                        alt={item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    )}

                    {/* Top-left Selection Checkbox for Bulk Tagging */}
                    <Box
                      as="button"
                      type="button"
                      onClick={() => toggleSelectItem(item._id)}
                      position="absolute"
                      top={2.5}
                      left={2.5}
                      w="26px"
                      h="26px"
                      borderRadius="6px"
                      bg={isSelected ? COLORS.accent : "rgba(10,10,10,0.82)"}
                      border={`1.5px solid ${
                        isSelected ? COLORS.accent : "rgba(255,255,255,0.35)"
                      }`}
                      color={isSelected ? "#0a0a0a" : "transparent"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all 0.15s"
                      _hover={{ borderColor: COLORS.accent }}
                      title={isSelected ? "Deselect item" : "Select item for bulk tagging"}
                      zIndex={3}
                    >
                      <FaCheck size={11} />
                    </Box>

                    {/* Top-right Media Type Badge */}
                    <Box
                      position="absolute"
                      top={2.5}
                      right={2.5}
                      px={2}
                      py={1}
                      bg="rgba(10,10,10,0.85)"
                      border={`1px solid ${COLORS.border}`}
                      borderRadius="6px"
                      fontSize="9px"
                      color={
                        item.mediaType === "video" ? COLORS.accent : COLORS.muted
                      }
                      letterSpacing="1px"
                      fontWeight="600"
                      textTransform="uppercase"
                    >
                      {item.mediaType}
                    </Box>
                  </Box>

                  <Box p={4}>
                    <Heading
                      fontSize="13px"
                      color={COLORS.text}
                      fontWeight="600"
                      mb={1}
                      noOfLines={1}
                    >
                      {item.title || "Untitled"}
                    </Heading>
                    <Text
                      fontSize="11px"
                      color={COLORS.muted}
                      noOfLines={1}
                      mb={2.5}
                    >
                      {item.description || "No description"}
                    </Text>

                    {/* Item Tags Display + Instant Untag (x) + Quick "+ Tag" */}
                    <Flex gap={1.5} flexWrap="wrap" mb={3} minH="26px" align="center">
                      {itemTags.map((tag) => (
                        <HStack
                          key={tag}
                          spacing={1}
                          px={2}
                          py={0.5}
                          bg="rgba(226,183,20,0.12)"
                          border="1px solid rgba(226,183,20,0.35)"
                          borderRadius="5px"
                          fontSize="10px"
                          color={COLORS.accent}
                          fontWeight="600"
                        >
                          <Text as="span"># {tag}</Text>
                          <Box
                            as="button"
                            type="button"
                            title={`Untag #${tag} from this ${item.mediaType}`}
                            onClick={() => handleToggleItemTag(item, tag)}
                            color={COLORS.accent}
                            _hover={{ color: COLORS.danger }}
                            ml={0.5}
                          >
                            <FaTimes size={8} />
                          </Box>
                        </HStack>
                      ))}

                      <Box
                        as="button"
                        type="button"
                        onClick={() => {
                          setQuickTagItemId(isQuickTagOpen ? null : item._id);
                          setQuickTagInput("");
                        }}
                        px={2}
                        py={0.5}
                        borderRadius="5px"
                        fontSize="10px"
                        fontWeight="600"
                        bg={COLORS.inputBg}
                        color={COLORS.textSecondary}
                        border={`1px dashed ${COLORS.borderStrong}`}
                        _hover={{ borderColor: COLORS.accent, color: COLORS.accent }}
                      >
                        + Tag
                      </Box>
                    </Flex>

                    {/* Inline Quick Tag Picker for this specific video/image */}
                    {isQuickTagOpen && (
                      <Box
                        mb={3}
                        p={2.5}
                        bg={COLORS.inputBg}
                        border={`1px solid ${COLORS.borderStrong}`}
                        borderRadius="8px"
                      >
                        <Flex justify="space-between" align="center" mb={2}>
                          <Text fontSize="10px" color={COLORS.muted} fontWeight="600">
                            Toggle or add tag:
                          </Text>
                          <Box
                            as="button"
                            type="button"
                            onClick={() => setQuickTagItemId(null)}
                            color={COLORS.muted}
                            _hover={{ color: COLORS.text }}
                          >
                            <FaTimes size={10} />
                          </Box>
                        </Flex>
                        {allTags.length > 0 && (
                          <Flex gap={1} flexWrap="wrap" mb={2}>
                            {allTags.map((tag) => {
                              const hasTag = itemTags.some(
                                (t) => t.toLowerCase() === tag.toLowerCase()
                              );
                              return (
                                <Box
                                  as="button"
                                  type="button"
                                  key={tag}
                                  onClick={() => handleToggleItemTag(item, tag)}
                                  px={2}
                                  py={0.5}
                                  borderRadius="4px"
                                  fontSize="10px"
                                  fontWeight="600"
                                  bg={hasTag ? COLORS.accent : COLORS.card}
                                  color={hasTag ? "#0a0a0a" : COLORS.textSecondary}
                                  border={`1px solid ${
                                    hasTag ? COLORS.accent : COLORS.border
                                  }`}
                                >
                                  {hasTag ? "✓ " : "+ "}
                                  {tag}
                                </Box>
                              );
                            })}
                          </Flex>
                        )}
                        <HStack spacing={1.5}>
                          <Input
                            size="xs"
                            value={quickTagInput}
                            onChange={(e) => setQuickTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (quickTagInput.trim()) {
                                  handleToggleItemTag(item, quickTagInput.trim());
                                  setQuickTagInput("");
                                }
                              }
                            }}
                            placeholder="New tag..."
                            bg={COLORS.card}
                            border={`1px solid ${COLORS.border}`}
                            borderRadius="5px"
                            color={COLORS.text}
                          />
                          <GhostButton
                            h="24px"
                            px={2}
                            fontSize="10px"
                            onClick={() => {
                              if (quickTagInput.trim()) {
                                handleToggleItemTag(item, quickTagInput.trim());
                                setQuickTagInput("");
                              }
                            }}
                          >
                            Add
                          </GhostButton>
                        </HStack>
                      </Box>
                    )}

                    <HStack spacing={2} justify="space-between">
                      <HStack spacing={2}>
                        <IconAction
                          icon={<FaPen size={10} />}
                          aria-label="Edit"
                          onClick={() => handleOpenEdit(item)}
                        />
                        <IconAction
                          tone="danger"
                          icon={<FaTrash size={10} />}
                          aria-label="Delete"
                          onClick={() => setDeleteId(item._id)}
                        />
                      </HStack>
                      <GhostButton
                        h="28px"
                        px={2.5}
                        fontSize="10px"
                        onClick={() => toggleSelectItem(item._id)}
                      >
                        {isSelected ? "Selected ✓" : "Select"}
                      </GhostButton>
                    </HStack>
                  </Box>
                </GridCard>
              );
            })}
          </SimpleGrid>
        )}
      </VStack>

      {/* ── Add / Edit Single Item Modal ─────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingItem ? "Edit Gallery Item" : "Add Gallery Item"}
        size="xl"
        footer={
          <>
            <GhostButton onClick={onClose} h="40px">
              Cancel
            </GhostButton>
            <PrimaryButton
              type="submit"
              form="gallery-form"
              isLoading={submitting}
              h="40px"
            >
              {editingItem ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="gallery-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Title">
              <TextInput
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Optional title"
              />
            </Field>
            <Field label="Description">
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional description"
              />
            </Field>
            <Field label="Tags" hint="Click existing tags or add a new tag for filtering in the public gallery">
              <Box
                p={3}
                bg={COLORS.inputBg}
                border={`1px solid ${COLORS.border}`}
                borderRadius="10px"
              >
                {Array.from(new Set([...allTags, ...(formData.tags || [])])).length > 0 && (
                  <Flex gap={1.5} flexWrap="wrap" mb={3}>
                    {Array.from(new Set([...allTags, ...(formData.tags || [])])).map(
                      (tag) => {
                        const active = (formData.tags || []).includes(tag);
                        return (
                          <Box
                            as="button"
                            type="button"
                            key={tag}
                            onClick={() => toggleFormTag(tag)}
                            px={2.5}
                            py={1}
                            borderRadius="6px"
                            fontSize="11px"
                            fontWeight="600"
                            bg={active ? COLORS.accent : COLORS.card}
                            color={active ? "#0a0a0a" : COLORS.textSecondary}
                            border={`1px solid ${
                              active ? COLORS.accent : COLORS.border
                            }`}
                          >
                            {active ? "✓ # " : "# "}
                            {tag}
                          </Box>
                        );
                      }
                    )}
                  </Flex>
                )}
                <HStack spacing={2}>
                  <TextInput
                    value={formTagInput}
                    onChange={(e) => setFormTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFormTag();
                      }
                    }}
                    placeholder="Type a new tag and press Enter..."
                  />
                  <GhostButton h="40px" px={4} onClick={handleAddFormTag}>
                    + Add Tag
                  </GhostButton>
                </HStack>
              </Box>
            </Field>
            <Field label="Display Order" required>
              <TextInput
                name="order"
                type="number"
                value={formData.order}
                onChange={handleChange}
              />
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

      {/* ── "Select What Video I Will Tag" Modal ─────────────────────────── */}
      <Modal
        isOpen={isAssignOpen}
        onClose={onAssignClose}
        title="Select Videos / Items to Tag"
        size="4xl"
        footer={
          <>
            <GhostButton onClick={onAssignClose} h="40px">
              Cancel
            </GhostButton>
            <PrimaryButton
              onClick={handleSaveAssignModal}
              isLoading={assignSaving}
              h="40px"
            >
              Save Tag Assignments ({assignSelectedIds.length} Tagged)
            </PrimaryButton>
          </>
        }
      >
        <VStack spacing={4} align="stretch">
          <Box
            p={3.5}
            bg={COLORS.inputBg}
            border={`1px solid ${COLORS.border}`}
            borderRadius="10px"
          >
            <Text
              fontSize="11px"
              color={COLORS.muted}
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="1px"
              mb={2}
            >
              1. Choose or Type Tag to Assign
            </Text>
            {allTags.length > 0 && (
              <Flex gap={1.5} flexWrap="wrap" mb={2.5}>
                {allTags.map((tag) => {
                  const active =
                    assignTagName.trim().toLowerCase() === tag.toLowerCase();
                  return (
                    <Box
                      as="button"
                      type="button"
                      key={tag}
                      onClick={() => handleSwitchAssignTag(tag)}
                      px={3}
                      py={1}
                      borderRadius="6px"
                      fontSize="11px"
                      fontWeight="600"
                      bg={active ? COLORS.accent : COLORS.card}
                      color={active ? "#0a0a0a" : COLORS.text}
                      border={`1px solid ${active ? COLORS.accent : COLORS.border}`}
                    >
                      # {tag}
                    </Box>
                  );
                })}
              </Flex>
            )}
            <TextInput
              value={assignTagName}
              onChange={(e) => setAssignTagName(e.target.value)}
              placeholder="Or type a new tag name here (e.g. Commercial, AI Reels)..."
            />
          </Box>

          <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
            <HStack spacing={2}>
              <Text
                fontSize="11px"
                color={COLORS.muted}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="1px"
              >
                2. Click Videos / Items to Toggle Tag:
              </Text>
              {["video", "image", "all"].map((m) => (
                <Box
                  as="button"
                  type="button"
                  key={m}
                  onClick={() => setAssignMediaFilter(m)}
                  px={2.5}
                  py={1}
                  borderRadius="6px"
                  fontSize="10px"
                  fontWeight="600"
                  textTransform="uppercase"
                  bg={assignMediaFilter === m ? COLORS.text : COLORS.inputBg}
                  color={assignMediaFilter === m ? "#0a0a0a" : COLORS.muted}
                >
                  {m === "all" ? "All" : `${m}s`}
                </Box>
              ))}
            </HStack>

            <HStack spacing={2}>
              <GhostButton
                h="28px"
                px={3}
                fontSize="10px"
                onClick={() =>
                  setAssignSelectedIds((prev) =>
                    Array.from(
                      new Set([...prev, ...assignModalItems.map((i) => i._id)])
                    )
                  )
                }
              >
                Select All Shown
              </GhostButton>
              <GhostButton
                h="28px"
                px={3}
                fontSize="10px"
                onClick={() => {
                  const shownSet = new Set(assignModalItems.map((i) => i._id));
                  setAssignSelectedIds((prev) =>
                    prev.filter((id) => !shownSet.has(id))
                  );
                }}
              >
                Unselect All Shown
              </GhostButton>
            </HStack>
          </Flex>

          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 4 }}
            spacing={3}
            maxH="420px"
            overflowY="auto"
            p={1}
          >
            {assignModalItems.map((item) => {
              const checked = assignSelectedIds.includes(item._id);
              return (
                <Box
                  as="button"
                  type="button"
                  key={item._id}
                  onClick={() => toggleAssignItem(item._id)}
                  textAlign="left"
                  borderRadius="10px"
                  overflow="hidden"
                  bg={COLORS.inputBg}
                  border={`2px solid ${
                    checked ? COLORS.accent : COLORS.border
                  }`}
                  position="relative"
                  transition="all 0.15s"
                  _hover={{ borderColor: COLORS.accent }}
                >
                  <Box position="relative" aspectRatio={1} w="100%">
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
                          bg="rgba(0,0,0,0.25)"
                          color="white"
                        >
                          <FaPlay size={14} />
                        </Flex>
                      </>
                    ) : (
                      <Image
                        src={item.mediaUrl}
                        alt={item.title}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    )}
                    <Flex
                      position="absolute"
                      top={2}
                      right={2}
                      px={2}
                      py={0.5}
                      borderRadius="5px"
                      bg={checked ? COLORS.accent : "rgba(0,0,0,0.75)"}
                      color={checked ? "#0a0a0a" : COLORS.muted}
                      fontSize="9px"
                      fontWeight="700"
                      align="center"
                      gap={1}
                    >
                      {checked ? (
                        <>
                          <FaCheck size={8} /> TAGGED
                        </>
                      ) : (
                        "CLICK TO TAG"
                      )}
                    </Flex>
                  </Box>
                  <Box p={2}>
                    <Text fontSize="11px" color={COLORS.text} fontWeight="600" noOfLines={1}>
                      {item.title || "Untitled"}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </VStack>
      </Modal>

      <BulkUploadModal
        isOpen={isBulkOpen}
        onClose={onBulkClose}
        startOrder={items.length}
        availableTags={allTags}
        onComplete={handleBulkComplete}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Item"
        message="This will permanently remove the gallery item."
        confirmLabel="Delete"
        loading={deleting}
      />

      <ConfirmDialog
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleConfirmDeleteTag}
        title={`Delete Tag "#${tagToDelete}"`}
        message={`This will remove "#${tagToDelete}" from the tag list and untag any gallery items that use it.`}
        confirmLabel="Delete Tag"
        loading={deletingTag}
      />
    </AdminLayout>
  );
}

