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
  IconButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaPlus, FaPen, FaTrash, FaFolderOpen, FaGripVertical } from "react-icons/fa";
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
} from "../../../component/admin/AdminUI";
import ImageUploader from "../../../component/admin/ImageUploader";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableProjectCard({ project, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={COLORS.card}
      border={`1px solid ${COLORS.border}`}
      borderRadius="12px"
      overflow="hidden"
      position="relative"
      transition="all 0.3s ease"
      _hover={{
        borderColor: COLORS.borderStrong,
        transform: "translateY(-3px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
      }}
    >
      <Box h="180px" bg={COLORS.inputBg} position="relative" overflow="hidden">
        {project.img ? (
          <Box
            as="img"
            src={project.img}
            alt={project.title}
            w="100%"
            h="100%"
            objectFit="contain"
            p={5}
            filter="grayscale(100%)"
            transition="filter 0.4s"
            _hover={{ filter: "grayscale(0%)" }}
          />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center" color={COLORS.dim}>
            <FaFolderOpen size={32} />
          </Flex>
        )}
        <IconButton
          {...attributes}
          {...listeners}
          icon={<FaGripVertical size={11} />}
          aria-label="Drag"
          position="absolute"
          top={3}
          right={3}
          size="sm"
          bg="rgba(10,10,10,0.85)"
          color={COLORS.muted}
          border={`1px solid ${COLORS.border}`}
          borderRadius="6px"
          _hover={{ color: COLORS.accent, borderColor: COLORS.accent }}
          cursor="grab"
          _active={{ cursor: "grabbing" }}
        />
        <Box
          position="absolute"
          top={3}
          left={3}
          px={2}
          py={1}
          bg="rgba(10,10,10,0.85)"
          border={`1px solid ${COLORS.border}`}
          borderRadius="6px"
        >
          <Text fontSize="10px" color={COLORS.muted} letterSpacing="1px">
            #{project.order ?? 0}
          </Text>
        </Box>
      </Box>
      <Box p={5}>
        <Heading fontSize="15px" color={COLORS.text} fontWeight="600" mb={2} noOfLines={1}>
          {project.title}
        </Heading>
        <Text color={COLORS.muted} fontSize="12px" lineHeight="1.6" mb={4} noOfLines={2} minH="32px">
          {project.description}
        </Text>
        {project.projectDate && (
          <Text fontSize="10px" color={COLORS.dim} letterSpacing="1px" textTransform="uppercase" mb={4}>
            {new Date(project.projectDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </Text>
        )}
        <HStack spacing={2}>
          <IconAction icon={<FaPen size={11} />} aria-label="Edit" onClick={() => onEdit(project)} />
          <IconAction tone="danger" icon={<FaTrash size={11} />} aria-label="Delete" onClick={() => onDelete(project._id)} />
        </HStack>
      </Box>
    </Box>
  );
}

const EMPTY = {
  title: "",
  description: "",
  github: "",
  img: "",
  website: "",
  projectDate: "",
  order: 0,
};

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) setProjects(data.data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch projects", status: "error", duration: 3000 });
    } finally {
      setFetching(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((i) => i._id === active.id);
      const newIndex = projects.findIndex((i) => i._id === over.id);
      const reordered = arrayMove(projects, oldIndex, newIndex);
      setProjects(reordered);

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/projects/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ projects: reordered.map((p) => p._id) }),
        });
        const data = await response.json();
        if (data.success) {
          toast({ title: "Order saved", status: "success", duration: 2000 });
          fetchProjects();
        } else {
          toast({ title: "Error", description: data.message || "Failed", status: "error", duration: 3000 });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to save order", status: "error", duration: 3000 });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
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
        fetchProjects();
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

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      github: project.github,
      img: project.img,
      website: project.website || "",
      projectDate:
        project.projectDate && !isNaN(Date.parse(project.projectDate))
          ? (() => {
              const d = new Date(project.projectDate);
              return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            })()
          : "",
      order: project.order || 0,
    });
    setEditingId(project._id);
    onOpen();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/projects/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Deleted", status: "success", duration: 3000 });
        fetchProjects();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete", status: "error", duration: 3000 });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleCloseModal = () => {
    setFormData(EMPTY);
    setEditingId(null);
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <PrimaryButton onClick={onOpen} h="38px" px={5} fontSize="11px" leftIcon={<FaPlus size={11} />}>
      Add Project
    </PrimaryButton>
  );

  return (
    <AdminLayout
      title="Projects"
      subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} · drag to reorder`}
      actions={actions}
    >
      {fetching ? (
        <Loading label="Loading projects" />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FaFolderOpen}
          title="No projects yet"
          description="Showcase your work by adding your first project."
          action={<PrimaryButton onClick={onOpen} leftIcon={<FaPlus size={11} />}>Add Project</PrimaryButton>}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p._id)} strategy={rectSortingStrategy}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
              {projects.map((p) => (
                <SortableProjectCard
                  key={p._id}
                  project={p}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={editingId ? "Edit Project" : "Add Project"}
        size="xl"
        footer={
          <>
            <GhostButton onClick={handleCloseModal} h="40px">Cancel</GhostButton>
            <PrimaryButton type="submit" form="proj-form" isLoading={loading} h="40px">
              {editingId ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="proj-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <Field label="Title" required>
              <TextInput name="title" value={formData.title} onChange={handleChange} placeholder="Project name" />
            </Field>
            <Field label="Description" required>
              <TextArea name="description" value={formData.description} onChange={handleChange} rows={5} />
            </Field>
            <Field label="Project Image">
              <ImageUploader label="" currentImage={formData.img} onImageSelect={(url) => setFormData({ ...formData, img: url })} />
            </Field>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Field label="GitHub URL" required>
                <TextInput name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
              </Field>
              <Field label="Website URL">
                <TextInput name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
              </Field>
              <Field label="Project Date">
                <TextInput
                  name="projectDate"
                  type="datetime-local"
                  value={formData.projectDate}
                  onChange={handleChange}
                  sx={{ "&::-webkit-calendar-picker-indicator": { filter: "invert(1)", cursor: "pointer" } }}
                />
              </Field>
              <Field label="Display Order" helper="Drag cards in the grid to reorder.">
                <TextInput name="order" type="number" value={formData.order} onChange={handleChange} />
              </Field>
            </SimpleGrid>
          </VStack>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="This will remove the project from your portfolio. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminLayout>
  );
}
