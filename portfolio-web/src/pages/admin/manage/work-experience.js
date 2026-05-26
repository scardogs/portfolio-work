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
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaBriefcase } from "react-icons/fa";
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

const EMPTY = {
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "Present",
  technologies: "",
  location: "",
  order: 0,
};

export default function ManageWorkExperience() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/work-experience");
      const data = await response.json();
      if (data.success) setExperiences(data.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch", status: "error", duration: 3000 });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId ? `/api/work-experience/${editingId}` : "/api/work-experience/create";
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: editingId ? "Updated" : "Created", status: "success", duration: 3000 });
        fetchExperiences();
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

  const handleEdit = (exp) => {
    setFormData({ ...exp, technologies: (exp.technologies || []).join(", ") });
    setEditingId(exp._id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/work-experience/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success", duration: 3000 });
        fetchExperiences();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleClose = () => {
    setFormData(EMPTY);
    setEditingId(null);
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <PrimaryButton onClick={onOpen} h="38px" px={5} fontSize="11px" leftIcon={<FaPlus size={11} />}>
      Add Experience
    </PrimaryButton>
  );

  return (
    <AdminLayout
      title="Work Experience"
      subtitle={`${experiences.length} entr${experiences.length !== 1 ? "ies" : "y"}`}
      actions={actions}
    >
      {fetching ? (
        <Loading label="Loading experience" />
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={FaBriefcase}
          title="No work experience yet"
          description="Add your professional history entries here."
          action={<PrimaryButton onClick={onOpen} leftIcon={<FaPlus size={11} />}>Add Experience</PrimaryButton>}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {experiences.map((exp, i) => (
            <GridCard key={exp._id} index={i}>
              <Box p={6}>
                <Flex justify="space-between" align="start" mb={4}>
                  <Box flex="1" pr={3}>
                    <Heading fontSize="16px" color={COLORS.text} fontWeight="600" mb={1} noOfLines={1}>
                      {exp.position}
                    </Heading>
                    <Text color={COLORS.accent} fontSize="13px" fontWeight="500" mb={1} noOfLines={1}>
                      {exp.company}
                    </Text>
                    {exp.location && (
                      <Text color={COLORS.muted} fontSize="11px" mb={1}>
                        {exp.location}
                      </Text>
                    )}
                    <Text color={COLORS.dim} fontSize="11px" letterSpacing="1px" textTransform="uppercase">
                      {exp.startDate} — {exp.endDate}
                    </Text>
                  </Box>
                </Flex>

                <Text color={COLORS.muted} fontSize="13px" lineHeight="1.6" mb={4} noOfLines={3}>
                  {exp.description}
                </Text>

                {exp.technologies?.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap" mb={4}>
                    {exp.technologies.slice(0, 5).map((tech, idx) => (
                      <Box
                        key={idx}
                        px={2}
                        py={1}
                        bg={COLORS.inputBg}
                        border={`1px solid ${COLORS.border}`}
                        borderRadius="4px"
                      >
                        <Text fontSize="10px" color={COLORS.muted} fontWeight="500">
                          {tech}
                        </Text>
                      </Box>
                    ))}
                    {exp.technologies.length > 5 && (
                      <Text fontSize="10px" color={COLORS.dim}>+{exp.technologies.length - 5}</Text>
                    )}
                  </HStack>
                )}

                <HStack spacing={2}>
                  <IconAction icon={<FaPen size={11} />} aria-label="Edit" onClick={() => handleEdit(exp)} />
                  <IconAction tone="danger" icon={<FaTrash size={11} />} aria-label="Delete" onClick={() => setDeleteId(exp._id)} />
                </HStack>
              </Box>
            </GridCard>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? "Edit Experience" : "Add Experience"}
        size="xl"
        footer={
          <>
            <GhostButton onClick={handleClose} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="exp-form" isLoading={loading} h="40px">
              {editingId ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="exp-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Field label="Position" required>
                <TextInput name="position" value={formData.position} onChange={handleChange} placeholder="Software Engineer" />
              </Field>
              <Field label="Company" required>
                <TextInput name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." />
              </Field>
              <Field label="Location">
                <TextInput name="location" value={formData.location} onChange={handleChange} placeholder="Cebu City, PH" />
              </Field>
              <Field label="Display Order">
                <TextInput name="order" type="number" value={formData.order} onChange={handleChange} />
              </Field>
              <Field label="Start Date" required>
                <TextInput name="startDate" value={formData.startDate} onChange={handleChange} placeholder="Jan 2020" />
              </Field>
              <Field label="End Date">
                <TextInput name="endDate" value={formData.endDate} onChange={handleChange} placeholder="Present" />
              </Field>
            </SimpleGrid>
            <Field label="Description" required>
              <TextArea name="description" value={formData.description} onChange={handleChange} rows={4} />
            </Field>
            <Field label="Technologies" helper="Comma separated, e.g. React, Node.js, MongoDB">
              <TextInput name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </Field>
          </VStack>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        message="This will remove the experience entry from your portfolio."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
