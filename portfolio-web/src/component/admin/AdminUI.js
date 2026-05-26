import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  IconButton,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export const COLORS = {
  bg: "#0a0a0a",
  panel: "#0f0f0f",
  card: "#141414",
  cardHover: "#1a1a1a",
  inputBg: "#0c0c0c",
  border: "#2a2a2a",
  borderStrong: "#3a3a3a",
  text: "#e0e0e0",
  muted: "#888888",
  dim: "#555555",
  faint: "#333333",
  accent: "#e2b714",
  danger: "#ff5252",
};

const MotionBox = motion(Box);

// ─── Panel / Card ─────────────────────────────────────────────────────────
export function Panel({ children, ...props }) {
  return (
    <Box
      bg={COLORS.card}
      border={`1px solid ${COLORS.border}`}
      borderRadius="12px"
      p={[5, 6, 7]}
      {...props}
    >
      {children}
    </Box>
  );
}

// ─── Section label inside a form ──────────────────────────────────────────
export function SectionLabel({ children, mt = 6, mb = 4 }) {
  return (
    <Flex align="center" gap={3} mt={mt} mb={mb}>
      <Text
        fontSize="10px"
        color={COLORS.muted}
        letterSpacing="3px"
        textTransform="uppercase"
        fontWeight="500"
        whiteSpace="nowrap"
      >
        {children}
      </Text>
      <Box flex="1" h="1px" bg={COLORS.border} />
    </Flex>
  );
}

