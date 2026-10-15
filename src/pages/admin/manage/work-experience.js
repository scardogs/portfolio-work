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
import {
  FaPlus,
  FaPen,
  FaTrash,
  FaBriefcase,
  FaGripVertical,
  FaArrowUp,
  FaArrowDown,
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
} from "../../../component/admin/AdminUI";
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

function SortableExperienceCard({
  exp,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exp._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 1000 : 1,
    opacity: isDragging ? 0.88 : 1,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      bg={COLORS.card}
      border={`1px solid ${isDragging ? COLORS.accent : COLORS.border}`}
      borderRadius="12px"
      overflow="hidden"
      position="relative"
      transition="border-color 0.2s ease, box-shadow 0.2s ease"
      boxShadow={isDragging ? "0 20px 50px rgba(0,0,0,0.75)" : "none"}
      _hover={{
        borderColor: isDragging ? COLORS.accent : COLORS.borderStrong,
        boxShadow: isDragging
          ? "0 20px 50px rgba(0,0,0,0.75)"
          : "0 12px 32px rgba(0,0,0,0.4)",
      }}
    >
      <Box p={6}>
        {/* Top bar: Order badge + Drag Handle */}
        <Flex justify="space-between" align="center" mb={4}>
          <HStack spacing={2}>
            <Box
              px={2.5}
              py={1}
              bg={COLORS.inputBg}
              border={`1px solid ${COLORS.border}`}
              borderRadius="6px"
            >
              <Text
                fontSize="10px"
                color={COLORS.accent}
                fontWeight="600"
                letterSpacing="1px"
                fontFamily="monospace"
              >
                #{String(index + 1).padStart(2, "0")}
              </Text>
            </Box>
            <Text
              color={COLORS.dim}
              fontSize="11px"
              letterSpacing="1px"
              textTransform="uppercase"
            >
              {exp.startDate} — {exp.endDate}
            </Text>
          </HStack>

          <HStack spacing={1}>
            <IconButton
              icon={<FaArrowUp size={10} />}
              aria-label="Move up"
              size="xs"
              variant="ghost"
              color={COLORS.muted}
              isDisabled={index === 0}
              onClick={() => onMoveUp(index)}
              _hover={{ color: COLORS.text, bg: COLORS.inputBg }}
            />
            <IconButton
              icon={<FaArrowDown size={10} />}
              aria-label="Move down"
              size="xs"
              variant="ghost"
              color={COLORS.muted}
              isDisabled={index === total - 1}
              onClick={() => onMoveDown(index)}
              _hover={{ color: COLORS.text, bg: COLORS.inputBg }}
            />
            <IconButton
              {...attributes}
              {...listeners}
              icon={<FaGripVertical size={12} />}
              aria-label="Drag to reorder"
              title="Drag to reorder"
              size="sm"
              bg={COLORS.inputBg}
              color={COLORS.muted}
              border={`1px solid ${COLORS.border}`}
              borderRadius="6px"
              _hover={{ color: COLORS.accent, borderColor: COLORS.accent }}
              cursor="grab"
              _active={{ cursor: "grabbing" }}
              style={{ touchAction: "none" }}
            />
          </HStack>
        </Flex>

        <Flex justify="space-between" align="start" mb={3}>
          <Box flex="1" pr={3}>
            <Heading
              fontSize="16px"
              color={COLORS.text}
              fontWeight="600"
              mb={1}
              noOfLines={1}
            >
              {exp.position}
            </Heading>
            <Text
              color={COLORS.accent}
              fontSize="13px"
              fontWeight="500"
              mb={1}
              noOfLines={1}
            >
              {exp.company}
            </Text>
            {exp.location && (
              <Text color={COLORS.muted} fontSize="11px">
                {exp.location}
              </Text>
            )}
          </Box>
        </Flex>

        <Text
          color={COLORS.muted}
          fontSize="13px"
          lineHeight="1.6"
          mb={4}
          noOfLines={3}
        >
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
              <Text fontSize="10px" color={COLORS.dim}>
                +{exp.technologies.length - 5}
              </Text>
            )}
          </HStack>
        )}

        <HStack spacing={2} pt={2} borderTop={`1px solid ${COLORS.border}`}>
          <IconAction
            icon={<FaPen size={11} />}
            aria-label="Edit"
            onClick={() => onEdit(exp)}
          />
          <IconAction
            tone="danger"
            icon={<FaTrash size={11} />}
            aria-label="Delete"
            onClick={() => onDelete(exp._id)}
          />
        </HStack>
      </Box>
    </Box>
  );
}

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 2 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/work-experience");
      const data = await response.json();
      if (data.success) setExperiences(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch",
        status: "error",
        duration: 3000,
      });
    } finally {
      setFetching(false);
    }
  };

  const persistOrder = async (reordered) => {
    const withUpdatedOrder = reordered.map((e, idx) => ({ ...e, order: idx }));
    setExperiences(withUpdatedOrder);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/work-experience/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experiences: withUpdatedOrder.map((e) => e._id) }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Order saved", status: "success", duration: 1500 });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save order",
          status: "error",
          duration: 3000,
        });
        fetchExperiences();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save order",
        status: "error",
        duration: 3000,
      });
      fetchExperiences();
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = experiences.findIndex((i) => i._id === active.id);
    const newIndex = experiences.findIndex((i) => i._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(experiences, oldIndex, newIndex);
    await persistOrder(reordered);
  };

  const handleMoveUp = async (index) => {
    if (index <= 0) return;
    const reordered = arrayMove(experiences, index, index - 1);
    await persistOrder(reordered);
  };

  const handleMoveDown = async (index) => {
    if (index >= experiences.length - 1) return;
    const reordered = arrayMove(experiences, index, index + 1);
    await persistOrder(reordered);
  };

  const handleOpenCreate = () => {
    setFormData({ ...EMPTY, order: experiences.length });
    setEditingId(null);
    onOpen();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const url = editingId
      ? `/api/work-experience/${editingId}`
      : "/api/work-experience/create";
    const method = editingId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast({
          title: editingId ? "Updated" : "Created",
          status: "success",
          duration: 3000,
        });
        fetchExperiences();
        handleClose();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed",
          status: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      ...exp,
      technologies: (exp.technologies || []).join(", "),
    });
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
      toast({
        title: "Error",
        description: "Failed to delete",
        status: "error",
        duration: 3000,
      });
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const actions = (
    <PrimaryButton
      onClick={handleOpenCreate}
      h="38px"
      px={5}
      fontSize="11px"
      leftIcon={<FaPlus size={11} />}
    >
      Add Experience
    </PrimaryButton>
  );

  return (
    <AdminLayout
      title="Work Experience"
      subtitle={`${experiences.length} entr${
        experiences.length !== 1 ? "ies" : "y"
      } · drag to reorder`}
      actions={actions}
    >
      {fetching ? (
        <Loading label="Loading experience" />
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={FaBriefcase}
          title="No work experience yet"
          description="Add your professional history entries here."
          action={
            <PrimaryButton
              onClick={handleOpenCreate}
              leftIcon={<FaPlus size={11} />}
            >
              Add Experience
            </PrimaryButton>
          }
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experiences.map((e) => e._id)}
            strategy={rectSortingStrategy}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {experiences.map((exp, i) => (
                <SortableExperienceCard
                  key={exp._id}
                  exp={exp}
                  index={i}
                  total={experiences.length}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteId(id)}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingId ? "Edit Experience" : "Add Experience"}
        size="xl"
        footer={
          <>
            <GhostButton onClick={handleClose} h="40px">
              Cancel
            </GhostButton>
            <PrimaryButton
              type="submit"
              form="exp-form"
              isLoading={loading}
              h="40px"
            >
              {editingId ? "Update" : "Create"}
            </PrimaryButton>
          </>
        }
      >
        <form id="exp-form" onSubmit={handleSubmit}>
          <VStack spacing={5} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Field label="Position" required>
                <TextInput
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                />
              </Field>
              <Field label="Company" required>
                <TextInput
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                />
              </Field>
              <Field label="Location">
                <TextInput
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Cebu City, PH"
                />
              </Field>
              <Field label="Display Order">
                <TextInput
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Start Date" required>
                <TextInput
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  placeholder="Jan 2020"
                />
              </Field>
              <Field label="End Date">
                <TextInput
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  placeholder="Present"
                />
              </Field>
            </SimpleGrid>
            <Field label="Description" required>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </Field>
            <Field
              label="Technologies"
              helper="Comma separated, e.g. React, Node.js, MongoDB"
            >
              <TextInput
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
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
