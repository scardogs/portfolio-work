import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Image,
  Input,
  Progress,
  Icon,
} from "@chakra-ui/react";
import { FaCloudUploadAlt, FaPlay, FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import { Modal, PrimaryButton, GhostButton, COLORS } from "./AdminUI";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const CONCURRENCY = 3;

// Upload a single file straight to Cloudinary, then create the gallery item.
async function uploadOne(file, order, onProgress) {
  const token = localStorage.getItem("token");

  // 1. Fresh signature per file
  const signResponse = await fetch("/api/cloudinary/sign", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const signData = await signResponse.json();
  if (!signData.success) {
    throw new Error(signData.message || "Failed to get upload signature");
  }

  const { signature, timestamp, apiKey, cloudName } = signData;
  const isVideo = file.type.startsWith("video/");

  // 2. Direct upload to Cloudinary with progress
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apiKey);
  formData.append("folder", "portfolio");

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`;

  const cloudData = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
      else reject(new Error("Cloudinary upload failed"));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.open("POST", uploadUrl);
    xhr.send(formData);
  });

  if (!cloudData.secure_url) throw new Error("Upload failed");

  // 3. Create the gallery item
  const mediaType = isVideo ? "video" : "image";
  const createResponse = await fetch("/api/content-generation", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      mediaUrl: cloudData.secure_url,
      mediaType,
      order,
    }),
  });
  const createData = await createResponse.json();
  if (!createData.success) throw new Error(createData.message || "Failed to save item");

  return createData.data;
}

export default function BulkUploadModal({ isOpen, onClose, startOrder = 0, onComplete }) {
  const [files, setFiles] = useState([]); // { id, file, name, preview, isVideo, status, progress, error }
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const reset = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
      return [];
    });
    setUploading(false);
  }, []);

  const handleClose = () => {
    if (uploading) return; // don't close mid-upload
    reset();
    onClose();
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    const accepted = [];
    incoming.forEach((file) => {
      const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/");
      if (!isMedia || file.size > MAX_SIZE) return;
      accepted.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
        isVideo: file.type.startsWith("video/"),
        status: "pending",
        progress: 0,
        error: null,
      });
    });
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.id));
      return [...prev, ...accepted.filter((f) => !seen.has(f.id))];
    });
  };

  const handleSelect = (e) => {
    addFiles(e.target.files);
    e.target.value = ""; // allow re-selecting the same files
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const update = (id, patch) =>
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  const handleUpload = async () => {
    const queue = files.filter((f) => f.status === "pending" || f.status === "error");
    if (queue.length === 0) return;
    setUploading(true);

    let orderCursor = startOrder;
    let cursor = 0;
    let successCount = 0;

    const worker = async () => {
      while (cursor < queue.length) {
        const item = queue[cursor];
        const order = orderCursor;
        cursor += 1;
        orderCursor += 1;
        update(item.id, { status: "uploading", progress: 0, error: null });
        try {
          await uploadOne(item.file, order, (p) => update(item.id, { progress: p }));
          update(item.id, { status: "done", progress: 100 });
          successCount += 1;
        } catch (err) {
          update(item.id, { status: "error", error: err.message || "Failed" });
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));

    setUploading(false);
    onComplete?.(successCount);
  };

  const pendingCount = files.filter((f) => f.status === "pending" || f.status === "error").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const allDone = files.length > 0 && doneCount === files.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Upload Media"
      size="xl"
      footer={
        <>
          <GhostButton onClick={handleClose} h="40px" isDisabled={uploading}>
            {allDone ? "Done" : "Cancel"}
          </GhostButton>
          {!allDone && (
            <PrimaryButton
              onClick={handleUpload}
              h="40px"
              isLoading={uploading}
              loadingText="Uploading"
              isDisabled={pendingCount === 0}
            >
              Upload {pendingCount > 0 ? `(${pendingCount})` : ""}
            </PrimaryButton>
          )}
        </>
      }
    >
      <VStack spacing={4} align="stretch">
        {/* Drop / pick zone */}
        <Box
          as="button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          w="100%"
          py={8}
          px={4}
          bg={COLORS.inputBg}
          border={`1px dashed ${COLORS.borderStrong}`}
          borderRadius="12px"
          _hover={{ borderColor: COLORS.accent }}
          transition="border-color 0.2s"
          cursor="pointer"
        >
          <VStack spacing={2}>
            <Icon as={FaCloudUploadAlt} boxSize="28px" color={COLORS.accent} />
            <Text fontSize="13px" color={COLORS.text} fontWeight="600">
              Click or drop images & videos here
            </Text>
            <Text fontSize="11px" color={COLORS.muted}>
              Select multiple files at once · max 100MB each
            </Text>
          </VStack>
        </Box>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleSelect}
          display="none"
        />

        {files.length > 0 && (
          <Flex justify="space-between" align="center">
            <Text fontSize="11px" color={COLORS.muted} letterSpacing="1px" textTransform="uppercase">
              {files.length} file{files.length !== 1 ? "s" : ""}
              {doneCount > 0 ? ` · ${doneCount} uploaded` : ""}
            </Text>
            {!uploading && !allDone && (
              <GhostButton h="28px" px={3} fontSize="10px" onClick={reset}>
                Clear all
              </GhostButton>
            )}
          </Flex>
        )}

        {/* File list */}
        <VStack spacing={2} align="stretch" maxH="340px" overflowY="auto">
          {files.map((f) => (
            <HStack
              key={f.id}
              spacing={3}
              p={2}
              bg={COLORS.card}
              border={`1px solid ${COLORS.border}`}
              borderRadius="10px"
            >
              <Box
                position="relative"
                w="48px"
                h="48px"
                flexShrink={0}
                borderRadius="8px"
                overflow="hidden"
                bg={COLORS.inputBg}
              >
                {f.isVideo ? (
                  <>
                    <Box as="video" src={f.preview} muted w="100%" h="100%" objectFit="cover" />
                    <Flex
                      position="absolute"
                      inset={0}
                      align="center"
                      justify="center"
                      color="white"
                      fontSize="12px"
                    >
                      <FaPlay />
                    </Flex>
                  </>
                ) : (
                  <Image src={f.preview} alt={f.name} w="100%" h="100%" objectFit="cover" />
                )}
              </Box>

              <Box flex="1" minW={0}>
                <Text fontSize="12px" color={COLORS.text} noOfLines={1}>
                  {f.name}
                </Text>
                {f.status === "uploading" && (
                  <Progress
                    value={f.progress}
                    size="xs"
                    mt={1.5}
                    borderRadius="full"
                    bg={COLORS.inputBg}
                    sx={{ "& > div": { background: COLORS.accent } }}
                  />
                )}
                {f.status === "error" && (
                  <Text fontSize="10px" color={COLORS.danger} noOfLines={1}>
                    {f.error}
                  </Text>
                )}
                {f.status === "pending" && (
                  <Text fontSize="10px" color={COLORS.muted}>
                    {(f.file.size / (1024 * 1024)).toFixed(1)} MB
                  </Text>
                )}
                {f.status === "done" && (
                  <Text fontSize="10px" color={COLORS.accent}>
                    Uploaded
                  </Text>
                )}
              </Box>

              <Flex w="20px" justify="center" flexShrink={0}>
                {f.status === "done" ? (
                  <Icon as={FaCheckCircle} color={COLORS.accent} boxSize="14px" />
                ) : f.status === "error" ? (
                  <Icon as={FaTimesCircle} color={COLORS.danger} boxSize="14px" />
                ) : f.status === "uploading" ? (
                  <Text fontSize="10px" color={COLORS.muted}>
                    {f.progress}%
                  </Text>
                ) : (
                  <Box
                    as="button"
                    type="button"
                    onClick={() => removeFile(f.id)}
                    color={COLORS.muted}
                    _hover={{ color: COLORS.danger }}
                    aria-label="Remove file"
                  >
                    <FaTimes size={12} />
                  </Box>
                )}
              </Flex>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Modal>
  );
}
