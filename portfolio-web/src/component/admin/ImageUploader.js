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
} from "@chakra-ui/react";
import { ViewIcon, DeleteIcon } from "@chakra-ui/icons";

export default function ImageUploader({
  currentImage,
  onImageSelect,
  label = "Image",
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(currentImage || "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef();
  const toast = useToast();

  useEffect(() => {
    setSelectedImage(currentImage || "");
  }, [currentImage]);

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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for reading file
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setUploadProgress(50);

        const token = localStorage.getItem("token");

        setUploadProgress(70);

        const response = await fetch("/api/cloudinary/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64Image }),
        });

        setUploadProgress(90);
        const data = await response.json();

        if (data.success) {
          setUploadProgress(100);
          setSelectedImage(data.data.url);
          onImageSelect(data.data.url);
          toast({
            title: "Upload successful",
            description: "Image uploaded to Cloudinary",
            status: "success",
            duration: 3000,
          });
          // Refresh gallery
          fetchGallery();
        } else {
          clearInterval(progressInterval);
          setUploadProgress(0);
          toast({
            title: "Upload failed",
            description: data.message || "Failed to upload image",
            status: "error",
            duration: 3000,
          });
        }
      };
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      toast({
        title: "Error",
        description: "An error occurred during upload",
        status: "error",
        duration: 3000,
      });
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleGalleryOpen = () => {
    fetchGallery();
    onOpen();
  };

  const handleSelectFromGallery = (imageUrl) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
    onClose();
    toast({
      title: "Image selected",
      status: "success",
      duration: 2000,
    });
  };

  return (
    <Box>
      <Text color="#f7d794" mb={2} fontWeight="medium">
        {label}
      </Text>

      <VStack spacing={4} align="stretch">
        {/* Current Image Preview */}
        {selectedImage && (
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid #e2b714"
            maxW="300px"
          >
            <Image
              src={selectedImage}
              alt="Preview"
              objectFit="cover"
              w="100%"
              h="200px"
            />
          </Box>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <Box
            bg="rgba(35, 35, 35, 0.8)"
            p={4}
            borderRadius="lg"
            border="1px solid #e2b714"
            boxShadow="0 4px 16px rgba(226, 183, 20, 0.2)"
          >
            <Text
              color="#f7d794"
              fontSize="sm"
              mb={2}
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              fontWeight="medium"
            >
              Uploading... {uploadProgress}%
            </Text>
            <Progress
              value={uploadProgress}
              size="sm"
              colorScheme="yellow"
              borderRadius="full"
              hasStripe
              isAnimated
              bg="#191919"
              sx={{
                "& > div": {
                  background:
                    "linear-gradient(90deg, #e2b714 0%, #f7d794 50%, #e2b714 100%)",
                  boxShadow: "0 0 10px rgba(226, 183, 20, 0.5)",
                },
              }}
            />
            <Text
              color="#e2b714"
              fontSize="xs"
              mt={2}
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
              textAlign="center"
            >
              {uploadProgress < 30
                ? "Preparing image..."
                : uploadProgress < 70
                ? "Uploading to cloud..."
                : uploadProgress < 100
                ? "Finalizing..."
                : "Complete!"}
            </Text>
          </Box>
        )}

        {/* Action Buttons */}
        <HStack spacing={3}>
          <Button
            colorScheme="yellow"
            onClick={() => fileInputRef.current.click()}
            isLoading={uploading}
            loadingText="Uploading..."
            size="sm"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            Upload New
          </Button>

          <Button
            colorScheme="yellow"
            variant="outline"
            onClick={handleGalleryOpen}
            leftIcon={<ViewIcon />}
            size="sm"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            Choose from Gallery
          </Button>

          {selectedImage && (
            <Button
              colorScheme="red"
              variant="ghost"
              onClick={() => {
                setSelectedImage("");
                onImageSelect("");
              }}
              size="sm"
              fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
            >
              Clear
            </Button>
          )}
        </HStack>

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          display="none"
        />
      </VStack>

      {/* Gallery Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent bg="#272727" border="2px solid #e2b714" maxH="80vh">
          <ModalHeader
            color="#e2b714"
            fontFamily="Geist Mono, Fira Mono, Menlo, monospace"
          >
            Select Image from Gallery
          </ModalHeader>
          <ModalCloseButton color="#e2b714" />
          <ModalBody pb={6} overflowY="auto">
            {loadingGallery ? (
              <Box textAlign="center" py={10}>
                <Spinner color="#e2b714" size="xl" />
                <Text color="#f7d794" mt={4}>
                  Loading gallery...
                </Text>
              </Box>
            ) : gallery.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color="#f7d794">
                  No images in gallery yet. Upload your first image!
                </Text>
              </Box>
            ) : (
              <Grid
                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                gap={4}
              >
                {gallery.map((image) => (
                  <Box
                    key={image.publicId}
                    position="relative"
                    borderRadius="lg"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={
                      selectedImage === image.url ? "#e2b714" : "transparent"
                    }
                    cursor="pointer"
                    onClick={() => handleSelectFromGallery(image.url)}
                    _hover={{
                      borderColor: "#e2b714",
                      transform: "scale(1.02)",
                    }}
                    transition="all 0.2s"
                  >
                    <Image
                      src={image.url}
                      alt="Gallery image"
                      objectFit="cover"
                      w="100%"
                      h="150px"
                    />
                    {selectedImage === image.url && (
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="rgba(226, 183, 20, 0.3)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text
                          color="#fff"
                          fontWeight="bold"
                          bg="#e2b714"
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          Selected
                        </Text>
                      </Box>
                    )}
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
