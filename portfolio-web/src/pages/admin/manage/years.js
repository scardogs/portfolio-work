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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaCalendarAlt } from "react-icons/fa";
import AdminLayout from "../../../component/admin/AdminLayout";
import {
  Field,
  TextInput,
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

export default function ManageYears() {
  const [years, setYears] = useState([]);
  const [formData, setFormData] = useState({ year: "", label: "", order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await fetch("/api/years");
      const data = await response.json();
      if (data.success) setYears(data.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch years", status: "error", duration: 3000 });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId ? `/api/years/${editingId}` : "/api/years/create";
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          order: parseInt(formData.order),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: editingId ? "Updated" : "Created", status: "success", duration: 3000 });
        fetchYears();
        handleClose();
      } else {
        toast({ title: "Error", description: data.message || "Failed", status: "error", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (year) => {
    setFormData({ year: year.year, label: year.label, order: year.order });
    setEditingId(year._id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/years/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success", duration: 3000 });
        fetchYears();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleClose = () => {
    setFormData({ year: "", label: "", order: 0 });
    setEditingId(null);
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <PrimaryButton onClick={onOpen} h="38px" px={5} fontSize="11px" leftIcon={<FaPlus size={11} />}>
      Add Milestone
    </PrimaryButton>
  );

  return (
    <AdminLayout title="Milestones" subtitle={`${years.length} entr${years.length !== 1 ? "ies" : "y"}`} actions={actions}>
      {fetching ? (
        <Loading label="Loading milestones" />
      ) : years.length === 0 ? (
        <EmptyState
          icon={FaCalendarAlt}
          title="No milestones yet"
          description="Add key years and achievements to display on your portfolio timeline."
          action={<PrimaryButton onClick={onOpen} leftIcon={<FaPlus size={11} />}>Add Milestone</PrimaryButton>}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {years.map((y, i) => (
            <GridCard key={y._id} index={i}>
              <Box p={6}>
                <Flex justify="space-between" align="start" mb={3}>
                  <Text
                    fontSize="32px"
                    fontWeight="700"
                    color={COLORS.text}
                    letterSpacing="-1px"
                    lineHeight="1"
                  >
                    {y.year}
                  </Text>
                  <Box
                    px={2}
                    py={1}
                    borderRadius="6px"
                    bg="rgba(226,183,20,0.08)"
                    border={`1px solid rgba(226,183,20,0.2)`}
                  >
                    <Text fontSize="10px" color={COLORS.accent} letterSpacing="1px">
                      #{y.order ?? 0}
                    </Text>
                  </Box>
                </Flex>
                <Text color={COLORS.muted} fontSize="13px" lineHeight="1.6" mb={5} minH="40px">
                  {y.label}
                </Text>
                <HStack spacing={2}>
                  <IconAction icon={<FaPen size={11} />} aria-label="Edit" onClick={() => handleEdit(y)} />
                  <IconAction tone="danger" icon={<FaTrash size={11} />} aria-label="Delete" onClick={() => setDeleteId(y._id)} />
                </HStack>
              </Box>
            </GridCard>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? "Edit Milestone" : "Add Milestone"}
        footer={
          <>
            <GhostButton onClick={handleClose} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="year-form" isLoading={loading} h="40px">
              {editingId ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="year-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Year" required>
              <TextInput name="year" type="number" value={formData.year} onChange={handleChange} placeholder="2024" />
            </Field>
            <Field label="Label" required helper="A short description of what happened that year.">
              <TextInput name="label" value={formData.label} onChange={handleChange} placeholder="e.g. Graduated college" />
            </Field>
            <Field label="Display Order">
              <TextInput name="order" type="number" value={formData.order} onChange={handleChange} />
            </Field>
          </VStack>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        message="This will remove the milestone from your portfolio timeline."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
