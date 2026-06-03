import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Image,
  VStack,
  HStack,
  Text,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  IconButton,
  Input,
  Progress,
  AspectRatio,
} from "@chakra-ui/react";
import { ViewIcon, DeleteIcon } from "@chakra-ui/icons";

export default function MediaUploader({
  currentUrl,
  currentType,
  onMediaSelect,
  label = "Media (Image or Video)",
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(currentUrl || "");
  const [selectedType, setSelectedType] = useState(currentType || "image");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef();
  const toast = useToast();

  useEffect(() => {
    setSelectedUrl(currentUrl || "");
    setSelectedType(currentType || "image");
  }, [currentUrl, currentType]);

  const fetchGallery = async () => {
    setLoadingGallery(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/cloudinary/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setGallery(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Get Signature from our backend
      const token = localStorage.getItem("token");
      const signResponse = await fetch("/api/cloudinary/sign", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const signData = await signResponse.json();

      if (!signData.success) {
        throw new Error(signData.message || "Failed to get upload signature");
      }

      const { signature, timestamp, apiKey, cloudName } = signData;

      // 2. Upload directly to Cloudinary using FormData (No Base64!)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);
      formData.append("folder", "portfolio");

      // Using XMLHttpRequest to track raw upload progress
      const xhr = new XMLHttpRequest();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${file.type.startsWith("video/") ? "video" : "image"}/upload`;

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Cloudinary upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.open("POST", uploadUrl);
        xhr.send(formData);
      });

      const data = await uploadPromise;

      if (data.secure_url) {
        setUploadProgress(100);
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        
        setSelectedUrl(data.secure_url);
        setSelectedType(mediaType);
        onMediaSelect(data.secure_url, mediaType);
        
        toast({
          title: "Upload successful",
          description: "Media uploaded directly to Cloudinary",
          status: "success",
          duration: 3000,
        });
        fetchGallery();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during upload",
        status: "error",
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleSelectFromGallery = (mediaUrl) => {
    // Cloudinary metadata might be needed to determine if it's a video, 
    // but for now we'll check file extension or assume image if coming from 'images' gallery
    const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov)$|^.*\/video\/upload\/.*$/i);
    const mediaType = isVideo ? "video" : "image";
    
    setSelectedUrl(mediaUrl);
    setSelectedType(mediaType);
    onMediaSelect(mediaUrl, mediaType);
    onClose();
  };

  const renderPreview = (url, type, isGallery = false) => {
    if (type === "video" || url.match(/\.(mp4|webm|ogg|mov)$|^.*\/video\/upload\/.*$/i)) {
      return (
        <video
          src={url}
          controls
          style={{ width: "100%", height: isGallery ? "150px" : "200px", objectFit: "cover" }}
        />
      );
    }
    return (
      <Image
        src={url}
        alt="Preview"
        objectFit="cover"
        w="100%"
        h={isGallery ? "150px" : "200px"}
      />
    );
  };

  return (
    <Box>
      <Text color="#f7d794" mb={2} fontWeight="medium">
        {label}
      </Text>

      <VStack spacing={4} align="stretch">
        {selectedUrl && (
          <Box borderRadius="lg" overflow="hidden" border="2px solid #e2b714" maxW="400px">
            {renderPreview(selectedUrl, selectedType)}
          </Box>
        )}

        {uploading && (
          <Box bg="rgba(35, 35, 35, 0.8)" p={4} borderRadius="lg" border="1px solid #e2b714">
            <Text color="#f7d794" fontSize="sm" mb={2}>
              Uploading... {uploadProgress}%
            </Text>
            <Progress value={uploadProgress} size="sm" colorScheme="yellow" borderRadius="full" hasStripe isAnimated />
          </Box>
        )}

        <HStack spacing={3}>
          <Button
            colorScheme="yellow"
            onClick={() => fileInputRef.current.click()}
            isLoading={uploading}
            size="sm"
          >
            Upload New
          </Button>

          <Button
            colorScheme="yellow"
            variant="outline"
            onClick={() => { fetchGallery(); onOpen(); }}
            leftIcon={<ViewIcon />}
            size="sm"
          >
            Choose from Gallery
          </Button>

          {selectedUrl && (
            <Button
              colorScheme="red"
              variant="ghost"
              onClick={() => { setSelectedUrl(""); onMediaSelect("", "image"); }}
              size="sm"
            >
              Clear
            </Button>
          )}
        </HStack>

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          display="none"
        />
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent bg="#272727" border="2px solid #e2b714" maxH="80vh">
          <ModalHeader color="#e2b714">Select Media from Gallery</ModalHeader>
          <ModalCloseButton color="#e2b714" />
          <ModalBody pb={6} overflowY="auto">
            {loadingGallery ? (
              <Box textAlign="center" py={10}><Spinner color="#e2b714" size="xl" /></Box>
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
                {gallery.map((item) => (
                  <Box
                    key={item.publicId}
                    borderRadius="lg"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={selectedUrl === item.url ? "#e2b714" : "transparent"}
                    cursor="pointer"
                    onClick={() => handleSelectFromGallery(item.url)}
                  >
                    {renderPreview(item.url, "image", true)}
                  </Box>
                ))}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