// ─── Field label ──────────────────────────────────────────────────────────
export function FieldLabel({ children, required }) {
  return (
    <FormLabel
      color={COLORS.muted}
      fontSize="10px"
      fontWeight="500"
      letterSpacing="2px"
      textTransform="uppercase"
      mb={2}
    >
      {children}
      {required && (
        <Text as="span" color={COLORS.accent} ml={1}>
          *
        </Text>
      )}
    </FormLabel>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────
export function Field({ label, required, helper, children, ...rest }) {
  return (
    <FormControl isRequired={required} {...rest}>
      {label && <FieldLabel required={required}>{label}</FieldLabel>}
      {children}
      {helper && (
        <Text fontSize="10px" color={COLORS.dim} mt={1.5} letterSpacing="0.5px">
          {helper}
        </Text>
      )}
    </FormControl>
  );
}

const sharedFieldStyles = {
  bg: COLORS.inputBg,
  border: `1px solid ${COLORS.border}`,
  color: COLORS.text,
  borderRadius: "8px",
  fontSize: "14px",
  _placeholder: { color: COLORS.dim, fontSize: "13px" },
  _hover: { borderColor: COLORS.borderStrong },
  _focus: {
    borderColor: COLORS.accent,
    boxShadow: `0 0 0 1px ${COLORS.accent}40`,
    bg: COLORS.card,
  },
  transition: "all 0.2s ease",
};

export function TextInput(props) {
  return <Input {...sharedFieldStyles} h="44px" {...props} />;
}

export function TextArea(props) {
  return <Textarea {...sharedFieldStyles} minH="100px" py={3} {...props} />;
}

export function SelectInput({ children, ...props }) {
  return (
    <Select
      {...sharedFieldStyles}
      h="44px"
      sx={{
        "& option": { background: COLORS.card, color: COLORS.text },
      }}
      {...props}
    >
      {children}
    </Select>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────────
export function PrimaryButton({ children, ...props }) {
  return (
    <Button
      bg={COLORS.accent}
      color="#0a0a0a"
      borderRadius="8px"
      fontWeight="600"
      letterSpacing="1px"
      textTransform="uppercase"
      fontSize="12px"
      h="44px"
      px={6}
      _hover={{
        bg: "#f0c52a",
        transform: "translateY(-1px)",
        boxShadow: "0 8px 24px rgba(226,183,20,0.25)",
      }}
      _active={{ transform: "translateY(0)" }}
      transition="all 0.2s ease"
      {...props}
    >
      {children}
    </Button>
  );
}

export function GhostButton({ children, ...props }) {
  return (
    <Button
      bg="transparent"
      color={COLORS.muted}
      border={`1px solid ${COLORS.border}`}
      borderRadius="8px"
      fontWeight="500"
      letterSpacing="1px"
      textTransform="uppercase"
      fontSize="12px"
      h="44px"
      px={5}
      _hover={{
        color: COLORS.text,
        borderColor: COLORS.borderStrong,
        bg: COLORS.card,
      }}
      transition="all 0.2s ease"
      {...props}
    >
      {children}
    </Button>
  );
}

export function DangerButton({ children, ...props }) {
  return (
    <Button
      bg="transparent"
      color={COLORS.danger}
      border={`1px solid rgba(255,82,82,0.35)`}
      borderRadius="8px"
      fontWeight="500"
      letterSpacing="1px"
      textTransform="uppercase"
      fontSize="12px"
      h="44px"
      px={5}
      _hover={{
        bg: "rgba(255,82,82,0.08)",
        borderColor: COLORS.danger,
      }}
      transition="all 0.2s ease"
      {...props}
    >
      {children}
    </Button>
  );
}

export function IconAction({ tone = "default", ...props }) {
  const palette = {
    default: { color: COLORS.muted, hover: COLORS.text, border: COLORS.border, hoverBorder: COLORS.borderStrong },
    primary: { color: COLORS.accent, hover: COLORS.accent, border: "rgba(226,183,20,0.3)", hoverBorder: COLORS.accent },
    danger: { color: COLORS.danger, hover: COLORS.danger, border: "rgba(255,82,82,0.3)", hoverBorder: COLORS.danger },
  }[tone];

  return (
    <IconButton
      size="sm"
      bg="transparent"
      color={palette.color}
      border={`1px solid ${palette.border}`}
      borderRadius="8px"
      _hover={{
        color: palette.hover,
        borderColor: palette.hoverBorder,
        bg: tone === "danger" ? "rgba(255,82,82,0.08)" : tone === "primary" ? "rgba(226,183,20,0.08)" : COLORS.card,
      }}
      transition="all 0.2s ease"
      {...props}
    />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Box
      bg={COLORS.card}
      border={`1px dashed ${COLORS.border}`}
      borderRadius="12px"
      p={[10, 14]}
      textAlign="center"
    >
      {Icon && (
        <Flex
          align="center"
          justify="center"
          mx="auto"
          mb={4}
          w="48px"
          h="48px"
          borderRadius="50%"
          bg="rgba(226,183,20,0.08)"
          color={COLORS.accent}
        >
          <Icon size={20} />
        </Flex>
      )}
      <Heading
        fontSize="16px"
        color={COLORS.text}
        fontWeight="500"
        mb={2}
        letterSpacing="0.5px"
      >
        {title || "Nothing here yet"}
      </Heading>
      {description && (
        <Text color={COLORS.muted} fontSize="13px" mb={action ? 6 : 0}>
          {description}
        </Text>
      )}
      {action}
    </Box>
  );
}

// ─── Loading ──────────────────────────────────────────────────────────────
export function Loading({ label = "Loading" }) {
  return (
    <Flex align="center" justify="center" py={20}>
      <VStack spacing={3}>
        <Spinner size="md" color={COLORS.accent} thickness="2px" />
        <Text
          fontSize="10px"
          color={COLORS.muted}
          letterSpacing="3px"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </VStack>
    </Flex>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, footer, size = "lg" }) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} size={size} isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(6px)" />
      <ModalContent
        bg={COLORS.panel}
        color={COLORS.text}
        border={`1px solid ${COLORS.border}`}
        borderRadius="14px"
        boxShadow="0 24px 60px rgba(0,0,0,0.6)"
        mx={4}
      >
        <ModalHeader
          fontSize="13px"
          fontWeight="600"
          letterSpacing="2px"
          textTransform="uppercase"
          color={COLORS.text}
          borderBottom={`1px solid ${COLORS.border}`}
          py={4}
        >
          {title}
        </ModalHeader>
        <ModalCloseButton
          color={COLORS.muted}
          _hover={{ color: COLORS.text, bg: COLORS.card }}
          borderRadius="8px"
          mt={1}
          mr={2}
        />
        <ModalBody py={6}>{children}</ModalBody>
        {footer && (
          <ModalFooter borderTop={`1px solid ${COLORS.border}`} gap={3}>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </ChakraModal>
  );
}

// ─── Confirm dialog ───────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Confirm", message, confirmLabel = "Delete", loading }) {
  const cancelRef = React.useRef();
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef} isCentered>
      <AlertDialogOverlay bg="blackAlpha.800" backdropFilter="blur(6px)">
        <AlertDialogContent
          bg={COLORS.panel}
          color={COLORS.text}
          border={`1px solid ${COLORS.border}`}
          borderRadius="14px"
          mx={4}
        >
          <AlertDialogHeader
            fontSize="13px"
            fontWeight="600"
            letterSpacing="2px"
            textTransform="uppercase"
            color={COLORS.text}
            borderBottom={`1px solid ${COLORS.border}`}
          >
            {title}
          </AlertDialogHeader>
          <AlertDialogBody py={5} color={COLORS.muted} fontSize="14px" lineHeight="1.6">
            {message}
          </AlertDialogBody>
          <AlertDialogFooter borderTop={`1px solid ${COLORS.border}`} gap={3}>
            <GhostButton ref={cancelRef} onClick={onClose} h="40px">
              Cancel
            </GhostButton>
            <DangerButton onClick={onConfirm} isLoading={loading} h="40px">
              {confirmLabel}
            </DangerButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

// ─── Stat / Count badge ───────────────────────────────────────────────────
export function CountBadge({ children }) {
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minW="24px"
      h="24px"
      px={2}
      fontSize="11px"
      fontWeight="600"
      color={COLORS.accent}
      bg="rgba(226,183,20,0.1)"
      border={`1px solid rgba(226,183,20,0.25)`}
      borderRadius="6px"
      letterSpacing="0.5px"
    >
      {children}
    </Box>
  );
}

// ─── Animated card wrapper for grid items ────────────────────────────────
export function GridCard({ children, index = 0, ...props }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      bg={COLORS.card}
      border={`1px solid ${COLORS.border}`}
      borderRadius="12px"
      overflow="hidden"
      position="relative"
      transition_chakra="all 0.3s ease"
      _hover={{
        borderColor: COLORS.borderStrong,
        transform: "translateY(-3px)",
        boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
      }}
      {...props}
    >
      {children}
    </MotionBox>
  );
}
