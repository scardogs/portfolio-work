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
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaLaptopCode } from "react-icons/fa";
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
import ImageUploader from "../../../component/admin/ImageUploader";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({ name: "", icon: "", order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      const data = await response.json();
      if (data.success) setSkills(data.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch skills", status: "error", duration: 3000 });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: editingId ? "Updated" : "Created", status: "success", duration: 3000 });
        fetchSkills();
        handleCloseModal();
      } else {
        toast({ title: "Error", description: data.message || "Failed", status: "error", duration: 3000 });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred", status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({ name: skill.name, icon: skill.icon, order: skill.order || 0 });
    setEditingId(skill._id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/skills/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success", duration: 3000 });
        fetchSkills();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setFormData({ name: "", icon: "", order: 0 });
    setEditingId(null);
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <PrimaryButton onClick={onOpen} h="38px" px={5} fontSize="11px" leftIcon={<FaPlus size={11} />}>
      Add Skill
    </PrimaryButton>
  );

  return (
    <AdminLayout title="Tech Stack" subtitle={`${skills.length} skill${skills.length !== 1 ? "s" : ""}`} actions={actions}>
      {fetching ? (
        <Loading label="Loading skills" />
      ) : skills.length === 0 ? (
        <EmptyState
          icon={FaLaptopCode}
          title="No skills yet"
          description="Add your first technology to display it on your portfolio."
          action={<PrimaryButton onClick={onOpen} leftIcon={<FaPlus size={11} />}>Add Skill</PrimaryButton>}
        />
      ) : (
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
          {skills.map((skill, i) => (
            <GridCard key={skill._id} index={i}>
              <Box p={5} textAlign="center">
                <Flex
                  align="center"
                  justify="center"
                  w="60px"
                  h="60px"
                  mx="auto"
                  mb={3}
                  borderRadius="10px"
                  bg={COLORS.inputBg}
                  border={`1px solid ${COLORS.border}`}
                >
                  {skill.icon ? (
                    <Image src={skill.icon} alt={skill.name} maxW="36px" maxH="36px" filter="grayscale(80%) invert(0.9)" />
                  ) : (
                    <FaLaptopCode color={COLORS.muted} />
                  )}
                </Flex>
                <Text fontSize="13px" color={COLORS.text} fontWeight="500" mb={1} noOfLines={1}>
                  {skill.name}
                </Text>
                <Text fontSize="10px" color={COLORS.dim} letterSpacing="1px" textTransform="uppercase" mb={3}>
                  Order {skill.order ?? 0}
                </Text>
                <HStack spacing={2} justify="center">
                  <IconAction icon={<FaPen size={11} />} aria-label="Edit" onClick={() => handleEdit(skill)} />
                  <IconAction tone="danger" icon={<FaTrash size={11} />} aria-label="Delete" onClick={() => setDeleteId(skill._id)} />
                </HStack>
              </Box>
            </GridCard>
          ))}
        </SimpleGrid>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={editingId ? "Edit Skill" : "Add Skill"}
        footer={
          <>
            <GhostButton onClick={handleCloseModal} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="skill-form" isLoading={loading} h="40px">
              {editingId ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="skill-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Name" required>
              <TextInput name="name" value={formData.name} onChange={handleChange} placeholder="e.g. React" />
            </Field>
            <Field label="Icon" required>
              <ImageUploader label="" currentImage={formData.icon} onImageSelect={(url) => setFormData({ ...formData, icon: url })} />
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
        title="Delete Skill"
        message="This will remove the skill from your portfolio. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
